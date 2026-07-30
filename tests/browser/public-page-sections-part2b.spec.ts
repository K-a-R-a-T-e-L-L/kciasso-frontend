import { expect, test } from "@playwright/test";

const backend =
  process.env.KCIASSO_BACKEND_URL ?? "http://127.0.0.1:4511";
const evidenceRoot =
  process.env.KCIASSO_EVIDENCE_DIR ??
  "C:\\Users\\kiril\\AppData\\Local\\Temp";

const homeSystemKeys = [
  "home.hero",
  "home.carousel",
  "home.main-sections",
  "home.important-resources",
  "home.gia",
  "home.official-resources",
  "global.contacts",
] as const;

test("home renders the API placement order at all required viewports", async ({
  page,
  request,
}) => {
  test.setTimeout(120_000);
  const runtimeErrors: string[] = [];
  const failedLayoutRequests: string[] = [];
  page.on("pageerror", (error) => runtimeErrors.push(error.message));
  page.on("console", (message) => {
    if (message.type() === "error") runtimeErrors.push(message.text());
  });
  page.on("requestfailed", (request) => {
    if (request.url().includes("/api/public/pages/")) {
      failedLayoutRequests.push(request.url());
    }
  });

  const apiResponse = await request.get(
    `${backend}/api/public/pages/home/layout`,
  );
  expect(apiResponse.status()).toBe(200);
  const apiLayout = (await apiResponse.json()) as {
    sections: Array<{
      key: string | null;
      systemRendererKey: string | null;
      type: string;
    }>;
  };
  const expectedOrder = apiLayout.sections.map(
    (section) =>
      section.systemRendererKey ?? section.key ?? section.type,
  );

  for (const viewport of [
    { name: "desktop", width: 1440, height: 900 },
    { name: "tablet", width: 768, height: 1024 },
    { name: "mobile", width: 390, height: 844 },
  ]) {
    await page.setViewportSize(viewport);
    const response = await page.goto("/", { waitUntil: "domcontentloaded" });
    expect(response?.status()).toBe(200);

    const wrappers = page.locator("[data-page-section]");
    await expect(wrappers).toHaveCount(apiLayout.sections.length);
    const renderedOrder = await wrappers.evaluateAll((items) =>
      items.map(
        (item) =>
          (item as HTMLElement).dataset.systemRendererKey ||
          (item as HTMLElement).dataset.sectionKey ||
          (item as HTMLElement).dataset.sectionType,
      ),
    );
    expect(renderedOrder).toEqual(expectedOrder);

    for (const key of homeSystemKeys) {
      await expect(
        page.locator(`[data-system-renderer-key="${key}"]`),
      ).toHaveCount(1);
    }
    await expect(
      page.locator('[data-system-renderer-key="home.carousel"] [aria-label="Карусель разделов"]'),
    ).toHaveCount(1);
    await expect(page.locator("[data-unknown-system-renderer]")).toHaveCount(0);
    await expect(
      page.locator(
        '[data-system-renderer-key="home.slider"], [data-system-renderer-key="home.quick-access"], [data-system-renderer-key="home.resources"], [data-system-renderer-key="home.gia-reference"]',
      ),
    ).toHaveCount(0);
    expect(
      await wrappers.evaluateAll((items) =>
        items.every((item) => item.childElementCount > 0),
      ),
    ).toBe(true);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth + 1,
      ),
    ).toBe(true);

    await page.screenshot({
      path: `${evidenceRoot}\\part2b-home-${viewport.name}.png`,
      fullPage: true,
    });
  }

  expect(failedLayoutRequests).toEqual([]);
  expect(runtimeErrors).toEqual([]);
});

test("representative public routes use the ordered runtime without contact duplication", async ({
  page,
}) => {
  test.setTimeout(120_000);
  for (const route of [
    "/news",
    "/gia",
    "/kachestvo-obrazovaniya",
    "/regionalnyy-proekt",
    "/o-centre",
    "/resources",
    "/o-centre/kontakty",
  ]) {
    const response = await page.goto(route, {
      waitUntil: "domcontentloaded",
    });
    expect(response?.status(), route).toBe(200);
    await expect(page.locator("[data-page-section]").first(), route).toBeVisible();
    await expect(
      page.locator('[data-system-renderer-key="global.contacts"]'),
      route,
    ).toHaveCount(1);
    await expect(
      page.locator("[data-unknown-system-renderer]"),
      route,
    ).toHaveCount(0);
  }
});
