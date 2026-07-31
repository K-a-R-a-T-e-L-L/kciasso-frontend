import { expect, test, type Page } from "@playwright/test";
import path from "node:path";

import { loginAsAdmin } from "./helpers/admin-auth";

const evidence = (name: string) => path.join("test-results", name);

function monitorOwnedFailures(page: Page) {
  const consoleErrors: string[] = [];
  const failedRequests: string[] = [];
  page.on("console", (message) => {
    if (message.type() === "error") consoleErrors.push(message.text());
  });
  page.on("requestfailed", (request) => {
    if (/\/api\/(admin\/(?:pages|documents|news)|user\/current)/.test(request.url())) {
      failedRequests.push(`${request.method()} ${request.url()} ${request.failure()?.errorText ?? ""}`);
    }
  });
  return () => {
    expect(consoleErrors, "owned console errors").toEqual([]);
    expect(failedRequests, "failed target API requests").toEqual([]);
  };
}

async function hasNoHorizontalOverflow(page: Page) {
  await expect.poll(() =>
    page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth + 1),
  ).toBeTruthy();
}

async function contrastOf(locator: ReturnType<Page["locator"]>) {
  return locator.evaluate((element) => {
    const parse = (value: string) => {
      const channels = value.match(/\d+(?:\.\d+)?/g)?.slice(0, 3).map(Number) ?? [0, 0, 0];
      return channels.map((channel) => {
        const normalized = channel / 255;
        return normalized <= 0.04045
          ? normalized / 12.92
          : ((normalized + 0.055) / 1.055) ** 2.4;
      });
    };
    const style = getComputedStyle(element);
    const foreground = parse(style.color);
    const background = parse(style.backgroundColor);
    const luminance = (rgb: number[]) => 0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2];
    const light = Math.max(luminance(foreground), luminance(background));
    const dark = Math.min(luminance(foreground), luminance(background));
    return {
      ratio: (light + 0.05) / (dark + 0.05),
      color: style.color,
      background: style.backgroundColor,
      outlineWidth: style.outlineWidth,
      outlineOffset: style.outlineOffset,
    };
  });
}

