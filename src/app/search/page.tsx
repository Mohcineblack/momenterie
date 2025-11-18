import { Metadata } from 'next';
import { prisma } from '@/lib/prisma';
import { ProductGrid } from '@/components/product/product-grid';
import { SearchBar } from '@/components/shared/search-bar';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Search Products - Momenterie',
  description: 'Search for personalized gifts and custom products',
};

interface PageProps {
  searchParams: {
    q?: string;
  };
}

export default async function SearchPage({ searchParams }: PageProps) {
  const query = searchParams.q || '';

  let products: any[] = [];
  let categories: any[] = [];

  if (query) {
    // Search products
    const searchResults = await prisma.product.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { description: { contains: query, mode: 'insensitive' } },
        ],
      },
      take: 24,
      include: {
        category: true,
        _count: {
          select: { reviews: true },
        },
      },
      orderBy: {
        bestseller: 'desc',
      },
    });

    // Calculate ratings
    products = await Promise.all(
      searchResults.map(async (product) => {
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

    // Search categories
    categories = await prisma.category.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { description: { contains: query, mode: 'insensitive' } },
        ],
      },
      take: 5,
    });
  }

  const totalResults = products.length + categories.length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-12">
          <h1 className="text-4xl font-bold mb-6">Search</h1>
          <div className="max-w-2xl">
            <SearchBar initialQuery={query} />
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="container mx-auto px-4 py-8">
        {!query ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🔍</div>
            <h2 className="text-2xl font-semibold mb-2">Start searching</h2>
            <p className="text-gray-600">Enter a keyword to find products</p>
          </div>
        ) : totalResults === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">😔</div>
            <h2 className="text-2xl font-semibold mb-2">No results found</h2>
            <p className="text-gray-600 mb-6">
              We couldn't find anything matching "{query}"
            </p>
            <Link
              href="/collections/all"
              className="inline-block px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
            >
              Browse All Products
            </Link>
          </div>
        ) : (
          <>
            {/* Results Summary */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-2">
                Search results for "{query}"
              </h2>
              <p className="text-gray-600">
                Found {totalResults} {totalResults === 1 ? 'result' : 'results'}
              </p>
            </div>

            {/* Category Results */}
            {categories.length > 0 && (
              <div className="mb-12">
                <h3 className="text-xl font-semibold mb-4">Categories</h3>
                <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                  {categories.map((category) => (
                    <Link
                      key={category.id}
                      href={`/collections/${category.slug}`}
                      className="p-6 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow text-center"
                    >
                      <h4 className="font-semibold mb-1">{category.name}</h4>
                      {category.description && (
                        <p className="text-sm text-gray-600 line-clamp-2">
                          {category.description}
                        </p>
                      )}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Product Results */}
            {products.length > 0 && (
              <div>
                <h3 className="text-xl font-semibold mb-4">Products</h3>
                <ProductGrid products={products} />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
