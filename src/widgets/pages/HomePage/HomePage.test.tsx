import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import HomePage from "./HomePage";

const homeKeys = [
  "home.hero",
  "home.carousel",
  "home.main-sections",
  "home.important-resources",
  "home.gia",
  "home.official-resources",
  "global.contacts",
] as const;

vi.mock("@/shared/api/adapters/page-layout.adapter", () => ({
  getPublicPageLayout: vi.fn(async () => ({
    pageKey: "home",
    sections: homeKeys.map((key, sortOrder) => ({
      type: key === "global.contacts" ? "GLOBAL_SYSTEM" : "PAGE_SYSTEM",
      key,
      name: key,
      systemRendererKey: key,
      html: null,
      css: null,
      javascript: null,
      iframeHeight: null,
      isGlobal: key === "global.contacts",
      sortOrder,
    })),
  })),
}));

vi.mock("@/shared/api/adapters/site-settings.adapter", () => ({
  getPublicSiteSettings: vi.fn(async () => ({ marker: "contacts" })),
}));

vi.mock("@/shared/api/adapters/home.adapter", () => ({
  getHomePageData: vi.fn(async () => ({
    homeDirections: [
      { title: "One", href: "/one", description: "One" },
      { title: "Two", href: "/two", description: "Two" },
      { title: "Three", href: "/three", description: "Three" },
    ],
    latestNewsPreview: [],
    giaReferenceHub: { href: "/gia", cards: [] },
    officialResourceCards: [],
    services: [],
  })),
}));

vi.mock("@/widgets/pages/HomeImageCarousel/HomeImageCarousel.client", () => ({
  default: () => <div data-testid="home-carousel">Carousel</div>,
}));

vi.mock(
  "@/widgets/sections/UniversalContactsSection/PublicContactsBoundary.client",
  () => ({
    default: () => <div data-testid="public-contacts">Contacts</div>,
  }),
);

describe("HomePage ordered sections", () => {
  it("renders the exact seven home placements once and in API order", async () => {
    render(await HomePage());

    const wrappers = Array.from(
      document.querySelectorAll<HTMLElement>("[data-page-section]"),
    );
    expect(
      wrappers.map((wrapper) => wrapper.dataset.systemRendererKey),
    ).toEqual(homeKeys);
    expect(wrappers).toHaveLength(7);
    expect(screen.getByTestId("home-carousel")).toBeInTheDocument();
    expect(screen.getAllByTestId("public-contacts")).toHaveLength(1);
    expect(
      document.querySelector('[data-system-renderer-key="home.slider"]'),
    ).not.toBeInTheDocument();
    expect(
      document.querySelector('[data-system-renderer-key="home.quick-access"]'),
    ).not.toBeInTheDocument();
    expect(
      document.querySelector('[data-system-renderer-key="home.resources"]'),
    ).not.toBeInTheDocument();
    expect(
      document.querySelector('[data-system-renderer-key="home.gia-reference"]'),
    ).not.toBeInTheDocument();
  });
});
