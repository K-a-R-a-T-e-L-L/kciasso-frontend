import { expect, test } from "@playwright/test";
import { adminApiToken } from "./helpers/admin-api-token";

test("news publication commands and public visibility", async ({ page }) => {
  const base = process.env.KCIASSO_BACKEND_URL ?? "http://127.0.0.1:4490";
  const token = await adminApiToken(page);
  const runId = process.env.M8_RUN_ID ?? "local";
  const slug = `m8-${runId.toLowerCase()}-i83-${Date.now()}`;
  const created = await page.request.post(`${base}/api/admin/news`, { headers: { authorization: `Bearer ${token}` }, data: { title: `[M8 ${runId}] I8.3 publication`, slug, excerpt: "excerpt", content: "content" } });
  expect(created.status()).toBe(201);
  const id = (await created.json()).id;
  const draft = await page.request.post(`${base}/api/admin/news/${id}/publication`, { headers: { authorization: `Bearer ${token}` }, data: { command: "draft" } });
  expect(draft.status()).toBe(201);
  expect((await page.request.get(`${base}/api/public/news/${slug}`)).status()).toBe(404);
  const published = await page.request.post(`${base}/api/admin/news/${id}/publication`, { headers: { authorization: `Bearer ${token}` }, data: { command: "publish_now" } });
  expect(published.status()).toBe(201);
  expect((await page.request.get(`${base}/api/public/news/${slug}`)).status()).toBe(200);
});
