import { expect, test } from '@playwright/test'

import { createRecord, deleteRow, row, select, text, unique } from './helpers'

test.describe('companies', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/companies')
    await expect(page.getByRole('heading', { level: 2, name: 'Companies' })).toBeVisible()
  })

  test('renders the seeded companies table', async ({ page }) => {
    for (const header of ['Name', 'Industry', 'Size', 'Location', 'Website']) {
      await expect(page.getByRole('columnheader', { name: header })).toBeVisible()
    }
    await expect(row(page, 'acme.com').first()).toBeVisible()
  })

  test('creates a company and then deletes it', async ({ page }) => {
    const name = unique('E2E Company')

    await createRecord(page, 'Add Company', {
      name: text(name),
      industry: select('Healthcare'),
      size: select('51-200'),
      location: text('Berlin, DE'),
      website: text('e2e-company.test'),
    })

    const created = row(page, name)
    await expect(created).toBeVisible()
    await expect(created).toContainText('Healthcare')
    await expect(created).toContainText('51-200')
    await expect(created).toContainText('Berlin, DE')

    await page.reload()
    await expect(row(page, name)).toBeVisible()

    await deleteRow(page, name)
    await page.reload()
    await expect(row(page, name)).toHaveCount(0)
  })
})
