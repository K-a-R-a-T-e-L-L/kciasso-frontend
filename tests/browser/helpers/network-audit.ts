import type { Page } from "@playwright/test";

export function startNetworkAudit(page: Page) {
  const errors: string[] = [];
  page.on("console", message => { if (message.type() === "error" || message.type() === "warning") errors.push(`${message.type()}: ${message.text()}`); });
  page.on("pageerror", error => errors.push(`pageerror: ${error.message}`));
  page.on("requestfailed", request => { const url = request.url(); if ((url.includes("/api/") || url.includes("/_next/")) && !url.includes("/_next/image") && !url.includes("example.test")) errors.push(`requestfailed: ${url}`); });
  page.on("response", response => { if (response.status() >= 500 && !response.url().includes("/api/admin/news/media")) errors.push(`5xx: ${response.status()} ${response.url()}`); });
  return { assertClean(allowStatuses: number[] = []) { const unexpected = errors.filter(error => !allowStatuses.some(status => error.includes(` ${status} `))); if (unexpected.length) throw new Error(unexpected.join("\n")); } };
}
