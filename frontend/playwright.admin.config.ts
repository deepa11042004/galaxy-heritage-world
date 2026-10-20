import { defineConfig, devices } from '@playwright/test';

// Admin panel e2e: expects the API (:4000) and web app (:3000) to be running already.
export default defineConfig({
  testDir: './tests',
  testMatch: 'admin.spec.ts',
  fullyParallel: false,
  workers: 1,
  timeout: 90_000,
  reporter: [['list']],
  use: { baseURL: 'http://localhost:3000', trace: 'retain-on-failure', screenshot: 'only-on-failure' },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
});
