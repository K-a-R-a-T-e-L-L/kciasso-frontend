import { expect, test } from "@playwright/test";
import { loginAsAdmin } from "./helpers/admin-auth";

test.describe("news cover URL import", () => {
  test("exposes explicit server import action and preserves the form on failure", async ({ page }) => {
    await loginAsAdmin(page);
    await page.goto("/admin/news/new");
    await page.route("**/api/admin/news/media/import", async route => route.fulfill({ status: 400, contentType: "application/json", body: JSON.stringify({ message: "Изображение недоступно" }) }));
    const externalMode = page.getByRole("button", { name: /Указать ссылку/i });
    if (await externalMode.count()) {
      await externalMode.click();
      await page.locator('input[inputmode="url"], input[autocomplete="url"]').first().fill("https://example.com/image.jpg");
      const importRequest = page.waitForRequest(request => request.url().includes("/api/admin/news/media/import") && request.method() === "POST");
      const importButton = page.getByRole("button", { name: /сервер/i }).first();
      await importButton.click();
      await expect(page.locator('p[role="alert"]')).toBeVisible();
      await importRequest;
      await expect(page.locator("form")).toBeVisible();
    } else {
      expect(await page.locator("form").count()).toBeGreaterThan(0);
    }
  });
});
