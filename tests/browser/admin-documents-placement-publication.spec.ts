import { expect, test } from "@playwright/test";
import { adminApiToken } from "./helpers/admin-api-token";

test("placement publication is independent", async ({ page }) => {
  const base = process.env.KCIASSO_BACKEND_URL ?? "http://127.0.0.1:4490";
  const token = await adminApiToken(page);
  const runId = process.env.M8_RUN_ID ?? "local";
  const form = new FormData();
  form.append("placementKeys", "gia-9.normative-documents");
  form.append("title", `[M8 ${runId}] placement`);
  form.append("file", new Blob(["%PDF-1.7\nm8\n%%EOF"], { type: "application/pdf" }), `m8-${runId}.pdf`);
  const created = await page.request.post(`${base}/api/admin/documents`, { headers: { authorization: `Bearer ${token}` }, multipart: form });
  expect(created.status()).toBe(201);
  const id = (await created.json()).id;
  const publication = await page.request.post(`${base}/api/admin/documents/${id}/placements/gia-9.normative-documents/publication`, { headers: { authorization: `Bearer ${token}` }, data: { command: "publish_now" } });
  expect(publication.status()).toBe(201);
  const list = await page.request.get(`${base}/api/public/documents?sectionKey=gia-9.normative-documents`);
  expect(list.status()).toBe(200);
  expect((await list.json()).some((item: { id: number }) => item.id === id)).toBe(true);
});
