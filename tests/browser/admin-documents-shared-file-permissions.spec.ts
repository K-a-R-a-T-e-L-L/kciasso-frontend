import { expect, test } from "@playwright/test";
import { adminApiToken } from "./helpers/admin-api-token";

test("same bytes create independent logical documents without disclosure", async ({ page }) => {
  const base = process.env.KCIASSO_BACKEND_URL ?? "http://127.0.0.1:4490";
  const token = await adminApiToken(page);
  const runId = process.env.M8_RUN_ID ?? "local";
  const create = async (name: string) => {
    const form = new FormData();
    form.append("placementKeys", "gia-9.normative-documents");
    form.append("title", `[M8 ${runId}] shared ${name}`);
    form.append("file", new Blob(["%PDF-1.7\nshared\n%%EOF"], { type: "application/pdf" }), `m8-${runId}-${name}.pdf`);
    return page.request.post(`${base}/api/admin/documents`, { headers: { authorization: `Bearer ${token}` }, multipart: form });
  };
  const [first, second] = await Promise.all([create("a"), create("b")]);
  expect(first.status()).toBe(201);
  expect(second.status()).toBe(201);
  expect(JSON.stringify(await second.json())).not.toMatch(/storedFile|storageKey/i);
});
