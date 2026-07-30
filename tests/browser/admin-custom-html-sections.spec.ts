import { expect, test } from "@playwright/test";
import { loginAsAdmin } from "./helpers/admin-auth";

test.describe("custom HTML sandbox", () => {
  test("keeps raw HTML inside a sandboxed preview iframe", async ({ page }) => {
    await loginAsAdmin(page);
    await page.goto("/admin/pages/home");
    const name = `[M8 ${process.env.M8_RUN_ID ?? "local"}] Sandbox fixture`;
    await page.getByRole("button", { name: "Добавить HTML-секцию" }).click();
    await page.getByLabel("Название").fill(name);
    await page.getByLabel("HTML/CSS/JavaScript").fill("<div id=custom-marker>RAW SECTION</div><script>try{parent.document.body.dataset.compromised='yes'}catch{}</script>");
    await page.getByRole("button", { name: "Создать HTML-секцию" }).click();
    const row = page.locator("li").filter({ hasText: name });
    const frame = row.locator("iframe");
    await expect(frame).toBeVisible();
    expect(await frame.getAttribute("sandbox")).toBe("allow-scripts allow-forms allow-modals allow-popups allow-downloads");
    expect(await frame.getAttribute("referrerpolicy")).toBe("no-referrer");
    await expect(frame.contentFrame()!.locator("#custom-marker")).toHaveText("RAW SECTION");
    expect(await page.locator("body").getAttribute("data-compromised")).toBeNull();
    await row.getByRole("button", { name: "Удалить" }).click();
    await expect(row).toHaveCount(0);
  });
});
