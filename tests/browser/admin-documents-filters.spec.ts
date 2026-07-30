import { test, expect } from "@playwright/test";
import { loginAsAdmin } from "./helpers/admin-auth";
import { readDocumentsFixture } from "./helpers/documents-fixture";

test.describe("admin document filters and pagination", () => {
  test("search, status, sort, reset and page size preserve URL state", async ({ page }) => {
    await loginAsAdmin(page);
    const fixture = await readDocumentsFixture(page);
    await expect(page.getByTestId(`document-card-${fixture[0].id}`)).toBeVisible();
    const search = page.getByLabel("Поиск");
    await search.fill(fixture[0].title);
    await search.press("Enter");
    await expect(page).toHaveURL(/search=/);
    await expect(page.getByTestId(`document-card-${fixture[0].id}`)).toBeVisible();
    await page.getByRole("button", { name: "Очистить" }).click();
    await expect(page).not.toHaveURL(/search=/);
    const status = page.getByLabel("Статус").first();
    await status.click();
    await page.getByRole("option", { name: "Опубликован", exact: true }).click();
    await expect(page).toHaveURL(/status=PUBLISHED/);
    await page.getByRole("textbox", { name: "Сортировка" }).click();
    await Promise.all([
      page.waitForURL(/sortBy=title/),
      page.getByRole("option", { name: "По названию", exact: true }).click(),
    ]);
    await expect(page).toHaveURL(/sortBy=title/);
    await page.getByRole("textbox", { name: "На странице" }).click();
    await page.getByRole("option", { name: "50", exact: true }).click();
    await expect(page).toHaveURL(/pageSize=50/);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBeTruthy();
  });
});
