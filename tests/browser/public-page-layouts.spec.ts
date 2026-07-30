import { expect, test } from "@playwright/test";

test.describe("public ordered page layouts", () => {
  test("serves public route templates without horizontal overflow", async ({ page, request }) => {
    const backend = process.env.KCIASSO_BACKEND_URL ?? "http://127.0.0.1:4490";
    const routes = ["/", "/news", "/gia", "/gia-9", "/gia-11", "/kachestvo-obrazovaniya", "/o-centre", "/o-centre/kontakty", "/regionalnyy-proekt", "/resources"];
    for (const route of routes) {
      const response = await page.goto(route, { waitUntil: "domcontentloaded" });
      expect(response?.status(), route).toBe(200);
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1), route).toBe(true);
    }
    const keys = ["home", "news.archive", "news.article", "gia", "gia.9", "gia.11", "quality", "quality.section", "regional-project", "regional-project.section", "about", "about.contacts", "resources"];
    for (const key of keys) expect((await request.get(`${backend}/api/public/pages/${encodeURIComponent(key)}/layout`)).status(), key).toBe(200);
  });
});
