import { defineConfig } from "@playwright/test";

export default defineConfig({
  timeout: 45_000,
  workers: 2,
  testDir: "./tests",
  use: { baseURL: process.env.PLAYWRIGHT_BASE_URL ?? "http://127.0.0.1:5173" },
  projects: [
    { name: "desktop", use: { viewport: { width: 1440, height: 900 } } },
    { name: "laptop", use: { viewport: { width: 1280, height: 800 } } },
    { name: "wide-desktop", use: { viewport: { width: 1920, height: 1080 } } },
    { name: "reflow", use: { viewport: { width: 320, height: 800 } } },
  ],
});
