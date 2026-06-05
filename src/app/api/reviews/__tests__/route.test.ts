import { POST } from '../route'
import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'

// Mock dependencies
jest.mock('@/lib/prisma')
jest.mock('@/lib/auth')

describe('POST /api/reviews', () => {
  const mockSession = {
    user: {
      id: 'user-1',
      email: 'test@example.com',
      name: 'Test User',
    },
  }

  beforeEach(() => {
    jest.clearAllMocks()
    ;(prisma.product.findUnique as jest.Mock).mockResolvedValue({
      id: 1,
      name: 'Test Product',
    })
  })

  it('creates a review successfully', async () => {
    (auth as jest.Mock).mockResolvedValue(mockSession)
    ;(prisma.orderItem.findFirst as jest.Mock).mockResolvedValue({
      id: 'item-1',
      productId: 1,
    })
    ;(prisma.review.findFirst as jest.Mock).mockResolvedValue(null)
    ;(prisma.review.create as jest.Mock).mockResolvedValue({
      id: 1,
      productId: 1,
      userId: 'user-1',
      rating: 5,
      title: 'Great product!',
      comment: 'Love it a lot!',
    })

    const request = new NextRequest('http://localhost:3000/api/reviews', {
      method: 'POST',
      body: JSON.stringify({
        productId: 1,
        rating: 5,
        title: 'Great product!',
        comment: 'Love it a lot!',
      }),
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.success).toBe(true)
    expect(data.data.rating).toBe(5)
  })

  it('returns 401 if user is not logged in', async () => {
    (auth as jest.Mock).mockResolvedValue(null)

    const request = new NextRequest('http://localhost:3000/api/reviews', {
      method: 'POST',
      body: JSON.stringify({
        productId: 1,
        rating: 5,
        title: 'Great',
        comment: 'Good product',
      }),
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(401)
    expect(data.error).toBeDefined()
  })

  it('returns 403 if user has not purchased the product', async () => {
    (auth as jest.Mock).mockResolvedValue(mockSession)
    ;(prisma.orderItem.findFirst as jest.Mock).mockResolvedValue(null)

    const request = new NextRequest('http://localhost:3000/api/reviews', {
      method: 'POST',
      body: JSON.stringify({
        productId: 1,
        rating: 5,
        title: 'Great',
        comment: 'Good product',
      }),
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(403)
    expect(data.error).toContain('purchased')
  })

  it('returns 400 if review already exists', async () => {
    (auth as jest.Mock).mockResolvedValue(mockSession)
    ;(prisma.orderItem.findFirst as jest.Mock).mockResolvedValue({
      id: 'item-1',
    })
    ;(prisma.review.findFirst as jest.Mock).mockResolvedValue({
      id: 1,
      userId: 'user-1',
      productId: 1,
    })

    const request = new NextRequest('http://localhost:3000/api/reviews', {
      method: 'POST',
      body: JSON.stringify({
        productId: 1,
        rating: 5,
        title: 'Great',
        comment: 'Good product',
      }),
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data.error).toContain('already reviewed')
  })

  it('validates rating is between 1 and 5', async () => {
    (auth as jest.Mock).mockResolvedValue(mockSession)

    const request = new NextRequest('http://localhost:3000/api/reviews', {
      method: 'POST',
      body: JSON.stringify({
        productId: 1,
        rating: 6,
        title: 'Great',
        comment: 'Good product',
      }),
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data.error).toBeDefined()
  })

  it('validates required fields', async () => {
    (auth as jest.Mock).mockResolvedValue(mockSession)

    const request = new NextRequest('http://localhost:3000/api/reviews', {
      method: 'POST',
      body: JSON.stringify({
        productId: 1,
        // missing rating, title, comment
      }),
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data.error).toBeDefined()
  })
})
