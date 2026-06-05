import { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import Image from "next/image";
import { formatPrice } from "@/lib/utils";
import { Star } from "lucide-react";

interface PageProps {
  params: Promise<{ category: string }>;
  searchParams: Promise<{
    page?: string;
    sortBy?: string;
    minPrice?: string;
    maxPrice?: string;
  }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { category: categorySlug } = await params;
  const category = await prisma.category.findUnique({ where: { slug: categorySlug } });
  if (!category) return { title: "Not Found" };
  return {
    title: `${category.name} \u2014 Momenterie`,
    description: category.description || `Shop ${category.name} at Momenterie`,
  };
}

export default async function CollectionPage({ params, searchParams }: PageProps) {
  const { category: categorySlug } = await params;
  const search = await searchParams;

  const category = await prisma.category.findUnique({ where: { slug: categorySlug } });
  if (!category) notFound();

  const page = parseInt(search.page || "1", 10);
  const sortBy = search.sortBy || "newest";
  const minPrice = search.minPrice ? parseFloat(search.minPrice) : undefined;
  const maxPrice = search.maxPrice ? parseFloat(search.maxPrice) : undefined;
  const perPage = 12;

  const where: any = { categoryId: category.id };
  if (minPrice !== undefined || maxPrice !== undefined) {
    where.basePrice = {};
    if (minPrice !== undefined) where.basePrice.gte = minPrice;
    if (maxPrice !== undefined) where.basePrice.lte = maxPrice;
  }

  let orderBy: any = { createdAt: "desc" };
  switch (sortBy) {
    case "price-asc": orderBy = { basePrice: "asc" }; break;
    case "price-desc": orderBy = { basePrice: "desc" }; break;
    case "name-asc": orderBy = { name: "asc" }; break;
    case "popular": orderBy = { bestseller: "desc" }; break;
  }

  const [products, totalCount] = await Promise.all([
    prisma.product.findMany({
      where,
      orderBy,
      skip: (page - 1) * perPage,
      take: perPage,
      include: { category: true, _count: { select: { reviews: true } } },
    }),
    prisma.product.count({ where }),
  ]);

  const productsWithRatings = await Promise.all(
    products.map(async (product) => {
      const reviews = await prisma.review.findMany({
        where: { productId: product.id },
        select: { rating: true },
      });
      const avg = reviews.length > 0 ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length : 0;
      return { ...product, averageRating: Math.round(avg * 10) / 10, reviewCount: reviews.length };
    })
  );

  const totalPages = Math.ceil(totalCount / perPage);
  const basePath = `/collections/${categorySlug}`;

  function sortUrl(sort: string) {
    const p = new URLSearchParams();
    p.set("sortBy", sort);
    if (minPrice !== undefined) p.set("minPrice", String(minPrice));
    if (maxPrice !== undefined) p.set("maxPrice", String(maxPrice));
    return `${basePath}?${p.toString()}`;
  }

  return (
    <div className="w-full px-6 md:px-[48px] py-12 md:py-24 max-w-[1280px] mx-auto">
      {/* Header */}
      <div className="text-center mb-16">
        <h1 className="font-serif text-4xl md:text-5xl font-light italic text-primary tracking-tight mb-4">{category.name}</h1>
        {category.description && (
          <p className="font-serif italic text-base text-on-surface-variant max-w-xl mx-auto">{category.description}</p>
        )}
      </div>

      {/* Toolbar */}
      <div className="flex items-center justify-between border-b border-outline-variant pb-4 mb-12">
        <span className="font-sans text-sm text-on-surface-variant">{totalCount} {totalCount === 1 ? "Product" : "Products"}</span>
        <div className="flex items-center gap-6">
          {[
            { key: "newest", label: "Newest" },
            { key: "popular", label: "Popular" },
            { key: "price-asc", label: "Price \u2191" },
            { key: "price-desc", label: "Price \u2193" },
          ].map((opt) => (
            <Link
              key={opt.key}
              href={sortUrl(opt.key)}
              className={`font-sans text-[11px] uppercase tracking-[0.15em] font-medium transition-colors ${
                sortBy === opt.key ? "text-primary" : "text-on-surface-variant hover:text-primary"
              }`}
            >
              {opt.label}
            </Link>
          ))}
        </div>
      </div>

      {/* Product Grid */}
      {productsWithRatings.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 md:gap-12">
          {productsWithRatings.map((product) => (
            <Link key={product.id} href={`/products/${product.slug}`} className="group flex flex-col items-center">
              <div className="aspect-[4/5] w-full bg-surface-container overflow-hidden relative mb-6 border border-outline-variant p-2 flex flex-col">
                <div className="flex-1 bg-surface-dim overflow-hidden relative">
                  {product.images[0] && (
                    <Image
                      src={product.images[0]}
                      alt={product.name}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                      className="object-cover object-center group-hover:scale-[1.02] transition-transform duration-700 ease-out"
                    />
                  )}
                  {product.featured && (
                    <div className="absolute top-4 left-4 bg-surface/90 backdrop-blur px-3 py-1 font-sans text-[10px] font-bold uppercase tracking-wider text-primary border border-outline-variant">
                      Featured
                    </div>
                  )}
                </div>
              </div>
              <div className="text-center px-4 w-full flex flex-col items-center">
                <h3 className="font-sans text-[10px] uppercase tracking-wider font-bold text-primary mb-1 line-clamp-1 group-hover:text-secondary transition-colors">{product.name}</h3>
                {product.reviewCount > 0 && (
                  <div className="flex items-center gap-1 mb-1 text-primary">
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <span className="font-sans text-xs font-semibold">{product.averageRating}</span>
                  </div>
                )}
                <span className="font-serif italic text-xs text-on-surface-variant">From {formatPrice(product.basePrice)}</span>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-24">
          <p className="font-serif italic text-lg text-on-surface-variant">No products found in this collection.</p>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-4 mt-16 pt-8 border-t border-outline-variant">
          {page > 1 && (
            <Link
              href={`${basePath}?page=${page - 1}&sortBy=${sortBy}`}
              className="font-sans text-[11px] uppercase tracking-[0.15em] font-semibold text-primary hover:text-secondary transition-colors"
            >
              &larr; Previous
            </Link>
          )}
          <span className="font-sans text-xs text-on-surface-variant">
            Page {page} of {totalPages}
          </span>
          {page < totalPages && (
            <Link
              href={`${basePath}?page=${page + 1}&sortBy=${sortBy}`}
              className="font-sans text-[11px] uppercase tracking-[0.15em] font-semibold text-primary hover:text-secondary transition-colors"
            >
              Next &rarr;
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
