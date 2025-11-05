import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

/**
 * GET /api/products/[slug]
 * Get a single product by slug with all related data
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;

    if (!slug) {
      return NextResponse.json(
        {
          success: false,
          error: 'Product slug is required',
        },
        { status: 400 }
      );
    }

    // Fetch product with all relations
    const product = await prisma.product.findUnique({
      where: { slug },
      include: {
        category: true,
        variants: {
          orderBy: { priceModifier: 'asc' },
        },
        customizationFields: {
          orderBy: { id: 'asc' },
        },
        reviews: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                image: true,
              },
            },
          },
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
        _count: {
          select: { reviews: true },
        },
      },
    });

    if (!product) {
      return NextResponse.json(
        {
          success: false,
          error: 'Product not found',
        },
        { status: 404 }
      );
    }

    // Calculate average rating
    const reviews = await prisma.review.findMany({
      where: { productId: product.id },
      select: { rating: true },
    });

    const averageRating =
      reviews.length > 0
        ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
        : 0;

    // Get related products from the same category
    const relatedProducts = await prisma.product.findMany({
      where: {
        categoryId: product.categoryId,
        id: { not: product.id },
      },
      take: 4,
      include: {
        category: true,
        _count: {
          select: { reviews: true },
        },
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        ...product,
        averageRating: Math.round(averageRating * 10) / 10,
        reviewCount: reviews.length,
        relatedProducts,
      },
    });
  } catch (error) {
    console.error('Error fetching product:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch product',
      },
      { status: 500 }
    );
  }
}
