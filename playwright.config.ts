import { defineConfig, devices } from "@playwright/test";

const baseURL = process.env.PLAYWRIGHT_BASE_URL ?? "http://127.0.0.1:4177";
const shouldStartLocalServer = process.env.PLAYWRIGHT_BASE_URL === undefined;

export default defineConfig({
  testDir: "./tests/e2e",
  use: {
    baseURL,
    ...devices["Desktop Chrome"]
  },
  webServer: shouldStartLocalServer ? {
    command: "npm run build && TEST_MODE=true PORT=4177 npm run start",
    reuseExistingServer: true,
    url: baseURL
  } : undefined
});
