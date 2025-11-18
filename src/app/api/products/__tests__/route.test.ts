import { GET } from '../route'
import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'

// Mock Prisma
jest.mock('@/lib/prisma', () => ({
  prisma: {
    product: {
      findMany: jest.fn(),
    },
  },
}))

describe('GET /api/products', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('returns all products', async () => {
    const mockProducts = [
      {
        id: 1,
        name: 'Product 1',
        slug: 'product-1',
        basePrice: 29.99,
        categoryId: 1,
        images: ['/image1.jpg'],
      },
      {
        id: 2,
        name: 'Product 2',
        slug: 'product-2',
        basePrice: 39.99,
        categoryId: 1,
        images: ['/image2.jpg'],
      },
    ]

    ;(prisma.product.findMany as jest.Mock).mockResolvedValue(mockProducts)

    const request = new NextRequest('http://localhost:3000/api/products')
    const response = await GET(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.success).toBe(true)
    expect(data.data).toEqual(mockProducts)
    expect(data.data).toHaveLength(2)
  })

  it('filters products by category', async () => {
    const mockProducts = [
      {
        id: 1,
        name: 'Product 1',
        slug: 'product-1',
        categoryId: 1,
      },
    ]

    ;(prisma.product.findMany as jest.Mock).mockResolvedValue(mockProducts)

    const request = new NextRequest(
      'http://localhost:3000/api/products?category=city-maps'
    )
    const response = await GET(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.success).toBe(true)
    expect(prisma.product.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          category: { slug: 'city-maps' },
        }),
      })
    )
  })

  it('filters featured products', async () => {
    const mockProducts = [
      {
        id: 1,
        name: 'Featured Product',
        slug: 'featured-product',
        featured: true,
      },
    ]

    ;(prisma.product.findMany as jest.Mock).mockResolvedValue(mockProducts)

    const request = new NextRequest(
      'http://localhost:3000/api/products?featured=true'
    )
    const response = await GET(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.success).toBe(true)
    expect(prisma.product.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          featured: true,
        }),
      })
    )
  })

  it('handles database errors gracefully', async () => {
    ;(prisma.product.findMany as jest.Mock).mockRejectedValue(
      new Error('Database error')
    )

    const request = new NextRequest('http://localhost:3000/api/products')
    const response = await GET(request)
    const data = await response.json()

    expect(response.status).toBe(500)
    expect(data.success).toBe(false)
    expect(data.error).toBeDefined()
  })

  it('returns empty array when no products exist', async () => {
    ;(prisma.product.findMany as jest.Mock).mockResolvedValue([])

    const request = new NextRequest('http://localhost:3000/api/products')
    const response = await GET(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.success).toBe(true)
    expect(data.data).toEqual([])
  })
})
