import { defineConfig, devices } from '@playwright/test'

const frontendPort = Number(process.env.E2E_FRONTEND_PORT ?? 5173)
const backendPort = Number(process.env.E2E_BACKEND_PORT ?? 8080)
const baseURL = process.env.E2E_BASE_URL ?? `http://localhost:${frontendPort}`

/**
 * The backend keeps its data in memory and the UI has no pagination, so the
 * suite runs single-threaded: specs share one seeded dataset and assert on
 * records they create themselves.
 */
export default defineConfig({
  testDir: './tests',
  fullyParallel: false,
  workers: 1,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI ? [['github'], ['html', { open: 'never' }]] : [['list'], ['html', { open: 'never' }]],
  timeout: 30_000,
  expect: { timeout: 10_000 },
  use: {
    baseURL,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
  ],
  webServer: process.env.E2E_BASE_URL
    ? undefined
    : [
        {
          command: './mvnw -q spring-boot:run',
          cwd: '../backend',
          url: `http://localhost:${backendPort}/api/dashboard`,
          reuseExistingServer: !process.env.CI,
          timeout: 180_000,
          stdout: 'pipe',
          stderr: 'pipe',
        },
        {
          command: `npm run dev -- --port ${frontendPort} --strictPort`,
          cwd: '../frontend',
          url: baseURL,
          reuseExistingServer: !process.env.CI,
          timeout: 120_000,
          stdout: 'pipe',
          stderr: 'pipe',
        },
      ],
})