test.describe("Stage M9.2 Part 2C final admin UX", () => {
  test("pages, mixed editor, lazy preview, DnD handles and sidebar AA", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    const assertClean = monitorOwnedFailures(page);
    await loginAsAdmin(page);
    await page.goto("/admin/pages");
    await expect(page).toHaveURL(/\/admin\/pages$/);
    await expect(page.getByRole("heading", { name: "Страницы и секции" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Настроить страницу" })).toHaveCount(13);
    for (const title of [
      "Главная",
      "Архив новостей",
      "Страница новости",
      "Государственная итоговая аттестация",
      "ГИА-9",
      "ГИА-11",
      "Качество образования",
      "Раздел качества образования",
      "Региональный проект",
      "Раздел регионального проекта",
      "О центре",
      "Контакты",
      "Ресурсы",
    ]) {
      await expect(page.getByRole("heading", { name: title, exact: true })).toBeVisible();
    }
    await expect(page.getByText(/revision/i)).toHaveCount(0);
    await page.screenshot({ path: evidence("part2c-final-pages-list-desktop.png"), fullPage: true });
    await page.setViewportSize({ width: 768, height: 1024 });
    await hasNoHorizontalOverflow(page);
    await expect(page.getByRole("link", { name: "Настроить страницу" })).toHaveCount(13);
    await page.setViewportSize({ width: 1440, height: 900 });

    const defaultLink = page.getByRole("link", { name: "Новости", exact: true });
    const activeLink = page.getByRole("link", { name: "Страницы", exact: true });
    const defaultState = await contrastOf(defaultLink);
    await defaultLink.hover();
    const hoverState = await contrastOf(defaultLink);
    const activeState = await contrastOf(activeLink);
    await activeLink.hover();
    const activeHoverState = await contrastOf(activeLink);
    for (const state of [defaultState, hoverState, activeState, activeHoverState]) {
      expect(state.ratio).toBeGreaterThanOrEqual(4.5);
    }
    await activeLink.focus();
    const focusState = await contrastOf(activeLink);
    expect(Number.parseFloat(focusState.outlineWidth)).toBeGreaterThanOrEqual(2);
    expect(Number.parseFloat(focusState.outlineOffset)).toBeGreaterThanOrEqual(2);
    await page.screenshot({ path: evidence("part2c-final-sidebar-states.png") });

    await page.goto("/admin/pages?tab=global");
    const globalHeading = page.getByRole("heading", { name: "Глобальные секции" });
    await globalHeading.scrollIntoViewIfNeeded();
    await expect(page.getByText("Глобальная HTML-секция", { exact: true }).first()).toBeVisible();
    await expect(page.getByText(/На страницах: 13/).first()).toBeVisible();
    await page.screenshot({ path: evidence("part2c-final-global-sections-desktop.png") });

    await page.goto("/admin/pages/home");
    const editor = page.getByTestId("page-layout-editor").last();
    await expect(editor).toBeVisible();
    await expect(page.getByRole("heading", { name: "Главная", exact: true })).toBeVisible();
    await expect(editor.locator("iframe")).toHaveCount(0);
    const localCard = editor.locator("li").filter({ hasText: "Part 2C local HTML" });
    await expect(localCard.getByRole("button", { name: "Изменить" })).toBeVisible();
    await expect(localCard.getByRole("button", { name: "Удалить" })).toBeVisible();
    const systemCard = editor.locator("li").filter({ hasText: "Главный баннер" }).first();
    await expect(systemCard.getByRole("button", { name: "Изменить" })).toHaveCount(0);
    await expect(systemCard.getByRole("button", { name: "Удалить" })).toHaveCount(0);
    await expect(editor.getByRole("link", { name: "Настройки контактов" })).toHaveAttribute("href", "/admin/site-settings");
    await localCard.getByRole("button", { name: "Показать предпросмотр" }).click();
    await expect(localCard.locator("iframe")).toBeVisible();
    await expect(localCard.locator("iframe")).toHaveAttribute(
      "sandbox",
      "allow-scripts allow-forms allow-modals allow-popups allow-downloads",
    );
    await page.screenshot({ path: evidence("part2c-final-page-editor-desktop.png"), fullPage: true });

    const handles = editor.getByRole("button", { name: /^Переместить секцию / });
    expect(await handles.count()).toBeGreaterThan(2);
    await handles.first().focus();
    await page.keyboard.press("Space");
    await page.keyboard.press("ArrowDown");
    const reorderResponse = page.waitForResponse(
      (response) => response.url().includes("/sections/reorder") && response.request().method() === "POST",
    );
    await page.keyboard.press("Space");
    await expect((await reorderResponse).status()).toBe(200);
    const firstBox = await handles.first().boundingBox();
    const secondBox = await handles.nth(1).boundingBox();
    if (firstBox && secondBox) {
      await page.mouse.move(firstBox.x + 10, firstBox.y + 10);
      await page.mouse.down();
      await page.mouse.move(secondBox.x + 10, secondBox.y + 10, { steps: 8 });
      await page.mouse.up();
    }
    const touch = { identifier: 1, clientX: 10, clientY: 10, pageX: 10, pageY: 10, screenX: 10, screenY: 10 };
    await handles.first().dispatchEvent("touchstart", { touches: [touch], changedTouches: [touch] });
    await handles.first().dispatchEvent("touchend", { touches: [], changedTouches: [touch] });

    await page.setViewportSize({ width: 390, height: 844 });
    await hasNoHorizontalOverflow(page);
    await page.screenshot({ path: evidence("part2c-final-page-editor-mobile.png"), fullPage: true });
    assertClean();
  });

  test("documents Mantine drawers, publication modal and one-time secret", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    const assertClean = monitorOwnedFailures(page);
    await loginAsAdmin(page);
    await page.goto("/admin/documents");
    const card = page.getByTestId(/document-card-/).filter({ hasText: "Part 2C document" });
    await expect(card).toBeVisible();
    await page.screenshot({ path: evidence("part2c-final-documents-list-desktop.png"), fullPage: true });

    await card.getByRole("button", { name: "Редактировать" }).click();
    const editDrawer = page.getByRole("dialog", { name: "Редактирование документа" });
    await expect(editDrawer).toBeVisible();
    await expect(editDrawer.getByLabel("Название")).toHaveValue("Part 2C document");
    await page.screenshot({ path: evidence("part2c-final-document-edit.png") });
    await page.keyboard.press("Escape");
    await expect(editDrawer).toHaveCount(0);

    await card.getByRole("button", { name: "Публикация раздела" }).click();
    const publication = page.getByRole("dialog", { name: "Публикация размещения" });
    await expect(publication).toBeVisible();
    await expect.poll(() => publication.evaluate((element) => element.contains(document.activeElement))).toBeTruthy();
    await expect(publication.locator('input[type="datetime-local"]')).toHaveCount(1);
    await page.screenshot({ path: evidence("part2c-final-publication-modal.png") });
    await page.keyboard.press("Escape");
    await expect(publication).toHaveCount(0);

    await card.getByRole("button", { name: "Действия документа" }).click();
    await page.getByRole("menuitem", { name: "Секретная ссылка" }).click();
    const shareDrawer = page.getByRole("dialog", { name: "Секретные ссылки" });
    await expect(shareDrawer.getByLabel("Срок действия ссылки")).toBeVisible();
    await expect(shareDrawer.getByText("Время указывается в часовом поясе браузера")).toBeVisible();
    await shareDrawer.getByLabel("Срок действия ссылки").fill("2027-07-30T12:00");
    await shareDrawer.getByRole("button", { name: /Создать новую|Создать секретную ссылку/ }).click();
    await expect(shareDrawer.getByText("Повторно получить этот секретный токен нельзя. Любой человек со ссылкой сможет открыть файл.")).toBeVisible();
    await page.screenshot({ path: evidence("part2c-final-secret-links.png") });
    await page.keyboard.press("Escape");

    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/admin/documents");
    await expect(page.getByText("Part 2C document")).toBeVisible();
    await hasNoHorizontalOverflow(page);
    await page.screenshot({ path: evidence("part2c-final-documents-mobile.png"), fullPage: true });
    await expect(page.locator("body")).not.toContainText(/Рџ|Рњ|Рљ|С‚|СЃ/);
    assertClean();
  });

  test("news URL query, pagination, categories, cover import and responsive states", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    const assertClean = monitorOwnedFailures(page);
    await loginAsAdmin(page);
    await page.goto("/admin/news");
    const filters = page.locator("form");
    for (const label of ["Статус", "Сортировка", "Показывать"]) {
      await expect(filters.getByRole("textbox", { name: label })).toBeVisible();
    }
    await filters.getByRole("textbox", { name: "Статус" }).click();
    for (const option of ["Все статусы", "Черновик", "Запланировано", "Опубликовано"]) {
      await expect(page.getByRole("option", { name: option })).toBeVisible();
    }
    await page.keyboard.press("Escape");
    await filters.getByRole("textbox", { name: "Сортировка" }).click();
    for (const option of ["Сначала новые", "Сначала старые", "По названию"]) {
      await expect(page.getByRole("option", { name: option })).toBeVisible();
    }
    await page.keyboard.press("Escape");
    await filters.getByRole("textbox", { name: "Показывать" }).click();
    for (const option of ["10", "20", "50", "100"]) {
      await expect(page.getByRole("option", { name: option, exact: true })).toBeVisible();
    }
    await page.getByRole("option", { name: "10", exact: true }).click();
    await filters.getByRole("textbox", { name: "Статус" }).click();
    await page.getByRole("option", { name: "Запланировано" }).click();
    await filters.getByRole("textbox", { name: "Сортировка" }).click();
    await page.getByRole("option", { name: "Сначала старые" }).click();
    await Promise.all([
      page.waitForURL(/status=scheduled.*sort=oldest.*limit=10|limit=10.*status=scheduled.*sort=oldest/),
      page.getByRole("button", { name: "Применить" }).click(),
    ]);
    expect(new URL(page.url()).searchParams.get("page")).toBeNull();
    expect(new URL(page.url()).searchParams.get("status")).toBe("scheduled");
    expect(new URL(page.url()).searchParams.get("sort")).toBe("oldest");
    expect(new URL(page.url()).searchParams.get("limit")).toBe("10");
    await expect(page.getByText(/Показано 1–10 из/)).toBeVisible();
    await page.screenshot({ path: evidence("part2c-final-news-list-desktop.png"), fullPage: true });

    await page.goto("/admin/news/categories");
    await expect(page.getByRole("table")).toBeVisible();
    await expect(page.getByRole("button", { name: /Переместить рубрику .+ вверх/ }).first()).toBeDisabled();
    const categoryRows = page.getByRole("row");
    expect(await categoryRows.count()).toBeGreaterThanOrEqual(4);
    await page.screenshot({ path: evidence("part2c-final-news-categories-desktop.png"), fullPage: true });

    await page.route("**/api/admin/news/media/import", async (route) => {
      await new Promise((resolve) => setTimeout(resolve, 150));
      await route.fulfill({
        status: 201,
        contentType: "application/json",
        body: JSON.stringify({ mediaId: 999, url: "/api/public/news/media/part2c-local.webp" }),
      });
    });
    await page.route("**/api/public/news/media/part2c-local.webp", (route) =>
      route.fulfill({
        status: 200,
        contentType: "image/webp",
        body: Buffer.from("UklGRiIAAABXRUJQVlA4IBYAAAAwAQCdASoBAAEALmk0mk0iIiIiIgBoSygABc6zbAAA", "base64"),
      }),
    );
    await page.goto("/admin/news/new");
    await page.getByRole("button", { name: "Указать ссылку" }).click();
    await page.getByLabel("Ссылка на изображение").fill("https://example.test/external.webp");
    const importButton = page.getByRole("button", { name: "Загрузить на сервер" });
    await importButton.click();
    await expect(importButton).toBeDisabled();
    await expect(page.getByText("/api/public/news/media/part2c-local.webp")).toBeVisible();
    await expect(page.getByRole("img", { name: "Предпросмотр изображения новости" })).toBeVisible();

    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/admin/news?limit=10&sort=newest");
    await hasNoHorizontalOverflow(page);
    await page.screenshot({ path: evidence("part2c-final-news-mobile.png"), fullPage: true });
    assertClean();
  });
});
