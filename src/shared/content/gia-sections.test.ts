import { describe, expect, it } from "vitest";
import {
  getGiaSectionByRendererKey,
  getGiaSectionBySlug,
  getGiaSections,
} from "./gia-sections";

describe("canonical GIA section metadata", () => {
  it.each([
    ["gia-9", 5],
    ["gia-11", 7],
  ] as const)("defines %s with strict unique identity", (exam, count) => {
    const sections = getGiaSections(exam);
    expect(sections).toHaveLength(count);
    expect(sections.map((section) => section.order)).toEqual(
      Array.from({ length: count }, (_, index) => index + 1),
    );
    expect(new Set(sections.map((section) => section.slug)).size).toBe(count);
    expect(new Set(sections.map((section) => section.rendererKey)).size).toBe(count);
    expect(new Set(sections.map((section) => section.documentSectionKey)).size).toBe(count);
    expect(sections.map((section) => section.rendererKey)).not.toContain(
      "gia-11.additional",
    );
  });

  it("resolves slugs and renderer keys without aliases", () => {
    expect(getGiaSectionBySlug("gia-11", "essay")?.rendererKey).toBe(
      "gia-11.essay",
    );
    expect(
      getGiaSectionByRendererKey("gia-11", "gia-11.analytics")?.slug,
    ).toBe("analytics");
    expect(getGiaSectionBySlug("gia-9", "unknown")).toBeNull();
  });
});
