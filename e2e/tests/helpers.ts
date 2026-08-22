import { expect } from '@playwright/test'
import type { Page } from '@playwright/test'

export type FieldValue = { type: 'text'; value: string } | { type: 'select'; value: string }

export const text = (value: string): FieldValue => ({ type: 'text', value })
export const select = (value: string): FieldValue => ({ type: 'select', value })

/** Suffix that keeps records created by a spec distinguishable from seed data. */
export function unique(prefix: string): string {
  return `${prefix} ${Date.now()}-${Math.floor(Math.random() * 1000)}`
}

export function row(page: Page, cellText: string) {
  return page.getByRole('row').filter({ hasText: cellText })
}

export async function openSection(page: Page, label: string) {
  await page.getByRole('link', { name: label }).click()
  await expect(page.getByRole('heading', { level: 2, name: label })).toBeVisible()
}

/**
 * Opens the "Add …" dialog and fills the given fields (keyed by form field id).
 * Returns the dialog so the caller can save or inspect it.
 */
export async function fillCreateDialog(
  page: Page,
  addButton: string,
  fields: Record<string, FieldValue>,
) {
  await page.getByRole('button', { name: addButton }).click()
  const dialog = page.getByRole('dialog')
  await expect(dialog).toBeVisible()

  for (const [id, field] of Object.entries(fields)) {
    if (field.type === 'select') {
      await dialog.locator(`#${id}`).click()
      await page.getByRole('option', { name: field.value, exact: true }).click()
    } else {
      await dialog.locator(`#${id}`).fill(field.value)
    }
  }

  return dialog
}

/** Fills and saves the "Add …" dialog, asserting that it closed. */
export async function createRecord(
  page: Page,
  addButton: string,
  fields: Record<string, FieldValue>,
) {
  const dialog = await fillCreateDialog(page, addButton, fields)
  await dialog.getByRole('button', { name: 'Save' }).click()
  await expect(dialog).toBeHidden()
}

export async function deleteRow(page: Page, cellText: string) {
  const target = row(page, cellText)
  await target.getByRole('button', { name: 'Delete' }).click()
  await expect(target).toBeHidden()
}
