import { expect, type Page } from "@playwright/test";

export const ADMIN_EMAIL = process.env.KCIASSO_ADMIN_EMAIL ?? "admin-i6b6@example.com";
export const ADMIN_PASSWORD = process.env.KCIASSO_ADMIN_PASSWORD ?? "AdminI6b6Pass123!";

export async function loginAsAdmin(page: Page) {
  await page.goto("/admin/login");
  await page.locator('input[name="email"]').fill(ADMIN_EMAIL);
  await page.locator('input[name="password"]').fill(ADMIN_PASSWORD);
  await Promise.all([
    page.waitForURL(/\/admin(?:\/|$)/, { timeout: 15_000 }),
    page.locator("form button").click(),
  ]);
  await expect(page).not.toHaveURL(/\/admin\/login/);
  await expect(page).toHaveURL(/\/admin\/(news|documents|settings|users)/);
  await expect(page.locator("main, [data-testid='admin-shell'], body").first()).toBeVisible({ timeout: 15_000 });
}
