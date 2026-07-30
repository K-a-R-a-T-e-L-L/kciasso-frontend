import { expect, test } from "@playwright/test";
import { loginAsAdmin } from "./helpers/admin-auth";

test.describe("admin pages custom HTML", () => {
  test("creates, previews, persists and removes a custom section", async ({ page }) => {
    await loginAsAdmin(page);
    await page.goto("/admin/pages/home");
    const runId = process.env.M8_RUN_ID ?? "local";
    const name = `[M8 ${runId}] Browser HTML`;
    await page.getByRole("button", { name: "Добавить HTML-секцию" }).click();
    await page.getByLabel("Название").fill(name);
    await page.getByLabel("HTML/CSS/JavaScript").fill("<div id=browser-custom>Browser custom section</div>");
    await page.getByRole("button", { name: "Создать HTML-секцию" }).click();
    const row = page.locator("li").filter({ hasText: name }).last();
    await expect(row).toBeVisible();
    await expect(row.locator("iframe")).toBeVisible();
    await expect(row.locator("iframe").contentFrame()!.locator("#browser-custom")).toHaveText("Browser custom section");
    await page.reload();
    await expect(page.locator("li").filter({ hasText: name }).last()).toBeVisible();
    await row.getByRole("button", { name: "Удалить" }).click();
    await expect(page.locator("li").filter({ hasText: name }).filter({ visible: true })).toHaveCount(0);
  });
});
