import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { searchQuerySchema } from '@/lib/validators/product';

/**
 * GET /api/search
 * Search products by name or description
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('q');
    const limit = searchParams.get('limit') || '10';

    if (!query) {
      return NextResponse.json(
        {
          success: false,
          error: 'Search query is required',
        },
        { status: 400 }
      );
    }

    const validatedParams = searchQuerySchema.parse({ q: query, limit });

    // Search products
    const products = await prisma.product.findMany({
      where: {
        OR: [
          { name: { contains: validatedParams.q, mode: 'insensitive' } },
          { description: { contains: validatedParams.q, mode: 'insensitive' } },
        ],
      },
      take: validatedParams.limit,
      include: {
        category: {
          select: {
            name: true,
            slug: true,
          },
        },
        _count: {
          select: { reviews: true },
        },
      },
      orderBy: {
        bestseller: 'desc',
      },
    });

    // Also search categories
    const categories = await prisma.category.findMany({
      where: {
        OR: [
          { name: { contains: validatedParams.q, mode: 'insensitive' } },
          { description: { contains: validatedParams.q, mode: 'insensitive' } },
        ],
      },
      take: 3,
    });

    return NextResponse.json({
      success: true,
      data: {
        products,
        categories,
        query: validatedParams.q,
        totalResults: products.length + categories.length,
      },
    });
  } catch (error) {
    console.error('Error searching:', error);

    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid search parameters',
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: 'Search failed',
      },
      { status: 500 }
    );
  }
}
