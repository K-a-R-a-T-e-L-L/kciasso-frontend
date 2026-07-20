import { expect, test } from "@playwright/test";
import { loginAsAdmin } from "./helpers/admin-auth";

test.describe("admin news category reorder", () => {
  test("shows bounded up/down controls", async ({ page }) => {
    await loginAsAdmin(page);
    await page.goto("/admin/news/categories");
    const rows = page.locator("tbody tr");
    await expect(rows.first()).toBeVisible();
    await expect(page.getByRole("button", { name: "Переместить рубрику вверх" }).first()).toBeDisabled();
    await expect(page.getByRole("button", { name: "Переместить рубрику вниз" }).last()).toBeDisabled();
    await expect(page.locator('input[name="order"]')).toHaveCount(0);
  });
});
