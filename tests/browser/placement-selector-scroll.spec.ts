import { expect, test, type Page } from "@playwright/test";
import { config as loadEnv } from "dotenv";

loadEnv({ path: process.env.KCIASSO_BACKEND_ENV ?? "../kciasso-backend/.env", quiet: true });

async function openPlacementSelector(page: Page) {
  await page.goto("/admin/login");

  const loginButton = page.getByRole("button", { name: "Войти" });
  if (await loginButton.count()) {
    await page.locator('input[name="email"]').fill(process.env.SUPER_ADMIN_EMAIL ?? "");
    await page.locator('input[name="password"]').fill(process.env.SUPER_ADMIN_PASSWORD ?? "");
    await loginButton.click();
    await page.waitForURL(/\/admin\/(news|documents|settings|users)/);
  }

  await page.goto("/admin/documents");
  await page.getByRole("button", { name: "Добавить документ" }).click();
  await page.getByRole("button", { name: /Изменить размещение/ }).click();

  const dialog = page.getByRole("dialog", { name: "Выбор размещений" });
  await dialog.getByRole("button", { name: /Качество образования/ }).click();
  await expect(dialog.locator("label[class*='_placementRow']")).toHaveCount(31);
  return dialog;
}

test("общий список размещений прокручивается, а footer остаётся видимым", async ({ page }) => {
  const dialog = await openPlacementSelector(page);
  const scrollArea = dialog.locator("[class*='_placementGroups']");
  const lastItem = dialog.locator("label[class*='_placementRow']").last();
  const footer = dialog.getByRole("button", { name: "Применить" }).locator("..");

  const initial = await scrollArea.evaluate((element) => ({
    clientHeight: element.clientHeight,
    scrollHeight: element.scrollHeight,
  }));
  expect(initial.scrollHeight).toBeGreaterThan(initial.clientHeight);
  await expect(footer).toBeInViewport();
  expect(await page.evaluate(() => getComputedStyle(document.body).overflow)).toBe("hidden");
  expect(await dialog.evaluate((overlay) => {
    const panel = overlay.firstElementChild as HTMLElement;
    const area = overlay.querySelector("[class*='_placementGroups']") as HTMLElement;
    return document.documentElement.scrollWidth <= document.documentElement.clientWidth &&
      panel.scrollWidth <= panel.clientWidth && area.scrollWidth <= area.clientWidth;
  })).toBe(true);

  await scrollArea.evaluate((element) => { element.scrollTop = element.scrollHeight; });
  await expect.poll(() => scrollArea.evaluate((element) => element.scrollTop)).toBeGreaterThan(0);
  await expect(lastItem).toBeInViewport();
  await expect(footer).toBeInViewport();

  await scrollArea.evaluate((element) => { element.scrollTop = 0; });
  await scrollArea.hover();
  await page.mouse.wheel(0, 5000);
  await expect.poll(() => scrollArea.evaluate((element) => element.scrollTop)).toBeGreaterThan(0);
  await expect(lastItem).toBeInViewport();
  await expect(footer).toBeInViewport();

  await dialog.getByRole("button", { name: "Закрыть" }).click();
  await expect.poll(() => page.evaluate(() => getComputedStyle(document.body).overflow)).not.toBe("hidden");
});
