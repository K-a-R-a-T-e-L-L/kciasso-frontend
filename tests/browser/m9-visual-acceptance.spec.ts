import fs from "node:fs/promises";
import path from "node:path";
import { expect, test } from "@playwright/test";
import { loginAsAdmin } from "./helpers/admin-auth";

const adminRoutes = [
  { path: "/admin/users", name: "users" },
  { path: "/admin/news", name: "news" },
  { path: "/admin/documents", name: "documents" },
  { path: "/admin/pages", name: "pages" },
  { path: "/admin/pages/home", name: "pages-home" },
];

test("M9 Mantine visual and runtime acceptance", async ({ page }, testInfo) => {
  test.setTimeout(120_000);

  const pageErrors: string[] = [];
  const serverFailures: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));
  page.on("response", (response) => {
    if (response.status() >= 500) serverFailures.push(`${response.status()} ${response.url()}`);
  });

  await loginAsAdmin(page);
  const output = path.join("test-results", "m9-screenshots", testInfo.project.name);
  await fs.mkdir(output, { recursive: true });

  for (const route of adminRoutes) {
    const response = await page.goto(route.path, { waitUntil: "domcontentloaded" });
    expect(response?.status(), route.path).toBe(200);
    await expect(page.locator("body")).not.toContainText("Element type is invalid");
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1),
      route.path,
    ).toBe(true);
    const button = page.locator(".mantine-Button-root").first();
    if (await button.count()) {
      const style = await button.evaluate((element) => {
        const computed = getComputedStyle(element);
        return {
          height: element.getBoundingClientRect().height,
          radius: computed.borderRadius,
          font: computed.fontFamily,
        };
      });
      expect(style.height).toBeGreaterThanOrEqual(28);
      expect(style.radius).not.toBe("0px");
      expect(style.font).toBeTruthy();
    }
    await page.screenshot({ path: path.join(output, `${route.name}.png`), fullPage: true });
  }

  await page.goto("/admin/users");
  if (testInfo.project.name.includes("mobile")) {
    await expect(page.getByTestId("users-mobile-cards")).toBeVisible();
    await expect(page.getByRole("button", { name: "Открыть меню администратора" })).toBeVisible();
  } else {
    await expect(page.getByTestId("users-desktop-table")).toBeVisible();
  }

  await page.goto("/admin/documents");
  const documentCard = page.locator('[data-testid^="document-card-"]').first();
  if ((await documentCard.count()) && !testInfo.project.name.includes("mobile")) {
    expect(await documentCard.evaluate((element) => element.getBoundingClientRect().height)).toBeLessThanOrEqual(170);
  }

  const publicResponse = await page.goto("/", { waitUntil: "domcontentloaded" });
  expect(publicResponse?.status()).toBe(200);
  await expect(page.getByRole("region", { name: "Основные разделы сайта" })).toBeVisible();
  await expect(
    page.getByRole("button", { name: /next/i }).or(page.locator(".mantine-Carousel-control")).first(),
  ).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1)).toBe(true);
  await page.screenshot({ path: path.join(output, "home.png"), fullPage: true });

  expect(pageErrors).toEqual([]);
  expect(serverFailures).toEqual([]);
});
