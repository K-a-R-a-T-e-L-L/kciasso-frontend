import { test, expect } from "@playwright/test";
import { loginAsAdmin } from "./helpers/admin-auth";
import { readDocumentsFixture } from "./helpers/documents-fixture";

test.describe("admin document actions", () => {
  test("open file, edit/back and drawer action sections", async ({ page }) => {
    await loginAsAdmin(page);
    const fixture = await readDocumentsFixture(page);
    const card = page.getByTestId(`document-card-${fixture[0].id}`);
    await expect(card).toBeVisible();
    const fileResponse = page.waitForResponse(r => r.url().includes(`/api/admin/documents/${fixture[0].id}/versions/${fixture[0].versionId}/file`));
    await Promise.all([fileResponse, card.getByRole("button", { name: "Открыть" }).click()]);
    const response = await fileResponse;
    expect(response.status()).toBe(200);
    expect(response.headers()["content-type"]).toContain("application/pdf");
    expect(response.headers()["content-disposition"]).toContain("filename");
    expect(response.url()).not.toContain("C:\\");

    await card.getByRole("button", { name: "Редактировать" }).click();
    await expect(page.getByRole("dialog")).toBeVisible();
    await page.getByRole("button", { name: "Отмена" }).click();
    await expect(page).toHaveURL(/\/admin\/documents/);
    await card.locator('button[aria-label="Действия документа"]').click();
    await expect(page.getByRole("menuitem", { name: "Заменить файл" })).toBeVisible();
    await expect(page.getByRole("menuitem", { name: "Версии" })).toBeVisible();
    await expect(page.getByRole("menuitem", { name: "Техническая информация" })).toBeVisible();
    await page.getByRole("menuitem", { name: "Версии" }).click();
    await expect(page.getByRole("dialog")).toBeVisible();
    await page.keyboard.press("Escape");
  });
});
