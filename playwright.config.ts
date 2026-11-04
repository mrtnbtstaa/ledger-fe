import { defineConfig, devices } from "@playwright/test";

/**
 * Runs against the mock backend (NEXT_PUBLIC_USE_MOCK=1) so the P1 stories are deterministic
 * without a deployed Render instance. Cold-start behaviour is covered by the unit test.
 */
export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI ? "github" : "list",
  use: {
    baseURL: "http://127.0.0.1:3100",
    trace: "on-first-retry",
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer: {
    command: "npm run build && npm run start -- -p 3100",
    url: "http://127.0.0.1:3100",
    reuseExistingServer: !process.env.CI,
    timeout: 240_000,
    env: { NEXT_PUBLIC_USE_MOCK: "1", NEXT_PUBLIC_API_URL: "" },
  },
});
