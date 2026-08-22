import { expect, test } from '@playwright/test'

import { createRecord, deleteRow, row, select, text, unique } from './helpers'

test.describe('tasks', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/tasks')
    await expect(page.getByRole('heading', { level: 2, name: 'Tasks' })).toBeVisible()
  })

  test('renders the seeded tasks table', async ({ page }) => {
    for (const header of ['Type', 'Related to', 'Assigned to', 'Due date', 'Status']) {
      await expect(page.getByRole('columnheader', { name: header })).toBeVisible()
    }
    await expect(row(page, 'Send proposal').first()).toBeVisible()
  })

  test('creates a task and then deletes it', async ({ page }) => {
    const type = unique('E2E Task')

    await createRecord(page, 'Add Task', {
      type: text(type),
      relatedTo: text('Playwright Ltd'),
      assignedTo: select('Liam'),
      dueDate: text('2025-12-24'),
      status: select('In Progress'),
    })

    const created = row(page, type)
    await expect(created).toBeVisible()
    await expect(created).toContainText('Playwright Ltd')
    await expect(created).toContainText('Liam')
    await expect(created).toContainText('In Progress')

    await page.reload()
    await expect(row(page, type)).toBeVisible()

    await deleteRow(page, type)
    await page.reload()
    await expect(row(page, type)).toHaveCount(0)
  })
})
