import { describe, expect, it } from "vitest";
import type { AdminPageSection } from "@/shared/api/adapters/admin-page-layout.adapter";
import {
  PAGE_DND_SENSOR_OPTIONS,
  clampPreviewHeight,
  pageUiModel,
  reorderFailureState,
  reorderSections,
  sectionActionModel,
  sectionUiModel,
} from "./admin-section-view-model";

const section = (type: AdminPageSection["type"], overrides: Partial<AdminPageSection> = {}): AdminPageSection => ({
  placementId: 1,
  definitionId: 1,
  type,
  key: null,
  name: "Тестовая секция",
  description: null,
  systemRendererKey: null,
  sortOrder: 0,
  isVisible: true,
  isGlobal: type.startsWith("GLOBAL"),
  ownerPageKey: type.startsWith("PAGE") ? "home" : null,
  iframeHeight: null,
  canEditContent: type === "PAGE_CUSTOM_HTML",
  canDelete: type === "PAGE_CUSTOM_HTML",
  canToggle: true,
  canReorder: true,
  editHref: type === "GLOBAL_CUSTOM_HTML" ? "/admin/pages?tab=global" : null,
  definitionRevision: 1,
  ...overrides,
});

describe("sectionUiModel", () => {
  it("maps all registry page keys to exact friendly titles", () => {
    expect([
      "home",
      "news.archive",
      "news.article",
      "gia",
      "gia.9",
      "gia.11",
      "quality",
      "quality.section",
      "regional-project",
      "regional-project.section",
      "about",
      "about.contacts",
      "resources",
    ].map((pageKey) => pageUiModel(pageKey).title)).toEqual([
      "Главная",
      "Архив новостей",
      "Страница новости",
      "Государственная итоговая аттестация",
      "ГИА-9",
      "ГИА-11",
      "Качество образования",
      "Раздел качества образования",
      "Региональный проект",
      "Раздел регионального проекта",
      "О центре",
      "Контакты",
      "Ресурсы",
    ]);
  });

  it("does not expose raw key or revision in the primary page model", () => {
    expect(pageUiModel("home")).toEqual({ title: "Главная" });
    expect(pageUiModel("home")).not.toHaveProperty("revision");
    expect(pageUiModel("home")).not.toHaveProperty("pageKey");
  });

  it("maps contacts to site settings without a raw renderer label", () => {
    const model = sectionUiModel({ type: "GLOBAL_SYSTEM", name: "contacts", description: null, systemRendererKey: "global.contacts", key: "global.contacts" });
    expect(model.settingsHref).toBe("/admin/site-settings");
    expect(model.friendlyTitle).not.toBe("global.contacts");
  });

  it("keeps custom HTML mutable and gives unknown renderers a human fallback", () => {
    expect(sectionUiModel({ type: "PAGE_CUSTOM_HTML", name: "Custom", description: null, systemRendererKey: null, key: null }).immutableReason).toBeNull();
    expect(sectionUiModel({ type: "PAGE_SYSTEM", name: "x", description: null, systemRendererKey: "unknown", key: null }).friendlyTitle).not.toBe("unknown");
  });

  it.each([
    ["PAGE_SYSTEM", { edit: false, remove: false, preview: false, globalHref: null }],
    ["GLOBAL_SYSTEM", { edit: false, remove: false, preview: false, globalHref: null }],
    ["PAGE_CUSTOM_HTML", { edit: true, remove: true, preview: true, globalHref: null }],
    ["GLOBAL_CUSTOM_HTML", { edit: false, remove: false, preview: true, globalHref: "/admin/pages?tab=global" }],
  ] as const)("returns the exact %s action matrix", (type, expected) => {
    expect(sectionActionModel(section(type))).toMatchObject(expected);
  });

  it("never represents unavailable edit/delete as disabled actions", () => {
    expect(sectionActionModel(section("PAGE_SYSTEM")).actions).toEqual(["toggle", "reorder"]);
    expect(sectionActionModel(section("GLOBAL_CUSTOM_HTML")).actions).toEqual(["toggle", "reorder", "preview", "open-global"]);
  });

  it.each([
    [undefined, 260],
    [100, 160],
    [300, 300],
    [900, 420],
  ])("clamps preview height %s to %s", (value, expected) => {
    expect(clampPreviewHeight(value)).toBe(expected);
  });

  it("declares pointer, touch and keyboard sensor contracts", () => {
    expect(PAGE_DND_SENSOR_OPTIONS).toEqual({
      pointer: { activationConstraint: { distance: 7 } },
      touch: { activationConstraint: { delay: 250, tolerance: 5 } },
      keyboard: true,
    });
  });

  it("calculates an immediate optimistic order", () => {
    const items = [section("PAGE_SYSTEM", { placementId: 1 }), section("PAGE_SYSTEM", { placementId: 2 })];
    expect(reorderSections(items, 1, 2).map((item) => item.placementId)).toEqual([2, 1]);
  });

  it("rolls back to the previous order after a generic failure", () => {
    const previous = [section("PAGE_SYSTEM", { placementId: 1 }), section("PAGE_SYSTEM", { placementId: 2 })];
    expect(reorderFailureState(previous, false)).toEqual({ sections: previous, reload: false });
  });

  it("requests authoritative reload after a stale revision", () => {
    const previous = [section("PAGE_SYSTEM")];
    expect(reorderFailureState(previous, true)).toEqual({ sections: previous, reload: true });
  });
});
