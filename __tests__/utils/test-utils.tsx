import React, { ReactElement } from 'react'
import { render, RenderOptions } from '@testing-library/react'

// Custom render function that wraps components with necessary providers
const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>,
) => {
  return render(ui, options)
}

export * from '@testing-library/react'
export { customRender as render }

// Helper to create mock products
export const createMockProduct = (overrides = {}) => ({
  id: 1,
  name: 'Test Product',
  slug: 'test-product',
  description: 'This is a test product',
  basePrice: 29.99,
  price: '29.99',
  categoryId: 1,
  images: ['/test-image.jpg'],
  featured: false,
  bestseller: false,
  variants: [
    {
      id: 1,
      productId: 1,
      name: 'Default Variant',
      sku: 'TEST-001',
      price: '29.99',
      priceModifier: 0,
      size: 'A4',
      material: 'Poster',
      stock: 100,
    },
  ],
  customizationFields: [],
  ...overrides,
})

// Helper to create mock cart items
export const createMockCartItem = (overrides = {}) => ({
  id: '1',
  productId: 1,
  productName: 'Test Product',
  productSlug: 'test-product',
  variantId: 1,
  variantName: 'Default Variant',
  quantity: 1,
  basePrice: 29.99,
  variantPrice: 0,
  customizationData: {},
  previewImageUrl: '/test-image.jpg',
  ...overrides,
})

// Helper to create mock orders
export const createMockOrder = (overrides = {}) => ({
  id: '1',
  userId: 'user-1',
  orderNumber: 'ORD-001',
  status: 'pending',
  subtotal: 29.99,
  shippingCost: 4.95,
  tax: 0,
  discount: 0,
  total: 34.94,
  shippingAddressId: '1',
  billingAddressId: '1',
  paymentStatus: 'unpaid',
  createdAt: new Date(),
  updatedAt: new Date(),
  items: [],
  ...overrides,
})

// Helper to create mock users
export const createMockUser = (overrides = {}) => ({
  id: 'user-1',
  name: 'Test User',
  email: 'test@example.com',
  emailVerified: null,
  image: null,
  password: 'hashed-password',
  role: 'customer',
  createdAt: new Date(),
  updatedAt: new Date(),
  ...overrides,
})

// Helper to wait for async operations
export const waitFor = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms))
