import { expect, test } from "@playwright/test";
import { loginAsAdmin } from "./helpers/admin-auth";
import { createNewsAcceptanceFixture, createNewsUploadFixtures } from "./helpers/news-upload-fixture";
import { startNetworkAudit } from "./helpers/network-audit";

async function fillRequired(page: import("@playwright/test").Page, slug = `i7a4c-${Date.now()}`) {
  await page.locator('input[name="title"]').fill("I7A4C upload acceptance");
  await page.locator('input[name="slug"]').fill(slug);
  await page.locator('textarea[name="excerpt"]').fill("I7A4C excerpt");
  await page.locator('textarea[name="content"]').fill("I7A4C content");
  await page.locator('select[name="publishMode"]').selectOption("draft");
}

test.describe("admin news upload transport", () => {
  test("medium upload POST creates news and serves owned media", async ({ page }) => {
    const audit = startNetworkAudit(page);
    const files = await createNewsUploadFixtures();
    await loginAsAdmin(page);
    const fixture = await createNewsAcceptanceFixture(page);
    await page.goto("/admin/news/new");
    await fillRequired(page);
    const uploadRequests: Array<{ size: number; url: string }> = [];
    const actionBodies: Buffer[] = [];
    const createRequests: Array<{ body: any }> = [];
    page.on("request", request => {
      if (request.method() !== "POST") return;
      if (request.url().includes("/api/admin/news/media")) uploadRequests.push({ size: request.postDataBuffer()?.length ?? 0, url: request.url() });
      else if (request.url().endsWith("/api/admin/news") && request.postData()) createRequests.push({ body: request.postDataJSON() });
      else if (request.postDataBuffer()) actionBodies.push(request.postDataBuffer()!);
    });
    await page.locator('input[type="file"]').setInputFiles(files.medium);
    await expect(page.getByRole("img", { name: /Предпросмотр изображения новости/ })).toBeVisible();
    await expect(page.getByText(/valid-medium\.jpg/)).toBeVisible();
    await Promise.all([page.waitForURL(/\/admin\/news$/, { timeout: 20_000 }), page.locator('button[type="submit"]').click()]);
    expect(uploadRequests).toHaveLength(1);
    expect(uploadRequests[0].url).toContain("/api/admin/news/media");
    expect(actionBodies.every(body => body.length < 1024 * 1024 && !body.includes(Buffer.from("valid-medium.jpg")))).toBe(true);
    expect(createRequests).toHaveLength(1);
    const item = { coverImageUrl: createRequests[0].body.cover.url };
    expect(item.coverImageUrl).toMatch(/^\/api\/public\/news\/media\/[a-f0-9]{64}\.jpg$/);
    const media = await page.request.get(item.coverImageUrl);
    expect(media.status()).toBe(200);
    expect(media.headers()["content-type"]).toContain("image/jpeg");
    audit.assertClean();
  });

  test("near-limit upload is accepted without Server Action binary", async ({ page }) => {
    test.skip(test.info().project.name !== "desktop-1366x768", "heavy fixture is desktop-only");
    const audit = startNetworkAudit(page);
    const files = await createNewsUploadFixtures();
    await loginAsAdmin(page);
    const fixture = await createNewsAcceptanceFixture(page);
    await page.goto("/admin/news/new");
    await fillRequired(page);
    await page.locator('input[name="slug"]').fill(`i7a4c-near-${Date.now()}`);
    const uploadRequests: number[] = [];
    const actionBodies: Buffer[] = [];
    page.on("request", request => { if (request.method() !== "POST") return; if (request.url().includes("/api/admin/news/media")) uploadRequests.push(request.postDataBuffer()?.length ?? 0); else if (request.postDataBuffer()) actionBodies.push(request.postDataBuffer()!); });
    await page.locator('input[type="file"]').setInputFiles(files.nearLimit);
    await Promise.all([page.waitForURL(/\/admin\/news$/, { timeout: 30_000 }), page.locator('button[type="submit"]').click()]);
    expect(uploadRequests).toHaveLength(1);
    expect(uploadRequests[0]).toBeGreaterThan(files.sizes["valid-near-limit.jpg"]);
    expect(actionBodies.every(body => body.length < 1024 * 1024)).toBe(true);
    audit.assertClean();
  });

  test("too-large and SVG files are rejected before network upload", async ({ page }) => {
    const audit = startNetworkAudit(page);
    const files = await createNewsUploadFixtures();
    await loginAsAdmin(page);
    await page.goto("/admin/news/new");
    await fillRequired(page);
    const requests: string[] = [];
    page.on("request", request => { if (request.method() === "POST") requests.push(request.url()); });
    const input = page.locator('input[type="file"]');
    await input.setInputFiles(files.tooLarge);
    await expect(page.locator('p[role="alert"]')).toContainText("10 МБ");
    await input.setInputFiles(files.svg);
    await expect(page.locator('p[role="alert"]')).toContainText("JPG");
    expect(requests.filter(url => url.includes("/api/admin/news/media"))).toHaveLength(0);
    await expect(page.locator('input[name="title"]')).toHaveValue("I7A4C upload acceptance");
    audit.assertClean();
  });

  test("fake PNG reaches proxy and is rejected by signature", async ({ page }) => {
    const audit = startNetworkAudit(page);
    const files = await createNewsUploadFixtures();
    await loginAsAdmin(page);
    await page.goto("/admin/news/new");
    await fillRequired(page);
    await page.locator('input[type="file"]').setInputFiles(files.fake);
    const responsePromise = page.waitForResponse(response => response.url().includes("/api/admin/news/media") && response.request().method() === "POST");
    await page.locator('button[type="submit"]').click();
    const response = await responsePromise;
    expect(response.status()).toBeGreaterThanOrEqual(400);
    await expect(page.locator('p[role="alert"]')).toContainText("изображение");
    await expect(page.locator('p[role="alert"]')).not.toContainText("Error");
    audit.assertClean();
  });

  test("controlled 503 keeps form and retry succeeds", async ({ page }) => {
    const audit = startNetworkAudit(page);
    const files = await createNewsUploadFixtures();
    await loginAsAdmin(page);
    const fixture = await createNewsAcceptanceFixture(page);
    await page.goto("/admin/news/new");
    await fillRequired(page);
    await page.locator('input[type="file"]').setInputFiles(files.medium);
    let first = true;
    await page.route("**/api/admin/news/media", async route => { if (first) { first = false; await route.fulfill({ status: 503, contentType: "application/json", body: JSON.stringify({ message: "controlled" }) }); } else await route.continue(); });
    await page.locator('button[type="submit"]').click();
    await expect(page.getByRole("alert")).toContainText("controlled");
    await expect(page.locator('input[name="title"]')).toHaveValue("I7A4C upload acceptance");
    await page.unroute("**/api/admin/news/media");
    await Promise.all([page.waitForURL(/\/admin\/news$/, { timeout: 20_000 }), page.locator('button[type="submit"]').click()]);
    audit.assertClean();
  });

  test("duplicate slug compensates orphan media and retry succeeds", async ({ page }) => {
    const audit = startNetworkAudit(page);
    const files = await createNewsUploadFixtures();
    await loginAsAdmin(page);
    const fixture = await createNewsAcceptanceFixture(page);
    await page.goto("/admin/news/new");
    await fillRequired(page, fixture.duplicateSlug);
    let uploadedUrl = "";
    page.on("response", async response => { if (response.url().includes("/api/admin/news/media") && response.status() < 300) uploadedUrl = (await response.json()).url; });
    await page.locator('input[type="file"]').setInputFiles(files.medium);
    await page.locator('button[type="submit"]').click();
    await expect(page.getByRole("alert")).toContainText(/slug|существ/);
    expect(uploadedUrl).toMatch(/^\/api\/public\/news\/media\//);
    expect((await page.request.get(uploadedUrl)).status()).toBe(404);
    await page.locator('input[name="slug"]').fill(`i7a4c-retry-${Date.now()}`);
    await Promise.all([page.waitForURL(/\/admin\/news$/, { timeout: 20_000 }), page.locator('button[type="submit"]').click()]);
    audit.assertClean();
  });
});
