import { describe, expect, it } from "vitest";
import { parseNewsFormData } from "./news-form.serialization";

function form(values: Record<string, string>) { const data = new FormData(); for (const [key, value] of Object.entries(values)) data.set(key, value); return data; }

describe("news form serialization", () => {
  it("omits an empty slug so backend can generate it", () => expect(parseNewsFormData(form({ title:"Title", slug:"", excerpt:"Excerpt", content:"Content" })).slug).toBeUndefined());
  it("accepts only URL-only server cover mutations", () => {
    const key = `${"a".repeat(64)}.webp`; const url = `/api/public/news/media/${key}`;
    expect(parseNewsFormData(form({ coverMutationKind:"set", coverImageUrl:url, coverImageSource:"owned", pendingOwnedMediaKey:key })).coverMutation).toEqual({ kind:"set", url, source:"owned", pendingKey:key });
    expect(parseNewsFormData(form({ coverMutationKind:"set", coverImageUrl:"https://example.com/a.png", coverImageSource:"external" })).coverMutation).toEqual({ kind:"set", url:"https://example.com/a.png", source:"external" });
    expect(parseNewsFormData(form({ coverMutationKind:"remove" })).coverMutation).toEqual({ kind:"remove" });
  });
  it("rejects malformed hidden owned payload", () => expect(parseNewsFormData(form({ coverMutationKind:"set", coverImageUrl:"/api/public/news/media/nope.png", coverImageSource:"owned", pendingOwnedMediaKey:"nope.png" })).coverError).toBeTruthy());
});
