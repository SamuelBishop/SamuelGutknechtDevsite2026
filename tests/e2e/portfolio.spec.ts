import { expect, test } from '@playwright/test'

test('primary routes render and navigate', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('heading', { level: 1 })).toContainText(
    'Building software',
  )
  await page.getByRole('link', { name: 'About' }).first().click()
  await expect(page).toHaveURL(/\/about$/)
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
})

test('has no horizontal overflow', async ({ page }) => {
  for (const route of ['/', '/about', '/work', '/projects', '/resume']) {
    await page.goto(route)
    const overflows = await page.evaluate(
      () =>
        document.documentElement.scrollWidth >
        document.documentElement.clientWidth,
    )
    expect(overflows).toBe(false)
  }
})

test('mobile menu is keyboard operable', async ({ page, isMobile }) => {
  test.skip(!isMobile)
  await page.goto('/')
  await page.getByRole('button', { name: 'Open navigation' }).click()
  await expect(page.getByRole('dialog', { name: 'Navigation' })).toBeVisible()
  await page.keyboard.press('Escape')
  await expect(
    page.getByRole('dialog', { name: 'Navigation' }),
  ).not.toBeVisible()
})
