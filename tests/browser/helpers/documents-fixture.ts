import type { Page } from "@playwright/test";

export type FixtureDocument = { id: number; title: string; versionId: number; filename: string };

export async function readDocumentsFixture(page: Page): Promise<FixtureDocument[]> {
  if (!page.url().includes("/admin/documents")) {
    await page.goto("/admin/documents");
  }
  const payload = await page.evaluate(async () => {
    const response = await fetch("/api/admin/documents?page=1&pageSize=50&sortBy=updatedAt&sortDirection=desc");
    if (!response.ok) throw new Error(`fixture list failed: ${response.status}`);
    return await response.json();
  }) as { items?: Array<{ id: number; title: string; currentVersion?: { id: number; originalFilename: string } }> };
  const items = payload.items ?? [];
  if (items.length < 12) throw new Error(`fixture requires at least 12 documents, received ${items.length}`);
  return items.map(item => ({ id: item.id, title: item.title, versionId: item.currentVersion?.id ?? 0, filename: item.currentVersion?.originalFilename ?? "" }));
}
