import { test, expect } from "@playwright/test";

const email = process.env.KCIASSO_ADMIN_EMAIL ?? "admin-i6b4@example.com";
const password = process.env.KCIASSO_ADMIN_PASSWORD ?? "AdminI6b4Pass123!";

async function login(page: import("@playwright/test").Page) {
  await page.goto("/admin/login");
  await page.locator('input[name="email"]').fill(email);
  await page.locator('input[name="password"]').fill(password);
  await page.locator("form button").click();
  await page.waitForURL(/\/admin\/(news|documents)/, { timeout: 15_000 });
}

test.describe("admin documents compact UX", () => {
  test("cards, menu, drawer and scroll contract", async ({ page }) => {
    const consoleErrors: string[] = [];
    page.on("console", msg => { if (msg.type() === "error") consoleErrors.push(msg.text()); });
    await login(page);
    await page.goto("/admin/documents");
    const cards = page.getByTestId(/document-card-/);
    await expect(cards.first()).toBeVisible({ timeout: 15_000 });
    const metrics = await cards.evaluateAll((nodes) => nodes.map((node) => {
      const el = node as HTMLElement;
      return { height: el.getBoundingClientRect().height, clientHeight: el.clientHeight, scrollHeight: el.scrollHeight, width: el.getBoundingClientRect().width };
    }));
    const max = page.viewportSize()?.width === 390 ? 220 : 170;
    expect(Math.max(...metrics.map(x => x.height))).toBeLessThanOrEqual(max);
    expect(metrics.every(x => x.scrollHeight === x.clientHeight)).toBeTruthy();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBeTruthy();

    const trigger = page.locator('button[aria-label="Действия документа"]').first();
    await trigger.focus();
    await page.keyboard.press("Enter");
    await expect(page.getByRole("menu")).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(page.getByRole("menu")).toHaveCount(0);
    await expect(trigger).toBeFocused();
    await trigger.click();
    await page.getByRole("menuitem", { name: "Техническая информация" }).click();
    const drawer = page.getByRole("dialog", { name: /.+/ });
    await expect(drawer).toBeVisible();
    await expect(page.locator("body")).toHaveCSS("overflow", "hidden");
    expect(await drawer.evaluate(el => el.contains(document.activeElement))).toBeTruthy();
    await page.keyboard.press("Tab");
    await page.keyboard.press("Shift+Tab");
    await page.keyboard.press("Escape");
    await expect(drawer).toHaveCount(0);
    await expect(trigger).toBeFocused();
    expect(consoleErrors.filter(x => /warning|key|controlled|uncontrolled/i.test(x))).toEqual([]);
  });
});
