import { expect, test } from "@playwright/test";
import { adminApiToken } from "./helpers/admin-api-token";
import { loginAsAdmin } from "./helpers/admin-auth";

const pageKeys = [
  "home",
  "news.archive",
  "news.article",
  "gia",
  "gia.9",
  "gia.11",
  "quality",
  "quality.section",
  "regional-project",
  "regional-project.section",
  "about",
  "about.contacts",
  "resources",
];

test("one revisioned global HTML section is inherited by all registry pages", async ({ page }) => {
  await loginAsAdmin(page);
  const backend = process.env.KCIASSO_BACKEND_URL ?? "http://127.0.0.1:4502";
  const token = await adminApiToken(page);
  const headers = { authorization: `Bearer ${token}` };
  const runId = process.env.M8_RUN_ID ?? String(Date.now());
  let sectionId: number | undefined;

  try {
    const createdResponse = await page.request.post(`${backend}/api/admin/pages/global-sections`, {
      headers,
      data: {
        key: `m9-${runId}`,
        name: `[M9 ${runId}] Global acceptance`,
        html: `<main data-m9="${runId}">M9 global initial</main>`,
        css: "main { color: rgb(0, 64, 128); }",
        javascript: "document.documentElement.dataset.ready = 'true';",
        iframeHeightPx: 180,
        isEnabled: true,
        slot: "BEFORE_CONTENT",
      },
    });
    expect(createdResponse.status()).toBe(201);
    const created = (await createdResponse.json()) as { id: number; revision: number };
    sectionId = created.id;

    for (const pageKey of pageKeys) {
      const response = await page.request.get(`${backend}/api/public/pages/${pageKey}/layout`);
      expect(response.status(), pageKey).toBe(200);
      const layout = (await response.json()) as { sections: Array<Record<string, unknown>> };
      const inherited = layout.sections.find(
        (section) => section.scope === "GLOBAL" && section.globalSectionId === sectionId,
      );
      expect(inherited, pageKey).toMatchObject({ slot: "BEFORE_CONTENT", isEnabled: true });
    }

    const adminGlobalsResponse = await page.request.get(`${backend}/api/admin/pages/global-sections`, { headers });
    expect(adminGlobalsResponse.status()).toBe(200);
    const adminGlobals = (await adminGlobalsResponse.json()) as Array<{ id: number; name: string }>;
    expect(adminGlobals).toContainEqual(
      expect.objectContaining({ id: sectionId, name: `[M9 ${runId}] Global acceptance` }),
    );

    await page.goto("/admin/pages/home");
    const inheritedName = page.getByText(`[M9 ${runId}] Global acceptance`, { exact: true }).last();
    await expect(inheritedName).toBeVisible();
    const inheritedCard = inheritedName.locator("xpath=ancestor::*[contains(@class, 'mantine-Card-root')][1]");
    await expect(inheritedCard.getByText("GLOBAL", { exact: true })).toBeVisible();
    await expect(inheritedCard.getByRole("button", { name: /удалить/i })).toHaveCount(0);

    const updatedResponse = await page.request.patch(`${backend}/api/admin/pages/global-sections/${sectionId}`, {
      headers,
      data: {
        expectedRevision: created.revision,
        html: `<main data-m9="${runId}">M9 global updated</main>`,
      },
    });
    expect(updatedResponse.status()).toBe(200);
    const updated = (await updatedResponse.json()) as { revision: number };

    const staleResponse = await page.request.patch(`${backend}/api/admin/pages/global-sections/${sectionId}`, {
      headers,
      data: { expectedRevision: created.revision, name: "stale update" },
    });
    expect(staleResponse.status()).toBe(409);

    const disabledResponse = await page.request.post(
      `${backend}/api/admin/pages/global-sections/${sectionId}/toggle`,
      {
        headers,
        data: { enabled: false, expectedRevision: updated.revision },
      },
    );
    expect(disabledResponse.status()).toBe(201);

    for (const pageKey of pageKeys) {
      const response = await page.request.get(`${backend}/api/public/pages/${pageKey}/layout`);
      const layout = (await response.json()) as { sections: Array<Record<string, unknown>> };
      expect(layout.sections.some((section) => section.globalSectionId === sectionId), pageKey).toBe(false);
    }
  } finally {
    if (sectionId) {
      const cleanup = await page.request.delete(`${backend}/api/admin/pages/global-sections/${sectionId}`, { headers });
      expect(cleanup.status()).toBe(200);
    }
  }
});
