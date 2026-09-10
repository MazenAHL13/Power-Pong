import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/e2e",
  use: {
    baseURL: "http://127.0.0.1:4177",
    ...devices["Desktop Chrome"]
  },
  webServer: {
    command: "npm run build && PORT=4177 npm run start",
    reuseExistingServer: true,
    url: "http://127.0.0.1:4177"
  }
});
