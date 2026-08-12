import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './frontend/tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [['html'], ['list']],
  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL ?? 'http://127.0.0.1:5173',
    trace: 'on-first-retry',
  },
  webServer: [
    {
      command:
        'docker compose up -d --wait db redis && cd backend && uv run prisma migrate deploy && PYTHONPATH=src uv run python scripts/seed_dev_accounts.py && uv run uvicorn app.main:app --app-dir src --host 127.0.0.1 --port 8000',
      url: 'http://127.0.0.1:8000/health/ready',
      reuseExistingServer: !process.env.CI,
      timeout: 120_000,
      env: {
        ...process.env,
        APP_ENV: 'e2e',
      },
    },
    {
      command: 'npm --prefix frontend run dev -- --host 127.0.0.1',
      url: 'http://127.0.0.1:5173',
      reuseExistingServer: !process.env.CI,
      env: {
        ...process.env,
        VITE_ENABLE_DEMO_LOGIN: 'true',
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
