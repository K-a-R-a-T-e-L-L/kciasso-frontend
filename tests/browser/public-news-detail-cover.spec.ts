import { expect, test } from "@playwright/test";

test.describe("public news detail cover", () => {
  test("renders at most one cover without overflow", async ({ page }) => {
    await page.goto("/news");
    const link = page.locator('a[href^="/news/"]').first();
    await expect(link).toBeVisible();
    await link.click();
    const covers = page.locator("article img");
    await expect(covers).toHaveCount(0, { timeout: 1000 }).catch(async () => expect(covers).toHaveCount(1));
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
    expect(await page.locator("body").evaluate((body) => body.innerText.length)).toBeGreaterThan(0);
  });
});
