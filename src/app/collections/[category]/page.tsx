import { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import Image from "next/image";
import { formatPrice } from "@/lib/utils";
import { Star } from "lucide-react";

interface PageProps {
  params: Promise<{ category: string }>;
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

export default async function CollectionPage({ params }: PageProps) {
  const { category: categorySlug } = await params;
  const category = await prisma.category.findUnique({ where: { slug: categorySlug } });
  if (!category) notFound();

  const products = await prisma.product.findMany({
    where: { categoryId: category.id },
    include: { category: true, _count: { select: { reviews: true } } },
    orderBy: { featured: "desc" },
  });

  return (
    <div className="w-full px-6 md:px-[48px] py-12 md:py-24 max-w-[1280px] mx-auto">
      <div className="text-center mb-16">
        <h1 className="font-serif text-4xl md:text-5xl font-light italic text-primary tracking-tight mb-4">{category.name}</h1>
        {category.description && (
          <p className="font-serif italic text-base text-on-surface-variant max-w-xl mx-auto">{category.description}</p>
        )}
      </div>

      <div className="flex items-center justify-between border-b border-outline-variant pb-4 mb-12">
        <span className="font-sans text-sm text-on-surface-variant">{products.length} Products</span>
      </div>

      {products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 md:gap-12">
          {products.map((product) => (
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
                {product._count.reviews > 0 && (
                  <div className="flex items-center gap-1 mb-1 text-primary">
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <span className="font-sans text-xs font-semibold">{product._count.reviews}</span>
                  </div>
                )}
                <span className="font-serif italic text-xs text-on-surface-variant">From {formatPrice(product.basePrice)}</span>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-24">
          <p className="font-sans text-lg text-on-surface-variant">No products found in this collection.</p>
        </div>
      )}
    </div>
  );
}
