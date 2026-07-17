import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/browser",
  fullyParallel: false,
  reporter: "line",
  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL ?? "http://localhost:3000",
    headless: false,
    trace: "retain-on-failure",
  },
  projects: [
    { name: "desktop-1366x768", use: { viewport: { width: 1366, height: 768 } } },
    { name: "mobile-390x844", use: { viewport: { width: 390, height: 844 } } },
  ],
});
