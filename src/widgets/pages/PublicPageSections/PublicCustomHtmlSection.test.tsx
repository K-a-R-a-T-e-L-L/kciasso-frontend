import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import PublicCustomHtmlSection from "./PublicCustomHtmlSection";

describe("PublicCustomHtmlSection", () => {
  it("builds a safe srcDoc iframe with the exact sandbox", () => {
    render(
      <PublicCustomHtmlSection
        section={{
          type: "PAGE_CUSTOM_HTML",
          key: null,
          name: "Custom",
          systemRendererKey: null,
          html: "<main>HTML</main>",
          css: "main { color: red; }",
          javascript: "window.customLoaded = true;",
          iframeHeight: 440,
          isGlobal: false,
          sortOrder: 3,
        }}
      />,
    );

    const iframe = screen.getByTitle("Custom");
    expect(iframe).toHaveAttribute(
      "sandbox",
      "allow-scripts allow-forms allow-modals allow-popups allow-downloads",
    );
    expect(iframe).toHaveAttribute("referrerpolicy", "no-referrer");
    expect(iframe.getAttribute("sandbox")).not.toMatch(
      /allow-same-origin|allow-top-navigation/,
    );
    expect(iframe).toHaveAttribute(
      "srcdoc",
      expect.stringContaining("<style>main { color: red; }</style>"),
    );
    expect(iframe).toHaveAttribute(
      "srcdoc",
      expect.stringContaining("<main>HTML</main>"),
    );
    expect(iframe).toHaveAttribute(
      "srcdoc",
      expect.stringContaining("<script>window.customLoaded = true;</script>"),
    );
  });
});
