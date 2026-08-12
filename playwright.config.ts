import { defineConfig, devices } from '@playwright/test';

const backendPort = process.env.PLAYWRIGHT_BACKEND_PORT ?? '8000';
const frontendPort = process.env.PLAYWRIGHT_FRONTEND_PORT ?? '5173';
const backendURL = `http://127.0.0.1:${backendPort}`;
const frontendURL = `http://127.0.0.1:${frontendPort}`;

export default defineConfig({
  testDir: './frontend/tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [['html'], ['list']],
  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL ?? frontendURL,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  webServer: [
    {
      command:
        `docker compose up -d --wait db redis && cd backend && uv run prisma migrate deploy && PYTHONPATH=src uv run python scripts/seed_dev_accounts.py && uv run uvicorn app.main:app --app-dir src --host 127.0.0.1 --port ${backendPort}`,
      url: `${backendURL}/health/ready`,
      reuseExistingServer: !process.env.CI,
      timeout: 120_000,
      env: {
        ...process.env,
        APP_ENV: 'e2e',
        BACKEND_CORS_ORIGINS: JSON.stringify([frontendURL]),
        FRONTEND_URL: frontendURL,
      },
    },
    {
      command: `npm --prefix frontend run dev -- --host 127.0.0.1 --port ${frontendPort}`,
      url: frontendURL,
      reuseExistingServer: !process.env.CI,
      env: {
        ...process.env,
        VITE_ENABLE_DEMO_LOGIN: 'true',
        VITE_API_URL: backendURL,
      },
    },
  ],
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
