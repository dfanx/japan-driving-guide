import { defineConfig, devices } from "@playwright/test";

const testPort = Number(process.env.TEST_PORT ?? "4321");

export default defineConfig({
  testDir: "./tests/e2e",
  globalSetup: "./tests/e2e/global-setup.mjs",
  fullyParallel: true,
  workers: 4,
  retries: 0,
  reporter: "list",
  use: {
    baseURL: `http://127.0.0.1:${testPort}`,
    trace: "retain-on-failure",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
});
