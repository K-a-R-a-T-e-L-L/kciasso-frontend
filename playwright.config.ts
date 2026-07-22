import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/browser",
  fullyParallel: false,
  reporter: "line",
  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL ?? "http://localhost:3000",
    headless: process.env.PLAYWRIGHT_HEADLESS !== "false",
    trace: "retain-on-failure",
  },
  projects: [
    { name: "desktop-1366x768", use: { viewport: { width: 1366, height: 768 } } },
    { name: "mobile-390x844", use: { viewport: { width: 390, height: 844 } } },
    { name: "public-1440x900", use: { viewport: { width: 1440, height: 900 } } },
    { name: "public-1024x768", use: { viewport: { width: 1024, height: 768 } } },
    { name: "public-768x1024", use: { viewport: { width: 768, height: 1024 } } },
  ],
});
