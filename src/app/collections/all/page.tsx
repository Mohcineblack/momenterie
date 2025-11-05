import { Metadata } from "next";
import { Suspense } from "react";
import { prisma } from "@/lib/prisma";
import { ProductGrid } from "@/components/product/product-grid";
import { ProductFilters } from "@/components/product/product-filters";

export const metadata: Metadata = {
  title: "All Products - Momenterie",
  description:
    "Browse all personalized gifts and custom products at Momenterie",
};

interface PageProps {
  searchParams: {
    page?: string;
    sortBy?: string;
    minPrice?: string;
    maxPrice?: string;
    search?: string;
  };
}

export default async function AllProductsPage({ searchParams }: PageProps) {
  const page = parseInt(searchParams.page || "1", 10);
  const sortBy = searchParams.sortBy || "newest";
  const minPrice = searchParams.minPrice
    ? parseFloat(searchParams.minPrice)
    : undefined;
  const maxPrice = searchParams.maxPrice
    ? parseFloat(searchParams.maxPrice)
    : undefined;
  const search = searchParams.search;

  // Build where clause
  const where: any = {};

  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { description: { contains: search, mode: "insensitive" } },
    ];
  }

  if (minPrice !== undefined || maxPrice !== undefined) {
    where.basePrice = {};
    if (minPrice !== undefined) where.basePrice.gte = minPrice;
    if (maxPrice !== undefined) where.basePrice.lte = maxPrice;
  }

  // Build orderBy
  let orderBy: any = { createdAt: "desc" };
  switch (sortBy) {
    case "price-asc":
      orderBy = { basePrice: "asc" };
      break;
    case "price-desc":
      orderBy = { basePrice: "desc" };
      break;
    case "name-asc":
      orderBy = { name: "asc" };
      break;
    case "name-desc":
      orderBy = { name: "desc" };
      break;
    case "popular":
      orderBy = { bestseller: "desc" };
      break;
  }

  // Fetch products and categories
  const [products, totalCount, categories] = await Promise.all([
    prisma.product.findMany({
      where,
      orderBy,
      skip: (page - 1) * 12,
      take: 12,
      include: {
        category: true,
        _count: {
          select: { reviews: true },
        },
      },
    }),
    prisma.product.count({ where }),
    prisma.category.findMany({
      orderBy: { name: "asc" },
    }),
  ]);

  // Calculate ratings
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

  const totalPages = Math.ceil(totalCount / 12);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-12">
          <h1 className="text-4xl font-bold mb-2">All Products</h1>
          <p className="text-lg text-gray-600 max-w-3xl">
            Browse our complete collection of personalized gifts and custom
            products
          </p>
          <p className="mt-4 text-sm text-gray-600">
            {totalCount} {totalCount === 1 ? "product" : "products"}
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex gap-8">
          {/* Sidebar Filters */}
          <aside className="hidden lg:block w-64 shrink-0">
            <div className="sticky top-24">
              <Suspense fallback={<div>Loading filters...</div>}>
                <ProductFilters categories={categories} />
              </Suspense>
            </div>
          </aside>

          {/* Products Grid */}
          <div className="flex-1">
            {/* Mobile Filters */}
            <div className="lg:hidden mb-6">
              <Suspense fallback={<div>Loading filters...</div>}>
                <ProductFilters categories={categories} />
              </Suspense>
            </div>

            <ProductGrid products={productsWithRatings} />

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-12 flex justify-center gap-2">
                {page > 1 && (
                  <a
                    href={`?page=${page - 1}${sortBy !== "newest" ? `&sortBy=${sortBy}` : ""}`}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Previous
                  </a>
                )}

                {[...Array(totalPages)].map((_, i) => {
                  const pageNum = i + 1;
                  if (
                    pageNum === 1 ||
                    pageNum === 2 ||
                    pageNum === totalPages ||
                    pageNum === totalPages - 1 ||
                    Math.abs(pageNum - page) <= 1
                  ) {
                    return (
                      <a
                        key={pageNum}
                        href={`?page=${pageNum}${sortBy !== "newest" ? `&sortBy=${sortBy}` : ""}`}
                        className={`px-4 py-2 rounded-lg transition-colors ${
                          page === pageNum
                            ? "bg-gray-900 text-white"
                            : "border border-gray-300 hover:bg-gray-50"
                        }`}
                      >
                        {pageNum}
                      </a>
                    );
                  } else if (pageNum === page - 2 || pageNum === page + 2) {
                    return <span key={pageNum}>...</span>;
                  }
                  return null;
                })}

                {page < totalPages && (
                  <a
                    href={`?page=${page + 1}${sortBy !== "newest" ? `&sortBy=${sortBy}` : ""}`}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Next
                  </a>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
