import type { Page } from "@playwright/test";
import fs from "node:fs/promises";

let tokenPromise: Promise<string> | undefined;

export function adminApiToken(page: Page): Promise<string> {
  const tokenPath = process.env.M8_API_TOKEN_FILE;
  if (tokenPath) {
    tokenPromise ??= fs.readFile(tokenPath, "utf8");
    return tokenPromise;
  }
  tokenPromise ??= page.request.post(`${process.env.KCIASSO_BACKEND_URL ?? "http://127.0.0.1:4490"}/api/user/authenticate`, {
    data: {
      email: process.env.KCIASSO_ADMIN_EMAIL ?? "admin-i6b4@example.com",
      password: process.env.KCIASSO_ADMIN_PASSWORD ?? "AdminI6b4Pass123!",
    },
  }).then(async (response) => {
    if (!response.ok()) throw new Error(`admin api auth failed: ${response.status()}`);
    return (await response.json()).token as string;
  });
  return tokenPromise;
}
