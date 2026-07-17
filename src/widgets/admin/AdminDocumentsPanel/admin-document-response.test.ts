import { describe, expect, it, vi } from "vitest";
import { parseResponse } from "./admin-document-response";

describe("admin document response boundary", () => {
  it("treats 204 as success without reading JSON", async () => {
    const response = new Response(null, { status: 204 }); response.json = vi.fn();
    await expect(parseResponse(response)).resolves.toBeNull(); expect(response.json).not.toHaveBeenCalled();
  });

  it("does not parse an empty successful body as JSON", async () => {
    await expect(parseResponse(new Response("", { status: 200 }))).resolves.toBeNull();
  });
});
