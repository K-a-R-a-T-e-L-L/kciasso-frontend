import { expect, test } from "@playwright/test";
import { loginAsAdmin } from "./helpers/admin-auth";
import { createPlacementFixture, PLACEMENT_FIXTURE_KEYS } from "./helpers/placement-fixture";

test.describe("permanent 67-placement floating popup acceptance", () => {
  test("desktop/mobile portal, scroll, flip, shift, focus return and unmount", async ({ page, request }) => {
    const fixture = await createPlacementFixture(request);
    expect(fixture.placementKeys.length).toBeGreaterThanOrEqual(67);
    const pageErrors: Error[] = [];
    page.on("pageerror", (error) => pageErrors.push(error));
    await loginAsAdmin(page);
    await page.goto("/admin/documents");
    const card = page.getByTestId(`document-card-${fixture.documentId}`);
    await expect(card).toBeVisible();
    const trigger = card.getByRole("button", { name: /\+.*65/ });
    await expect(trigger).toBeVisible();
    await trigger.focus();
    await trigger.dispatchEvent("click");

    const popup = page.getByRole("dialog").filter({ hasText: "Все размещения" });
    await expect(popup).toBeVisible();
    const rows = popup.locator("[class*='_placementRows']");
    await expect(rows.locator("span")).toHaveCount(PLACEMENT_FIXTURE_KEYS.length);
    expect(await popup.evaluate((node) => node.parentElement === document.body)).toBe(true);
    expect(await popup.evaluate((node) => Boolean(node.closest("[data-testid^='document-card-']")))).toBe(false);
    expect(await popup.evaluate((node) => getComputedStyle(node).position)).toBe("fixed");
    const initialGeometry = await popup.evaluate((node) => { const r = node.getBoundingClientRect(); return { left: r.left, top: r.top, right: r.right, bottom: r.bottom, width: r.width, height: r.height, innerWidth, innerHeight }; });
    console.log("initial popup geometry", initialGeometry);
    expect(initialGeometry.left).toBeGreaterThanOrEqual(0);
    expect(initialGeometry.top).toBeGreaterThanOrEqual(0);
    expect(initialGeometry.right).toBeLessThanOrEqual(initialGeometry.innerWidth);
    expect(initialGeometry.bottom).toBeLessThanOrEqual(initialGeometry.innerHeight);
    expect(await rows.evaluate((node) => ({ top: node.scrollTop, scrollHeight: node.scrollHeight, clientHeight: node.clientHeight }))).toEqual(expect.objectContaining({ top: 0 }));
    expect(await rows.evaluate((node) => node.scrollHeight > node.clientHeight)).toBe(true);
    await rows.hover();
    await page.mouse.wheel(0, 1200);
    await expect.poll(() => rows.evaluate((node) => node.scrollTop)).toBeGreaterThan(0);
    await rows.press("End");
    await expect.poll(() => rows.evaluate((node) => node.scrollTop)).toBeGreaterThan(0);
    await expect(rows.locator("span").last()).toBeVisible();
    expect(await rows.locator("span").allTextContents()).toEqual(expect.arrayContaining([fixture.firstPlacementLabel, fixture.middlePlacementLabel, "Обучение"]));
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true);

    await page.keyboard.press("Escape");
    await expect(popup).toHaveCount(0);
    await expect(trigger).toBeFocused();

    await trigger.dispatchEvent("click");
    await expect(popup).toBeVisible();
    await popup.getByRole("button", { name: "Закрыть" }).click();
    await expect(popup).toHaveCount(0);
    await expect(trigger).toBeFocused();

    await trigger.evaluate((node) => { Object.assign((node as HTMLElement).style, { position: "fixed", right: "2px", bottom: "2px" }); });
    await trigger.dispatchEvent("click");
    await expect(popup).toBeVisible();
    const popupBox = await popup.boundingBox();
    const anchorBox = await trigger.boundingBox();
    const geometry = { popup: { top: popupBox!.y, right: popupBox!.x + popupBox!.width, bottom: popupBox!.y + popupBox!.height, left: popupBox!.x }, anchor: { top: anchorBox!.y } };
    expect(geometry.popup.bottom).toBeLessThanOrEqual(page.viewportSize()!.height - 12);
    expect(geometry.popup.top).toBeLessThan(geometry.anchor.top);
    expect(geometry.popup.right).toBeLessThanOrEqual(page.viewportSize()!.width - 12);
    expect(geometry.popup.left).toBeGreaterThanOrEqual(12);
    await page.keyboard.press("Escape");
    await expect(popup).toHaveCount(0);

    await trigger.dispatchEvent("click");
    await expect(popup).toBeVisible();
    await card.evaluate((node) => node.remove());
    await page.keyboard.press("Escape");
    await expect(popup).toHaveCount(0);
    expect(pageErrors).toHaveLength(0);
  });

  test("actions menu returns focus to its trigger", async ({ page }) => {
    await loginAsAdmin(page);
    await page.goto("/admin/documents");
    const trigger = page.getByRole("button", { name: "Действия документа" }).first();
    await trigger.focus();
    await trigger.click();
    await expect(page.getByRole("menu")).toBeVisible();
    await page.getByRole("menuitem").first().focus();
    await page.keyboard.press("Escape");
    await expect(page.getByRole("menu")).toHaveCount(0);
    await expect.poll(() => page.evaluate(() => document.activeElement?.getAttribute("aria-label"))).toBe("Действия документа");
  });
});
