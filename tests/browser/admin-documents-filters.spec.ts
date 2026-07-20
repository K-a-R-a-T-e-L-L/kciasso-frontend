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
    await status.selectOption("PUBLISHED");
    await expect(page).toHaveURL(/status=PUBLISHED/);
    await page.getByLabel("Сортировка").selectOption("title:asc");
    await expect(page).toHaveURL(/sortBy=title/);
    await page.getByLabel("На странице").selectOption("50");
    await expect(page).toHaveURL(/pageSize=50/);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBeTruthy();
  });
});
