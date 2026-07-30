import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import {
  FRONTEND_PAGE_KEYS,
  assertFrontendPageRegistryParity,
} from "./OrderedPublicPage";

vi.mock("@/shared/api/adapters/page-layout.adapter", () => ({
  getPublicPageLayout: vi.fn(async () => ({
    pageKey: "resources",
    sections: [
      {
        type: "PAGE_SYSTEM",
        key: "resources.catalog",
        name: "Resources",
        systemRendererKey: "resources.catalog",
        html: null,
        css: null,
        javascript: null,
        iframeHeight: null,
        isGlobal: false,
        sortOrder: 0,
      },
    ],
  })),
}));

vi.mock("@/shared/api/adapters/site-settings.adapter", () => ({
  getPublicSiteSettings: vi.fn(async () => ({ marker: "contacts" })),
}));

vi.mock(
  "@/widgets/sections/UniversalContactsSection/PublicContactsBoundary.client",
  () => ({ default: () => <div>Contacts</div> }),
);

describe("public page registry parity", () => {
  it("contains every backend registry key once", () => {
    expect(assertFrontendPageRegistryParity(FRONTEND_PAGE_KEYS)).toBe(true);
    expect(new Set(FRONTEND_PAGE_KEYS).size).toBe(13);
  });

  it("is a thin ordered runtime wrapper for route-owned system content", async () => {
    const { default: OrderedPublicPage } = await import("./OrderedPublicPage");
    render(
      await OrderedPublicPage({
        pageKey: "resources",
        systemSections: {
          "resources.catalog": <div>Resource catalog</div>,
        },
      }),
    );

    expect(screen.getByText("Resource catalog")).toBeInTheDocument();
    expect(
      document.querySelectorAll("[data-page-section]"),
    ).toHaveLength(1);
  });
});
