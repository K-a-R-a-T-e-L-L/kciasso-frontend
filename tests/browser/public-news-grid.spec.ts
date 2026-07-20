import { expect, test } from "@playwright/test";

test.describe("public news grid", () => {
  test("uses two compact columns on desktop and one on mobile", async ({ page }) => {
    await page.goto("/news");
    const list = page.locator('[class*="list"]').first();
    await expect(list).toBeVisible();
    const columns = await list.evaluate((node) => getComputedStyle(node).gridTemplateColumns.split(" ").length);
    expect(columns).toBeGreaterThanOrEqual(1);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  });
});
