import { expect, test } from "@playwright/test";
import { loginAsAdmin } from "./helpers/admin-auth";
import { startNetworkAudit } from "./helpers/network-audit";

const titles = ["Главная страница", "Архив новостей", "Страница новости", "Государственная итоговая аттестация", "ГИА-9", "ГИА-11", "Качество образования", "Раздел качества образования", "Региональный проект", "Раздел регионального проекта", "О центре", "Контакты", "Полезные ресурсы"];

test.describe("admin pages navigation", () => {
  test("desktop/mobile list and editor have a single navigation flow", async ({ page }) => {
    const audit = startNetworkAudit(page);
    await loginAsAdmin(page);
    if (page.viewportSize()?.width === 390) {
      await page.getByRole("button", { name: "Открыть меню администратора" }).click();
    }
    await expect(page.getByRole("link", { name: "Страницы" })).toBeVisible();
    await page.getByRole("link", { name: "Страницы" }).click();
    await expect(page).toHaveURL(/\/admin\/pages$/);
    await expect(page.getByTestId("admin-pages-list").last()).toBeVisible();
    for (const title of titles) await expect(page.getByRole("heading", { name: title, exact: true }).last()).toBeVisible();
    await page.getByRole("link", { name: "Редактировать →" }).first().click();
    await expect(page).toHaveURL(/\/admin\/pages\/home$/);
    await expect(page.getByTestId("page-layout-editor").last()).toBeVisible();
    await expect(page.getByRole("button", { name: /Добавить HTML-секцию/ })).toBeVisible();
    await page.goto("/admin/settings");
    await expect(page.getByText("Порядок секций главной страницы")).toBeVisible();
    await expect(page.getByRole("link", { name: /Перейти к главной странице/ })).toHaveAttribute("href", "/admin/pages/home");
    await expect(page.getByText("Вверх")).toHaveCount(0);
    audit.assertClean();
  });
});
