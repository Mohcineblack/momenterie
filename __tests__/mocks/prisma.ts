import { PrismaClient } from '@prisma/client'
import { mockDeep, mockReset, DeepMockProxy } from 'jest-mock-extended'

// Create a deep mock of PrismaClient
export const prismaMock = mockDeep<PrismaClient>()

// Reset mocks before each test
beforeEach(() => {
  mockReset(prismaMock)
})

// Mock data generators
export const mockPrismaData = {
  user: {
    id: 'user-1',
    email: 'test@example.com',
    name: 'Test User',
    role: 'customer',
    emailVerified: null,
    image: null,
    password: 'hashed-password',
    createdAt: new Date(),
    updatedAt: new Date(),
  },

  product: {
    id: 1,
    name: 'Custom City Map',
    slug: 'custom-city-map',
    description: 'Beautiful custom city map',
    basePrice: 2999,
    categoryId: 1,
    images: ['/images/city-map.jpg'],
    featured: true,
    bestseller: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },

  order: {
    id: 'order-1',
    userId: 'user-1',
    orderNumber: 'ORD-00001',
    status: 'PENDING',
    subtotal: 2999,
    shippingCost: 495,
    tax: 0,
    discount: 0,
    total: 3494,
    shippingAddressId: 'addr-1',
    billingAddressId: 'addr-1',
    paymentIntentId: 'pi_test_123',
    paymentStatus: 'PAID',
    trackingNumber: null,
    notes: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  },

  review: {
    id: 1,
    productId: 1,
    userId: 'user-1',
    rating: 5,
    title: 'Great product!',
    comment: 'Love this custom map!',
    images: [],
    verified: true,
    helpful: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
  },

  newsletter: {
    id: 1,
    email: 'newsletter@example.com',
    createdAt: new Date(),
  },
}

export default prismaMock
