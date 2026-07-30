import { expect, test } from "@playwright/test";
import { loginAsAdmin } from "./helpers/admin-auth";

test("URL import becomes deduplicated server-owned media after the source stops", async ({ page }) => {
  await loginAsAdmin(page);
  const sourceUrl = "http://m9-image.test:4503/cover.png";
  let ownedKey: string | undefined;

  try {
    const first = await page.request.post("/api/admin/news/media/import", { data: { url: sourceUrl } });
    expect(first.status()).toBe(201);
    const firstMedia = (await first.json()) as { mediaId: number; url: string };
    expect(firstMedia.url).toMatch(/^\/api\/public\/news\/media\/[a-f0-9]{64}\.png$/);
    ownedKey = firstMedia.url.split("/").at(-1);

    const second = await page.request.post("/api/admin/news/media/import", { data: { url: sourceUrl } });
    expect(second.status()).toBe(201);
    const secondMedia = (await second.json()) as { mediaId: number; url: string };
    expect(secondMedia).toEqual(firstMedia);

    await expect
      .poll(
        async () =>
          page.request
            .get(sourceUrl, { timeout: 500 })
            .then(() => "reachable")
            .catch(() => "stopped"),
        { timeout: 5_000 },
      )
      .toBe("stopped");

    const owned = await page.request.get(firstMedia.url);
    expect(owned.status()).toBe(200);
    expect(owned.headers()["content-type"]).toContain("image/png");
  } finally {
    if (ownedKey) {
      const cleanup = await page.request.delete(`/api/admin/news/media/${ownedKey}`);
      expect(cleanup.status()).toBe(204);
    }
  }
});
