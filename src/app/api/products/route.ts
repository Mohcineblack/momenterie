import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { productQuerySchema } from '@/lib/validators/product';
import { Prisma } from '@prisma/client';

/**
 * GET /api/products
 * List products with filtering, pagination, and sorting
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;

    // Parse and validate query parameters
    const queryParams = {
      page: searchParams.get('page') || '1',
      pageSize: searchParams.get('pageSize') || '12',
      category: searchParams.get('category') || undefined,
      search: searchParams.get('search') || undefined,
      minPrice: searchParams.get('minPrice') || undefined,
      maxPrice: searchParams.get('maxPrice') || undefined,
      featured: searchParams.get('featured') || undefined,
      bestseller: searchParams.get('bestseller') || undefined,
      sortBy: searchParams.get('sortBy') || 'newest',
    };

    const validatedParams = productQuerySchema.parse(queryParams);

    // Build where clause
    const where: Prisma.ProductWhereInput = {};

    // Category filter
    if (validatedParams.category) {
      where.category = {
        slug: validatedParams.category,
      };
    }

    // Search filter
    if (validatedParams.search) {
      where.OR = [
        { name: { contains: validatedParams.search, mode: 'insensitive' } },
        { description: { contains: validatedParams.search, mode: 'insensitive' } },
      ];
    }

    // Price filters
    if (validatedParams.minPrice !== undefined || validatedParams.maxPrice !== undefined) {
      where.basePrice = {};
      if (validatedParams.minPrice !== undefined) {
        where.basePrice.gte = validatedParams.minPrice;
      }
      if (validatedParams.maxPrice !== undefined) {
        where.basePrice.lte = validatedParams.maxPrice;
      }
    }

    // Featured/Bestseller filters
    if (validatedParams.featured !== undefined) {
      where.featured = validatedParams.featured;
    }
    if (validatedParams.bestseller !== undefined) {
      where.bestseller = validatedParams.bestseller;
    }

    // Build orderBy clause
    let orderBy: Prisma.ProductOrderByWithRelationInput = {};
    switch (validatedParams.sortBy) {
      case 'price-asc':
        orderBy = { basePrice: 'asc' };
        break;
      case 'price-desc':
        orderBy = { basePrice: 'desc' };
        break;
      case 'name-asc':
        orderBy = { name: 'asc' };
        break;
      case 'name-desc':
        orderBy = { name: 'desc' };
        break;
      case 'newest':
        orderBy = { createdAt: 'desc' };
        break;
      case 'popular':
        orderBy = { bestseller: 'desc' };
        break;
      default:
        orderBy = { createdAt: 'desc' };
    }

    // Calculate pagination
    const skip = (validatedParams.page - 1) * validatedParams.pageSize;
    const take = validatedParams.pageSize;

    // Fetch products and total count in parallel
    const [products, totalCount] = await Promise.all([
      prisma.product.findMany({
        where,
        orderBy,
        skip,
        take,
        include: {
          category: true,
          variants: {
            orderBy: { priceModifier: 'asc' },
            take: 5,
          },
          _count: {
            select: { reviews: true },
          },
        },
      }),
      prisma.product.count({ where }),
    ]);

    // Calculate average ratings for each product
    const productsWithRatings = await Promise.all(
      products.map(async (product) => {
        const reviews = await prisma.review.findMany({
          where: { productId: product.id },
          select: { rating: true },
        });

        const averageRating =
          reviews.length > 0
            ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
            : 0;

        return {
          ...product,
          averageRating: Math.round(averageRating * 10) / 10,
          reviewCount: reviews.length,
        };
      })
    );

    const totalPages = Math.ceil(totalCount / validatedParams.pageSize);

    return NextResponse.json({
      success: true,
      data: productsWithRatings,
      pagination: {
        page: validatedParams.page,
        pageSize: validatedParams.pageSize,
        total: totalCount,
        totalPages,
        hasMore: validatedParams.page < totalPages,
      },
    });
  } catch (error) {
    console.error('Error fetching products:', error);

    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid query parameters',
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch products',
      },
      { status: 500 }
    );
  }
}
