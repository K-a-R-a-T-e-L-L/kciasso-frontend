import { expect, test } from "@playwright/test";
import { loginAsAdmin } from "./helpers/admin-auth";

test.describe("admin document floating popovers", () => {
  test("actions menu is portaled outside the card", async ({ page }) => {
    await loginAsAdmin(page);
    await page.goto("/admin/documents");
    const trigger = page.getByRole("button", { name: "Действия документа" }).first();
    await expect(trigger).toBeVisible();
    await trigger.click();
    const menu = page.getByRole("menu").first();
    await expect(menu).toBeVisible();
    expect(await menu.evaluate((node) => Boolean(node.closest("[data-testid^='document-card-']")))).toBe(false);
  });
});
