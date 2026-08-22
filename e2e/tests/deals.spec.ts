import { expect, test } from '@playwright/test'

import { createRecord, deleteRow, row, select, text, unique } from './helpers'

test.describe('deals', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/deals')
    await expect(page.getByRole('heading', { level: 2, name: 'Deals' })).toBeVisible()
  })

  test('renders the seeded deals table', async ({ page }) => {
    for (const header of ['Name', 'Company', 'Value', 'Stage', 'Owner', 'Status']) {
      await expect(page.getByRole('columnheader', { name: header })).toBeVisible()
    }
    await expect(row(page, 'Deal #1').first()).toBeVisible()
  })

  test('creates a deal with a formatted value and then deletes it', async ({ page }) => {
    const name = unique('E2E Deal')

    await createRecord(page, 'Add Deal', {
      name: text(name),
      company: text('Playwright Ltd'),
      value: text('42000'),
      stage: select('Proposal'),
      owner: select('Daniel'),
      status: select('Open'),
    })

    const created = row(page, name)
    await expect(created).toBeVisible()
    await expect(created).toContainText('Proposal')
    await expect(created).toContainText('Daniel')
    await expect(created).toContainText('Open')
    // Value is rendered through the currency formatter.
    await expect(created).toContainText(/\$42,000/)

    await page.reload()
    await expect(row(page, name)).toBeVisible()

    await deleteRow(page, name)
    await page.reload()
    await expect(row(page, name)).toHaveCount(0)
  })
})
