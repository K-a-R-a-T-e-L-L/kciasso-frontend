import { describe, expect, it } from "vitest";
import type { PublicPageLayoutResponseDto } from "@/shared/api/generated/types";
import { mapPublicPageLayout } from "./page-layout.adapter";

describe("mapPublicPageLayout", () => {
  it("maps every generated field exactly and preserves API order", () => {
    const input: PublicPageLayoutResponseDto = {
      pageKey: "home",
      sections: [
        {
          type: "PAGE_SYSTEM",
          key: "home.hero",
          name: "Hero",
          systemRendererKey: "home.hero",
          html: null,
          css: null,
          javascript: null,
          iframeHeight: null,
          isGlobal: false,
          sortOrder: 20,
        },
        {
          type: "GLOBAL_SYSTEM",
          key: "global.contacts",
          name: "Contacts",
          systemRendererKey: "global.contacts",
          html: null,
          css: null,
          javascript: null,
          iframeHeight: null,
          isGlobal: true,
          sortOrder: 40,
        },
        {
          type: "PAGE_CUSTOM_HTML",
          key: null,
          name: "Page custom",
          systemRendererKey: null,
          html: "<p>page</p>",
          css: "p{}",
          javascript: "window.page = true",
          iframeHeight: 321,
          isGlobal: false,
          sortOrder: 10,
        },
        {
          type: "GLOBAL_CUSTOM_HTML",
          key: "legacy.global-html.1",
          name: "Global custom",
          systemRendererKey: null,
          html: "<p>global</p>",
          css: null,
          javascript: null,
          iframeHeight: null,
          isGlobal: true,
          sortOrder: 30,
        },
      ],
    };

    const result = mapPublicPageLayout(input);

    expect(result).toEqual(input);
    expect(result.sections.map((section) => section.type)).toEqual([
      "PAGE_SYSTEM",
      "GLOBAL_SYSTEM",
      "PAGE_CUSTOM_HTML",
      "GLOBAL_CUSTOM_HTML",
    ]);
    expect(Object.keys(result.sections[0])).not.toEqual(
      expect.arrayContaining([
        "systemKey",
        "isEnabled",
        "rawHtml",
        "iframeHeightPx",
        "slot",
        "primary",
      ]),
    );
  });
});
