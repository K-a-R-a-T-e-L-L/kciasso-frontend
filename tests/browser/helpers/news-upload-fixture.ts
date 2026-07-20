import fs from "node:fs/promises";
import path from "node:path";
import type { Page } from "@playwright/test";

const JPEG_1X1 = Buffer.from("/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAP//////////////////////////////////////////////////////////////////////////////////////2wBDAf//////////////////////////////////////////////////////////////////////////////////////wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAX/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIQAxAAAAH/AP/EABQQAQAAAAAAAAAAAAAAAAAAAAD/2gAIAQEAAT8Af//EABQRAQAAAAAAAAAAAAAAAAAAAAD/2gAIAQIBAT8Af//EABQRAQAAAAAAAAAAAAAAAAAAAAD/2gAIAQMBAT8Af//Z", "base64");

export async function createNewsUploadFixtures(root = path.resolve("tests/browser/.fixtures/news-upload")) {
  await fs.mkdir(root, { recursive: true });
  const writeJpeg = async (name: string, size: number) => {
    const data = Buffer.alloc(size);
    JPEG_1X1.copy(data);
    data[data.length - 2] = 0xff;
    data[data.length - 1] = 0xd9;
    const file = path.join(root, name);
    await fs.writeFile(file, data);
    return file;
  };
  const medium = await writeJpeg("valid-medium.jpg", 3 * 1024 * 1024);
  const nearLimit = await writeJpeg("valid-near-limit.jpg", 9.6 * 1024 * 1024);
  const tooLarge = await writeJpeg("valid-too-large.jpg", 10 * 1024 * 1024 + 1);
  const svg = path.join(root, "invalid.svg");
  await fs.writeFile(svg, "<svg xmlns=\"http://www.w3.org/2000/svg\"><script>alert(1)</script></svg>");
  const fake = path.join(root, "fake.png");
  await fs.writeFile(fake, Buffer.from("not-a-png-signature"));
  const sizes = Object.fromEntries(await Promise.all([medium, nearLimit, tooLarge].map(async file => [path.basename(file), (await fs.stat(file)).size])));
  return { medium, nearLimit, tooLarge, svg, fake, sizes };
}

export async function createNewsAcceptanceFixture(page: Page) {
  const base = process.env.KCIASSO_BACKEND_URL ?? "http://127.0.0.1:4476";
  const auth = await page.request.post(`${base}/api/user/authenticate`, { data: { email: process.env.KCIASSO_ADMIN_EMAIL ?? "admin@gmail.com", password: process.env.KCIASSO_ADMIN_PASSWORD ?? "AdminI6b6Pass123!" } });
  if (!auth.ok()) throw new Error(`fixture auth failed: ${auth.status()}`);
  const token = (await auth.json()).token as string;
  const duplicateSlug = `i7a4c-duplicate-${Date.now()}`;
  const seeded = await page.request.post(`${base}/api/admin/news`, { headers: { authorization: `Bearer ${token}` }, data: { title: "I7A4C duplicate target", slug: duplicateSlug, excerpt: "fixture", content: "fixture" } });
  if (!seeded.ok()) throw new Error(`duplicate fixture failed: ${seeded.status()}`);
  return { adminEmail: process.env.KCIASSO_ADMIN_EMAIL ?? "admin@gmail.com", adminPassword: process.env.KCIASSO_ADMIN_PASSWORD ?? "AdminI6b6Pass123!", duplicateSlug, duplicateId: (await seeded.json()).id };
}
