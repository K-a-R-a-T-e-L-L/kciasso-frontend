import { expect, test } from "@playwright/test";

import { loginAsAdmin } from "./helpers/admin-auth";

test.describe("admin users runtime", () => {
  test("renders the users registry without a React error overlay", async ({ page }, testInfo) => {
    const pageErrors: Error[] = [];
    page.on("pageerror", (error) => pageErrors.push(error));

    await loginAsAdmin(page);
    const response = await page.goto("/admin/users", { waitUntil: "domcontentloaded" });

    expect(response?.status()).toBe(200);
    await expect(page.getByRole("heading", { name: /Подадмины и права|Пользователи/ })).toBeVisible();
    if (testInfo.project.name === "mobile-390x844") {
      await expect(page.getByTestId("users-mobile-cards")).toBeVisible();
    } else {
      await expect(page.getByRole("table")).toBeVisible();
    }
    await expect(page.getByText(/Element type is invalid/i)).toHaveCount(0);
    expect(pageErrors).toEqual([]);
  });
});
