import { expect, test } from '@playwright/test'

import { openSection } from './helpers'

test('sidebar navigates between every CRM section', async ({ page }) => {
  await page.goto('/')

  await expect(page.getByRole('heading', { level: 1, name: 'CRM Pro' })).toBeVisible()

  for (const [label, path] of [
    ['Contacts', '/contacts'],
    ['Companies', '/companies'],
    ['Deals', '/deals'],
    ['Tasks', '/tasks'],
  ] as const) {
    await openSection(page, label)
    await expect(page).toHaveURL(new RegExp(`${path}$`))
  }

  await page.getByRole('link', { name: 'Dashboard' }).click()
  await expect(page.getByRole('heading', { level: 2, name: 'Dashboard' })).toBeVisible()
})

test('deep links render the requested section directly', async ({ page }) => {
  await page.goto('/deals')
  await expect(page.getByRole('heading', { level: 2, name: 'Deals' })).toBeVisible()
  await expect(page.getByRole('columnheader', { name: 'Stage' })).toBeVisible()
})
