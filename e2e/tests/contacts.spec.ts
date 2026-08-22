import { expect, test } from '@playwright/test'

import { createRecord, deleteRow, fillCreateDialog, row, select, text, unique } from './helpers'

test.describe('contacts', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/contacts')
    await expect(page.getByRole('heading', { level: 2, name: 'Contacts' })).toBeVisible()
  })

  test('renders the seeded contacts table', async ({ page }) => {
    for (const header of ['Full name', 'Email', 'Company', 'Source', 'Owner', 'Created']) {
      await expect(page.getByRole('columnheader', { name: header })).toBeVisible()
    }
    await expect(row(page, 'jane.smith@acme.com')).toBeVisible()
  })

  test('creates a contact and then deletes it', async ({ page }) => {
    const name = unique('E2E Contact')
    const email = `${name.replace(/[^a-z0-9]/gi, '.').toLowerCase()}@example.com`

    await createRecord(page, 'Add Contact', {
      fullName: text(name),
      email: text(email),
      phone: text('+1 555 9999'),
      company: text('Playwright Ltd'),
      source: select('Referral'),
      owner: select('Emma'),
    })

    const created = row(page, email)
    await expect(created).toBeVisible()
    await expect(created).toContainText(name)
    await expect(created).toContainText('Playwright Ltd')
    await expect(created).toContainText('Referral')
    await expect(created).toContainText('Emma')

    // The record survives a reload, i.e. it was persisted by the backend.
    await page.reload()
    await expect(row(page, email)).toBeVisible()

    await deleteRow(page, email)
    await page.reload()
    await expect(row(page, email)).toHaveCount(0)
  })

  test('a new contact is counted on the dashboard', async ({ page }) => {
    const readTotal = async () => {
      await page.goto('/')
      const value = page
        .locator('div')
        .filter({ has: page.getByText('Total contacts', { exact: true }) })
        .locator('p.text-3xl')
        .first()
      await expect(value).toBeVisible()
      return Number((await value.innerText()).replace(/\D/g, ''))
    }

    const before = await readTotal()

    const email = `${unique('counted').replace(/\s/g, '-')}@example.com`
    await page.goto('/contacts')
    await createRecord(page, 'Add Contact', {
      fullName: text('Counted Contact'),
      email: text(email),
      phone: text('+1 555 0000'),
      company: text('Playwright Ltd'),
      source: select('Website'),
      owner: select('Sarah'),
    })
    await expect(row(page, email)).toBeVisible()

    expect(await readTotal()).toBe(before + 1)

    await page.goto('/contacts')
    await deleteRow(page, email)
  })

  test('surfaces an error when the create request fails', async ({ page }) => {
    await page.route('**/api/contacts', async (route) => {
      if (route.request().method() === 'POST') {
        await route.fulfill({ status: 500, body: 'boom' })
        return
      }
      await route.fallback()
    })

    const dialog = await fillCreateDialog(page, 'Add Contact', {
      fullName: text('Broken Contact'),
      email: text('broken@example.com'),
    })
    await dialog.getByRole('button', { name: 'Save' }).click()

    // The dialog stays open so the entered values are not lost.
    await expect(dialog).toBeVisible()
    await expect(dialog.getByRole('button', { name: 'Save' })).toBeEnabled()
    await expect(page.getByText(/Request failed: 500/)).toBeVisible()
    await expect(row(page, 'broken@example.com')).toHaveCount(0)
  })
})
