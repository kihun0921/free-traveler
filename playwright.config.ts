import { defineConfig, devices } from "@playwright/test";

// Preview URL이 주어지면 그 URL을 대상으로 검사하고, 없으면 로컬 dev 서버를 직접 띄운다.
const PLAYWRIGHT_BASE_URL = process.env.PLAYWRIGHT_BASE_URL;
const baseURL = PLAYWRIGHT_BASE_URL || "http://127.0.0.1:3000";
const isPreviewTarget = Boolean(PLAYWRIGHT_BASE_URL);

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  reporter: [
    ["list"],
    ["html", { outputFolder: "playwright-report", open: "never" }],
  ],
  use: {
    baseURL,
    trace: "on-first-retry",
    screenshot: "only-on-failure",
  },
  // Chromium 단일 Project만 사용한다(Firefox/WebKit 매트릭스 없음).
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  // Preview URL을 대상으로 검사할 때는 로컬 dev 서버를 띄우지 않는다.
  webServer: isPreviewTarget
    ? undefined
    : {
        command: "npm run dev",
        url: baseURL,
        reuseExistingServer: !process.env.CI,
        timeout: 120_000,
      },
});
