import fs from "node:fs/promises";
import type { Page } from "@playwright/test";

export type FixtureDocument = { id: number; title: string; versionId: number; filename: string };

export async function readDocumentsFixture(page: Page): Promise<FixtureDocument[]> {
  if (!page.url().includes("/admin/documents")) await page.goto("/admin/documents");
  const fixtureFile = process.env.M8_DOCUMENT_FIXTURE_FILE;
  const fixture = fixtureFile ? JSON.parse(await fs.readFile(fixtureFile, "utf8")) as { runId: string; ids: number[] } : null;
  const payload = await page.evaluate(async (search) => {
    const suffix = search ? `&search=${encodeURIComponent(search)}` : "";
    const response = await fetch(`/api/admin/documents?page=1&pageSize=100&sortBy=updatedAt&sortDirection=desc${suffix}`);
    if (!response.ok) throw new Error(`fixture list failed: ${response.status}`);
    return await response.json();
  }, fixture ? `[M8 ${fixture.runId}]` : "") as { items?: Array<{ id: number; title: string; currentVersion?: { id: number; originalFilename: string } }> };
  const items = (payload.items ?? []).filter(item => !fixture || fixture.ids.includes(item.id));
  if (fixture && items.length !== fixture.ids.length) throw new Error(`fixture expected ${fixture.ids.length} task documents, received ${items.length}`);
  return items.map(item => ({ id: item.id, title: item.title, versionId: item.currentVersion?.id ?? 0, filename: item.currentVersion?.originalFilename ?? "" }));
}
