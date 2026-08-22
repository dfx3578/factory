import { expect, test } from '@playwright/test'

test.describe('dashboard', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('shows the four KPI cards with values from the API', async ({ page }) => {
    await expect(page.getByRole('heading', { level: 2, name: 'Dashboard' })).toBeVisible()

    for (const label of ['Total contacts', 'Companies', 'Active deals', 'Revenue']) {
      const card = page.locator('div').filter({ hasText: label }).last()
      await expect(card).toBeVisible()
    }

    // Counts are rendered only after /api/dashboard resolves.
    await expect(page.getByText('Total contacts')).toBeVisible()
    await expect(page.getByText(/^\d+$/).first()).toBeVisible()
  })

  test('lists recent activity, performance, contacts and tasks', async ({ page }) => {
    for (const section of ['Recent activity', 'Performance', 'Recently created contacts', 'Upcoming tasks']) {
      await expect(page.getByText(section, { exact: false }).first()).toBeVisible()
    }

    await expect(page.getByText('Jane Smith').first()).toBeVisible()
  })

  test('reports a backend failure instead of rendering an empty page', async ({ page }) => {
    await page.route('**/api/dashboard', (route) => route.fulfill({ status: 500, body: 'boom' }))
    await page.goto('/')
    await expect(page.getByText(/Failed to load dashboard/)).toBeVisible()
  })
})
