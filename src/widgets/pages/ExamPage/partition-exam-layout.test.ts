import { describe, expect, it } from "vitest";
import type { PublicPageSectionViewModel } from "@/shared/api/adapters/page-layout.adapter";
import {
  partitionExamLayout,
  selectGiaSectionLayout,
} from "./partition-exam-layout";

const section = (
  rendererKey: string | null,
  type: PublicPageSectionViewModel["type"] = "PAGE_SYSTEM",
): PublicPageSectionViewModel => ({
  type,
  key: rendererKey,
  name: rendererKey ?? "Custom",
  systemRendererKey: rendererKey,
  html: type.includes("CUSTOM") ? "<p>custom</p>" : null,
  css: null,
  javascript: null,
  iframeHeight: null,
  isGlobal: type.startsWith("GLOBAL"),
  sortOrder: 0,
});

describe("partitionExamLayout", () => {
  it("preserves API order inside hero, content and contacts partitions", () => {
    const result = partitionExamLayout("gia-11", [
      section("gia-11.hero"),
      section("gia-11.analytics"),
      section(null, "PAGE_CUSTOM_HTML"),
      section("gia-11.essay"),
      section("global.contacts", "GLOBAL_SYSTEM"),
    ]);
    expect(result.hero.map((item) => item.systemRendererKey)).toEqual([
      "gia-11.hero",
    ]);
    expect(result.content.map((item) => item.systemRendererKey)).toEqual([
      "gia-11.analytics",
      null,
      "gia-11.essay",
    ]);
    expect(result.contacts.map((item) => item.systemRendererKey)).toEqual([
      "global.contacts",
    ]);
  });

  it("rejects obsolete and unknown system renderers", () => {
    expect(() =>
      partitionExamLayout("gia-11", [section("gia-11.additional")]),
    ).toThrow("UNKNOWN_GIA_LAYOUT_RENDERER:gia-11:gia-11.additional");
  });

  it("keeps global custom sections on a GIA child route in API order", () => {
    const result = selectGiaSectionLayout("gia-11", "gia-11.essay", [
      section("gia-11.hero"),
      section("gia-11.analytics"),
      section("gia-11.essay"),
      section("global.contacts", "GLOBAL_SYSTEM"),
      section(null, "GLOBAL_CUSTOM_HTML"),
    ]);

    expect(result.map((item) => [item.type, item.systemRendererKey])).toEqual([
      ["PAGE_SYSTEM", "gia-11.hero"],
      ["PAGE_SYSTEM", "gia-11.essay"],
      ["GLOBAL_SYSTEM", "global.contacts"],
      ["GLOBAL_CUSTOM_HTML", null],
    ]);
  });
});
