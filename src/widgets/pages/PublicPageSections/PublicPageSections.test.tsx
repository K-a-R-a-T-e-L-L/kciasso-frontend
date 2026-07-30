import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import type { PublicPageSectionViewModel } from "@/shared/api/adapters/page-layout.adapter";
import PublicPageSections from "./PublicPageSections";
import { PublicSystemSectionsProvider } from "./public-system-renderers";

const section = (
  overrides: Partial<PublicPageSectionViewModel>,
): PublicPageSectionViewModel => ({
  type: "PAGE_SYSTEM",
  key: "home.hero",
  name: "Section",
  systemRendererKey: "home.hero",
  html: null,
  css: null,
  javascript: null,
  iframeHeight: null,
  isGlobal: false,
  sortOrder: 0,
  ...overrides,
});

describe("PublicPageSections", () => {
  it("renders system and custom sections in the untouched mixed input order", () => {
    const sections = [
      section({ key: "home.hero", systemRendererKey: "home.hero" }),
      section({
        type: "PAGE_CUSTOM_HTML",
        key: "page.custom",
        systemRendererKey: null,
        html: "<p>page custom</p>",
      }),
      section({
        type: "GLOBAL_CUSTOM_HTML",
        key: "global.custom",
        systemRendererKey: null,
        html: "<p>global custom</p>",
        isGlobal: true,
      }),
      section({
        type: "GLOBAL_SYSTEM",
        key: "global.contacts",
        systemRendererKey: "global.contacts",
        isGlobal: true,
      }),
    ];

    render(
      <PublicSystemSectionsProvider
        sections={{
          "home.hero": <span>Hero</span>,
          "global.contacts": <span>Contacts</span>,
        }}
      >
        <PublicPageSections pageKey="home" sections={sections} />
      </PublicSystemSectionsProvider>,
    );

    const wrappers = screen.getAllByTestId("public-page-section");
    expect(wrappers).toHaveLength(4);
    expect(wrappers.map((item) => item.dataset.sectionKey)).toEqual([
      "home.hero",
      "page.custom",
      "global.custom",
      "global.contacts",
    ]);
    expect(wrappers.map((item) => item.dataset.sectionIndex)).toEqual([
      "0",
      "1",
      "2",
      "3",
    ]);
    expect(within(wrappers[0]).getByText("Hero")).toBeInTheDocument();
    expect(within(wrappers[3]).getByText("Contacts")).toBeInTheDocument();
    expect(screen.getAllByTitle("Section")).toHaveLength(2);
  });

  it("makes an unknown section type observable", () => {
    expect(() =>
      render(
        <PublicPageSections
          pageKey="home"
          sections={[
            section({ type: "UNKNOWN" as PublicPageSectionViewModel["type"] }),
          ]}
        />,
      ),
    ).toThrow("UNKNOWN_PUBLIC_SECTION_TYPE");
  });
});
