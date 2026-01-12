import { test, expect } from '@playwright/test'

test.describe('Navigation', () => {
  test('should navigate to home page', async ({ page }) => {
    await page.goto('/')
    await expect(page).toHaveURL('/')
  })

  test('should navigate to users page', async ({ page }) => {
    await page.goto('/users')
    await expect(page).toHaveURL('/users')
  })

  test('should navigate to video page', async ({ page }) => {
    await page.goto('/video')
    await expect(page).toHaveURL('/video')
  })

  test('should navigate to form page', async ({ page }) => {
    await page.goto('/form')
    await expect(page).toHaveURL('/form')
  })

  test('should navigate to status page', async ({ page }) => {
    await page.goto('/status')
    await expect(page).toHaveURL('/status')
  })
})

test.describe('Home Page', () => {
  test('should display main content', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('body')).toBeVisible()
  })
})
