import { describe, expect, it } from "vitest";
import { classifyNewsCover, isOwnedNewsMediaUrl, ownedNewsMediaKeyFromUrl } from "./news-cover";

const key = `${"a".repeat(64)}.png`;
describe("news cover classifier", () => {
  it("classifies null as none and canonical relative media as owned", () => { expect(classifyNewsCover(null)).toEqual({ kind:"none" }); expect(classifyNewsCover(`/api/public/news/media/${key}`)).toMatchObject({ kind:"owned", key }); });
  it("does not trust external lookalike URLs", () => { expect(isOwnedNewsMediaUrl(`https://example.com/api/public/news/media/${key}`)).toBe(false); expect(ownedNewsMediaKeyFromUrl(`https://example.com/api/public/news/media/${key}`)).toBeNull(); });
});
