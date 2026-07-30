import { expect, test } from "@playwright/test";

import { loginAsAdmin } from "./helpers/admin-auth";

function contrastRatio(foreground: string, background: string) {
  const parse = (value: string) => value.match(/[\d.]+/g)?.slice(0, 3).map(Number) ?? [0, 0, 0];
  const luminance = (value: string) => {
    const [red, green, blue] = parse(value).map((channel) => {
      const normalized = channel / 255;
      return normalized <= 0.03928 ? normalized / 12.92 : ((normalized + 0.055) / 1.055) ** 2.4;
    });
    return 0.2126 * red + 0.7152 * green + 0.0722 * blue;
  };
  const first = luminance(foreground);
  const second = luminance(background);
  return (Math.max(first, second) + 0.05) / (Math.min(first, second) + 0.05);
}

test("admin AppShell keeps navigation readable and responsive", async ({ page }, testInfo) => {
  await loginAsAdmin(page);
  await page.goto("/admin/pages");

  const mobile = testInfo.project.name === "mobile-390x844";
  const burger = page.getByRole("button", { name: "Открыть меню администратора" });
  const navbar = page.getByRole("navigation", { name: "Навигация администратора" });
  const navbarPanel = page.getByTestId("admin-navbar");

  if (mobile) {
    await expect(burger).toBeVisible();
    expect((await navbarPanel.boundingBox())?.x).toBeLessThan(0);
    await burger.click();
    await expect(navbar).toBeVisible();
    expect((await navbarPanel.boundingBox())?.x).toBeGreaterThanOrEqual(0);
  } else {
    await expect(burger).not.toBeVisible();
    await expect(navbar).toBeVisible();
    const shell = page.getByTestId("admin-shell");
    const navbarBox = await navbarPanel.boundingBox();
    const main = shell.locator("main");
    expect(navbarBox?.width).toBeGreaterThanOrEqual(260);
    expect(navbarBox?.width).toBeLessThanOrEqual(290);
    expect(Number.parseFloat(await main.evaluate((element) => getComputedStyle(element).paddingLeft))).toBeGreaterThanOrEqual(navbarBox?.width ?? 0);
  }

  const pagesLink = navbar.getByRole("link", { name: "Страницы" });
  const colors = await pagesLink.evaluate((element) => {
    const style = getComputedStyle(element);
    return { color: style.color, background: style.backgroundColor };
  });
  expect(contrastRatio(colors.color, colors.background)).toBeGreaterThanOrEqual(4.5);

  if (mobile) {
    await page.keyboard.press("Escape");
    await expect.poll(async () => (await navbarPanel.boundingBox())?.x ?? 0).toBeLessThan(0);
  }
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1)).toBe(true);
});
