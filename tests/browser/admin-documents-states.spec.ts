import { test, expect } from "@playwright/test";
import { loginAsAdmin } from "./helpers/admin-auth";
import { readDocumentsFixture } from "./helpers/documents-fixture";

test.describe("admin document states", () => {
  test("filtered empty state is recoverable and controlled API failures contain no stack", async ({ page }) => {
    await loginAsAdmin(page);
    const fixture = await readDocumentsFixture(page);
    await page.goto("/admin/documents");
    const search = page.getByLabel("Поиск");
    await search.fill("__i6b6_no_match__");
    await search.press("Enter");
    await expect(page).toHaveURL(/search=/);
    await expect(page.getByTestId("documents-empty-state")).toBeVisible();
    const body = await page.locator("body").innerText();
    expect(body).not.toContain("Error:");
    await page.getByRole("button", { name: "Очистить" }).click();
    await expect(page.getByTestId(`document-card-${fixture[0].id}`)).toBeVisible();

    await page.route("**/api/admin/documents**", route => route.fulfill({ status: 503, contentType: "application/json", body: JSON.stringify({ description: "Сервис документов временно недоступен" }) }));
    const response = await page.evaluate(async () => { const r = await fetch("/api/admin/documents?page=1&pageSize=20"); return { status: r.status, text: await r.text() }; });
    expect(response.status).toBe(503);
    expect(response.text).not.toContain("Error:");
  });
});
