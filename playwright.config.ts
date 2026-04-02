import { defineConfig, devices } from "@playwright/test";

const baseURL = process.env.PLAYWRIGHT_BASE_URL ?? "http://127.0.0.1:3100";
const shouldManageWebServer =
  process.env.PLAYWRIGHT_SKIP_WEBSERVER !== "1" &&
  /^https?:\/\/(127\.0\.0\.1|localhost)(:\d+)?/i.test(baseURL);

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: false,
  workers: 1,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 2 : 0,
  reporter: [["html", { open: "never" }], ["list"]],
  timeout: 90_000,
  expect: {
    timeout: 15_000,
  },
  use: {
    baseURL,
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
  },
  projects: [
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
      },
    },
  ],
  webServer: shouldManageWebServer
    ? {
        command: "npm run dev:e2e --workspace @canopy/portal",
        cwd: __dirname,
        url: `${baseURL}/sign-in`,
        reuseExistingServer: !process.env.CI,
        timeout: 120_000,
      }
    : undefined,
});
