import { test, expect } from '@playwright/test'

test.describe('Product Browsing', () => {
  test('should display homepage with featured products', async ({ page }) => {
    await page.goto('/')

    // Check for hero section
    await expect(page.locator('h1')).toContainText(/momenterie/i)

    // Check for product grid
    const productCards = page.locator('[data-testid="product-card"]')
    await expect(productCards.first()).toBeVisible()
  })

  test('should navigate to product detail page', async ({ page }) => {
    await page.goto('/')

    // Click on first product
    await page.locator('[data-testid="product-card"]').first().click()

    // Wait for product page to load
    await expect(page).toHaveURL(/\/products\//)

    // Check for product details
    await expect(page.locator('h1')).toBeVisible()
    await expect(page.getByRole('button', { name: /customize/i })).toBeVisible()
  })

  test('should filter products by category', async ({ page }) => {
    await page.goto('/collections/all')

    // Check initial product count
    const initialProducts = await page.locator('[data-testid="product-card"]').count()
    expect(initialProducts).toBeGreaterThan(0)

    // Apply category filter
    await page.getByRole('button', { name: /city maps/i }).click()

    // Wait for filtered results
    await page.waitForLoadState('networkidle')

    // Verify URL updated
    await expect(page).toHaveURL(/category=/)
  })

  test('should search for products', async ({ page }) => {
    await page.goto('/collections/all')

    // Find and fill search input
    const searchInput = page.getByPlaceholder(/search/i)
    await searchInput.fill('star map')

    // Submit search
    await searchInput.press('Enter')

    // Wait for results
    await page.waitForLoadState('networkidle')

    // Verify search results
    const products = page.locator('[data-testid="product-card"]')
    const count = await products.count()
    expect(count).toBeGreaterThan(0)
  })

  test('should display product variants', async ({ page }) => {
    await page.goto('/products/custom-city-map')

    // Check for variant selector
    const variants = page.locator('[data-testid="variant-option"]')
    await expect(variants.first()).toBeVisible()

    // Select a variant
    await variants.first().click()

    // Verify price updates
    const price = page.locator('[data-testid="product-price"]')
    await expect(price).toBeVisible()
  })

  test('should add product to wishlist', async ({ page }) => {
    await page.goto('/products/custom-city-map')

    // Click wishlist button
    const wishlistButton = page.getByRole('button', { name: /add to wishlist|wishlist/i })
    await wishlistButton.click()

    // Verify toast notification appears
    await expect(page.locator('text=Added to wishlist')).toBeVisible({ timeout: 5000 })
  })
})
