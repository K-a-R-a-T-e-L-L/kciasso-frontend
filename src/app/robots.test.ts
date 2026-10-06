import { describe, expect, it } from "vitest";
import robots from "./robots";

describe("robots.txt", () => {
  it("allows crawlers to read noindex on published pages", () => {
    expect(robots()).toEqual({ rules: { userAgent: "*", allow: "/" } });
  });
});
