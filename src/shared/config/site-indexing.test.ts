import { afterEach, describe, expect, it } from "vitest";
import { getSiteRobotsMetadata, isSiteNoindexEnabled } from "./site-indexing";

const original = process.env.SITE_NOINDEX;

afterEach(() => {
  if (original === undefined) delete process.env.SITE_NOINDEX;
  else process.env.SITE_NOINDEX = original;
});

describe("site indexing", () => {
  it.each(["false", "anything", "TRUE", undefined])("does not enable noindex for %s", (value) => {
    if (value === undefined) delete process.env.SITE_NOINDEX;
    else process.env.SITE_NOINDEX = value;
    expect(isSiteNoindexEnabled()).toBe(false);
    expect(getSiteRobotsMetadata()).toBeUndefined();
  });

  it("disables indexing, following and archiving for general bots and image indexing for Googlebot", () => {
    process.env.SITE_NOINDEX = "true";
    expect(isSiteNoindexEnabled()).toBe(true);
    expect(getSiteRobotsMetadata()).toEqual({
      index: false,
      follow: false,
      noarchive: true,
      googleBot: { index: false, follow: false, noimageindex: true },
    });
  });
});
