import { expect, test } from "@playwright/test";
import { loginAsAdmin } from "./helpers/admin-auth";

test.describe("admin page layouts", () => {
  test("shows the styled registry and supports editor navigation", async ({ page }) => {
    await loginAsAdmin(page);
    await page.goto("/admin/pages");
    await expect(page.getByTestId("admin-pages-list").last()).toBeVisible();
    await expect(page.getByRole("heading", { name: "Страницы и секции" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Главная страница" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Архив новостей" })).toBeVisible();
    await expect(page.getByText("home", { exact: true })).toBeVisible();
    await expect(page.getByText("Редактировать →").first()).toBeVisible();
    await expect(page.locator("ul")).toHaveCount(0);
    await page.getByRole("link", { name: "Редактировать →" }).first().click();
    await expect(page.getByTestId("page-layout-editor").last()).toBeVisible();
    await expect(page.getByRole("link", { name: /Ко всем страницам/ })).toBeVisible();
    await expect(page.getByRole("button", { name: /Добавить HTML-секцию/ })).toBeVisible();
  });
});
