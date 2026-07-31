import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import PublicSystemSectionRenderer from "./PublicSystemSectionRenderer";
import {
  KNOWN_PUBLIC_SYSTEM_RENDERER_KEYS,
  PUBLIC_SYSTEM_RENDERERS,
  PublicSystemSectionsProvider,
} from "./public-system-renderers";

describe("PublicSystemSectionRenderer", () => {
  it("has one callable mapping for every backend registry renderer key", () => {
    expect(KNOWN_PUBLIC_SYSTEM_RENDERER_KEYS).toHaveLength(31);
    expect(new Set(KNOWN_PUBLIC_SYSTEM_RENDERER_KEYS).size).toBe(31);
    expect(KNOWN_PUBLIC_SYSTEM_RENDERER_KEYS).toEqual(
      expect.arrayContaining(["gia-11.essay", "gia-11.analytics"]),
    );
    expect(KNOWN_PUBLIC_SYSTEM_RENDERER_KEYS).not.toContain(
      "gia-11.additional",
    );
    for (const key of KNOWN_PUBLIC_SYSTEM_RENDERER_KEYS) {
      expect(PUBLIC_SYSTEM_RENDERERS[key]).toEqual(expect.any(Function));
    }
  });

  it("renders supplied known content", () => {
    render(
      <PublicSystemSectionsProvider
        sections={{ "home.carousel": <span>Carousel</span> }}
      >
        <PublicSystemSectionRenderer
          pageKey="home"
          systemRendererKey="home.carousel"
        />
      </PublicSystemSectionsProvider>,
    );
    expect(screen.getByText("Carousel")).toBeInTheDocument();
  });

  it("renders an observable fallback for an unknown renderer", () => {
    const error = vi.spyOn(console, "error").mockImplementation(() => undefined);
    render(
      <PublicSystemSectionRenderer
        pageKey="home"
        systemRendererKey="home.future"
      />,
    );
    expect(screen.getByRole("status")).toHaveAttribute(
      "data-unknown-system-renderer",
      "home.future",
    );
    expect(screen.getByText("Раздел временно недоступен")).toBeInTheDocument();
    expect(error).toHaveBeenCalledWith(
      "UNKNOWN_PUBLIC_SYSTEM_RENDERER",
      expect.objectContaining({
        pageKey: "home",
        systemRendererKey: "home.future",
      }),
    );
    error.mockRestore();
  });
});
