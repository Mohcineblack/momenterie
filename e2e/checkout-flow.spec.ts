import { test, expect } from '@playwright/test'

test.describe('Checkout Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to a product page
    await page.goto('/products/custom-city-map')
  })

  test('should add product to cart and proceed to checkout', async ({ page }) => {
    // Click customize button
    await page.getByRole('button', { name: /customize/i }).click()

    // Wait for editor to load
    await expect(page).toHaveURL(/\/editor\//)

    // Fill in customization (simplified for test)
    // In a real test, you would interact with the editor controls

    // Add to cart
    await page.getByRole('button', { name: /add to cart/i }).click()

    // Verify cart drawer opens
    await expect(page.locator('[data-testid="cart-drawer"]')).toBeVisible({ timeout: 5000 })

    // Click checkout button
    await page.getByRole('button', { name: /checkout/i }).click()

    // Verify checkout page loads
    await expect(page).toHaveURL(/\/checkout/)
  })

  test('should fill shipping information', async ({ page }) => {
    // Assume we have items in cart already
    await page.goto('/checkout')

    // Fill shipping form
    await page.getByLabel(/first name/i).fill('John')
    await page.getByLabel(/last name/i).fill('Doe')
    await page.getByLabel(/email/i).fill('john@example.com')
    await page.getByLabel(/street/i).fill('123 Main St')
    await page.getByLabel(/city/i).fill('New York')
    await page.getByLabel(/postal code/i).fill('10001')
    await page.getByLabel(/country/i).selectOption('US')

    // Verify form accepts input
    await expect(page.getByLabel(/first name/i)).toHaveValue('John')
  })

  test('should validate required fields', async ({ page }) => {
    await page.goto('/checkout')

    // Try to proceed without filling form
    await page.getByRole('button', { name: /continue to payment/i }).click()

    // Verify validation errors appear
    await expect(page.locator('text=/required/i').first()).toBeVisible()
  })

  test('should apply coupon code', async ({ page }) => {
    await page.goto('/checkout')

    // Find coupon input
    const couponInput = page.getByPlaceholder(/coupon code/i)
    await couponInput.fill('WELCOME10')

    // Apply coupon
    await page.getByRole('button', { name: /apply/i }).click()

    // Verify discount is applied
    await expect(page.locator('text=/discount applied/i')).toBeVisible({ timeout: 5000 })
  })

  test('should display order summary', async ({ page }) => {
    await page.goto('/checkout')

    // Verify order summary is visible
    await expect(page.locator('[data-testid="order-summary"]')).toBeVisible()

    // Verify it shows subtotal
    await expect(page.locator('text=/subtotal/i')).toBeVisible()

    // Verify it shows total
    await expect(page.locator('text=/total/i')).toBeVisible()
  })

  test('should handle payment form', async ({ page }) => {
    await page.goto('/checkout')

    // Fill shipping information first
    await page.getByLabel(/first name/i).fill('John')
    await page.getByLabel(/last name/i).fill('Doe')
    await page.getByLabel(/email/i).fill('john@example.com')
    await page.getByLabel(/street/i).fill('123 Main St')
    await page.getByLabel(/city/i).fill('New York')
    await page.getByLabel(/postal code/i).fill('10001')

    // Continue to payment
    await page.getByRole('button', { name: /continue to payment/i }).click()

    // Verify payment section appears
    await expect(page.locator('[data-testid="payment-form"]')).toBeVisible({ timeout: 5000 })

    // Verify Stripe element loads
    await expect(page.locator('[data-testid="card-element"]')).toBeVisible({ timeout: 10000 })
  })
})
