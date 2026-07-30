import { chromium, type FullConfig } from "@playwright/test";
import fs from "node:fs/promises";

export default async function globalSetup(config: FullConfig) {
  const statePath = process.env.PLAYWRIGHT_AUTH_STATE;
  const email = process.env.KCIASSO_ADMIN_EMAIL;
  const password = process.env.KCIASSO_ADMIN_PASSWORD;
  if (!statePath || !email || !password) return;
  const baseURL = config.projects[0]?.use.baseURL ?? process.env.PLAYWRIGHT_BASE_URL ?? "http://localhost:3000";
  const browser = await chromium.launch();
  try {
    const context = await browser.newContext({ baseURL });
    const page = await context.newPage();
    await page.goto("/admin/login");
    await page.locator('input[name="email"]').fill(email);
    await page.locator('input[name="password"]').fill(password);
    await Promise.all([page.waitForURL(/\/admin\/(news|documents|pages|settings|users)/), page.locator('form button[type="submit"]').click()]);
    await context.storageState({ path: statePath });
    const fixturePath = process.env.M8_DOCUMENT_FIXTURE_FILE;
    const backend = process.env.KCIASSO_BACKEND_URL;
    const runId = process.env.M8_RUN_ID;
    if (fixturePath && backend && runId) {
      const auth = await page.request.post(`${backend}/api/user/authenticate`, { data: { email, password } });
      if (!auth.ok()) throw new Error(`fixture auth failed: ${auth.status()}`);
      const token = (await auth.json()).token as string;
      const tokenPath = process.env.M8_API_TOKEN_FILE;
      if (tokenPath) await fs.writeFile(tokenPath, token, "utf8");
      const ids: number[] = [];
      for (let index = 1; index <= 12; index += 1) {
        const form = new FormData();
        form.append("placementKeys", "gia-9.normative-documents");
        form.append("title", `[M8 ${runId}] document fixture ${index}`);
        form.append("file", new Blob([`%PDF-1.7\nM8 ${runId} fixture ${index}\n%%EOF`], { type: "application/pdf" }), `m8-${runId}-fixture-${index}.pdf`);
        const created = await page.request.post(`${backend}/api/admin/documents`, { headers: { authorization: `Bearer ${token}` }, multipart: form });
        if (!created.ok()) throw new Error(`document fixture ${index} failed: ${created.status()}`);
        ids.push((await created.json()).id as number);
      }
      await fs.writeFile(fixturePath, JSON.stringify({ runId, ids }), "utf8");
    }
    await context.close();
  } finally { await browser.close(); }
}
