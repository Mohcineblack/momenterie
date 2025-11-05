import { test, expect } from '@playwright/test'

test.describe('Editor Customization Flow', () => {
  test('should customize city map and add to cart', async ({ page }) => {
    // Navigate to city map product
    await page.goto('/products/custom-city-map')

    // Click customize button
    await page.getByRole('button', { name: /customize/i }).click()

    // Wait for editor to load
    await expect(page).toHaveURL(/\/editor\/citymaps/)

    // Fill in location
    const locationInput = page.getByPlaceholder(/enter city or address/i)
    await locationInput.fill('Paris')

    // Wait for location suggestions
    await page.waitForTimeout(1000)

    // Select first suggestion
    await page.getByRole('button', { name: /paris/i }).first().click()

    // Fill in title
    await page.getByLabel(/title/i).fill('Where We Met')

    // Fill in subtitle
    await page.getByLabel(/subtitle/i).fill('Our Special Place')

    // Select a style
    await page.getByRole('button', { name: /style/i }).first().click()

    // Verify preview updates
    await expect(page.locator('[data-testid="map-preview"]')).toBeVisible()

    // Select variant
    await page.locator('[data-testid="variant-option"]').first().click()

    // Add to cart
    await page.getByRole('button', { name: /add to cart/i }).click()

    // Verify success message
    await expect(page.locator('text=/added to cart/i')).toBeVisible({ timeout: 5000 })

    // Verify redirect to cart
    await expect(page).toHaveURL(/\/cart/)
  })

  test('should customize star map with date and location', async ({ page }) => {
    await page.goto('/editor/starmaps?product=custom-star-map')

    // Select date
    await page.getByRole('button', { name: /select a date/i }).click()

    // Pick a date from calendar
    await page.locator('[role="gridcell"]').first().click()

    // Enter time
    await page.getByLabel(/time/i).fill('20:30')

    // Enter location
    const locationInput = page.getByPlaceholder(/enter city or address/i)
    await locationInput.fill('London')
    await page.waitForTimeout(1000)
    await page.getByRole('button', { name: /london/i }).first().click()

    // Enter title
    await page.getByLabel(/title/i).fill('Our Wedding Night')

    // Verify preview shows constellation
    await expect(page.locator('[data-testid="starmap-preview"]')).toBeVisible()

    // Save draft
    await page.getByRole('button', { name: /save draft/i }).click()

    // Verify save confirmation
    await expect(page.locator('text=/draft saved/i')).toBeVisible({ timeout: 5000 })
  })

  test('should upload photo for puzzle', async ({ page }) => {
    await page.goto('/editor/puzzles?product=photo-puzzle')

    // Verify upload area is visible
    await expect(page.locator('[data-testid="file-upload"]')).toBeVisible()

    // In a real test, you would upload an actual file
    // For this example, we'll just verify the upload UI

    // Check for file input
    const fileInput = page.locator('input[type="file"]')
    await expect(fileInput).toBeAttached()

    // Verify instructions
    await expect(page.locator('text=/upload photo|drag and drop/i')).toBeVisible()

    // Select puzzle size
    await page.locator('[data-testid="variant-option"]').first().click()
  })

  test('should customize jewelry with date and location', async ({ page }) => {
    await page.goto('/editor/jewelry?product=star-map-necklace')

    // Select date
    await page.getByRole('button', { name: /select a date/i }).click()
    await page.locator('[role="gridcell"]').first().click()

    // Select location
    const locationInput = page.getByPlaceholder(/search for a location/i)
    await locationInput.fill('Tokyo')
    await page.waitForTimeout(1000)
    await page.getByRole('button', { name: /tokyo/i }).first().click()

    // Select material variant
    await page.getByRole('button', { name: /gold|silver|rose gold/i }).first().click()

    // Verify preview updates
    await expect(page.locator('[data-testid="jewelry-preview"]')).toBeVisible()

    // Add to cart
    await page.getByRole('button', { name: /add to cart/i }).click()

    // Verify added to cart
    await expect(page.locator('text=/added to cart/i')).toBeVisible({ timeout: 5000 })
  })

  test('should create date print with custom text', async ({ page }) => {
    await page.goto('/editor/dateprints?product=date-print')

    // Select date
    await page.getByRole('button', { name: /select a date/i }).click()
    await page.locator('[role="gridcell"]').first().click()

    // Enter title
    await page.getByLabel(/title/i).fill('Our Anniversary')

    // Enter subtitle
    await page.getByLabel(/subtitle/i).fill('Best Day Ever')

    // Select style
    await page.locator('[data-testid="style-option"]').first().click()

    // Verify preview shows date
    await expect(page.locator('[data-testid="date-preview"]')).toBeVisible()

    // Select size
    await page.locator('[data-testid="variant-option"]').first().click()

    // Add to cart
    await page.getByRole('button', { name: /add to cart/i }).click()

    // Verify success
    await expect(page.locator('text=/added to cart/i')).toBeVisible({ timeout: 5000 })
  })

  test('should validate required fields before adding to cart', async ({ page }) => {
    await page.goto('/editor/citymaps?product=custom-city-map')

    // Try to add to cart without filling required fields
    await page.getByRole('button', { name: /add to cart/i }).click()

    // Verify validation messages
    await expect(page.locator('text=/please select|required/i').first()).toBeVisible({ timeout: 3000 })
  })
})
