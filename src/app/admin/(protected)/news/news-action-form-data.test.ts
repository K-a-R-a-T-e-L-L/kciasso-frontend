import { describe, expect, it } from "vitest";
import { buildNewsActionFormData } from "./news-action-form-data";

describe("buildNewsActionFormData", () => {
  it("keeps text fields and emits URL-only owned cover fields", () => {
    const form = document.createElement("form");
    form.innerHTML = '<input name="title" value="Title"><input name="coverImageFile" type="file"><input name="coverImageUrl" value="stale"><input name="coverImageSource" value="external"><input name="pendingOwnedMediaKey" value="stale"><input name="removeCover" value="1">';
    const data = buildNewsActionFormData(form, { kind: "set", url: "/api/public/news/media/key.jpg", source: "owned", key: "key.jpg" });
    expect(data.get("title")).toBe("Title");
    expect(data.get("coverMutationKind")).toBe("set");
    expect(data.get("coverImageUrl")).toBe("/api/public/news/media/key.jpg");
    expect(data.get("coverImageSource")).toBe("owned");
    expect(data.get("pendingOwnedMediaKey")).toBe("key.jpg");
    expect(data.has("removeCover")).toBe(false);
    expect(data.has("coverImageFile")).toBe(false);
  });
});
