import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { ProductImageGallery } from "@/components/product/product-image-gallery";
import { VariantSelector } from "@/components/product/variant-selector";
import { ProductReviews } from "@/components/product/product-reviews";
import { RelatedProducts } from "@/components/product/related-products";
import { WriteReview } from "@/components/product/write-review";
import { Breadcrumb } from "@/components/shared/breadcrumb";
import { formatPrice } from "@/lib/utils";
import { getEditorRoute } from "@/lib/editor-routes";
import { Star, Shield, Truck, ArrowRight } from "lucide-react";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await prisma.product.findUnique({
    where: { slug },
  });

  if (!product) {
    return {
      title: "Product Not Found",
    };
  }

  return {
    title: `${product.name} - Momenterie`,
    description: product.description,
    openGraph: {
      title: product.name,
      description: product.description,
      images: product.images,
    },
  };
}

export default async function ProductPage({ params }: PageProps) {
  const session = await auth();
  const { slug } = await params;

  // Fetch product with all relations
  const product = await prisma.product.findUnique({
    where: { slug },
    include: {
      category: true,
      variants: {
        orderBy: { priceModifier: "asc" },
      },
      customizationFields: {
        orderBy: { id: "asc" },
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
        orderBy: { createdAt: "desc" },
        take: 10,
      },
    },
  });

  if (!product) {
    notFound();
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

  // Check if user has purchased this product
  let hasPurchased = false;
  let hasReviewed = false;
  if (session?.user) {
    hasPurchased = !!(await prisma.orderItem.findFirst({
      where: {
          productId: product.id,
          order: {
            userId: session.user.id,
            paymentStatus: "PAID",
          },
        },
      }));

    hasReviewed = !!(await prisma.review.findFirst({
      where: {
        productId: product.id,
        userId: session.user.id,
      },
    }));
  }

  // Get related products
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

  const breadcrumbItems = [
    { label: "Home", href: "/" },
    {
      label: product.category.name,
      href: `/collections/${product.category.slug}`,
    },
    { label: product.name, href: `/products/${product.slug}` },
  ];
  const editorRoute = getEditorRoute(product.category.slug, product.slug);

  return (
    <div className="min-h-screen bg-white">
      {/* JSON-LD AggregateRating */}
      {reviews.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Product",
              name: product.name,
              description: product.description,
              image: product.images[0],
              aggregateRating: {
                "@type": "AggregateRating",
                ratingValue: averageRating.toFixed(1),
                reviewCount: reviews.length,
                bestRating: "5",
                worstRating: "1",
              },
            }),
          }}
        />
      )}

      {/* Breadcrumb */}
      <div className="container mx-auto px-4 py-4">
        <Breadcrumb items={breadcrumbItems} />
      </div>

      {/* Product Details */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-2 gap-12">
          {/* Image Gallery */}
          <div>
            <ProductImageGallery
              images={product.images}
              productName={product.name}
            />
          </div>

          {/* Product Info */}
          <div>
            {/* Category Badge */}
            <Link
              href={`/collections/${product.category.slug}`}
              className="inline-block text-sm text-gray-600 hover:text-gray-900 mb-3"
            >
              {product.category.name}
            </Link>

            {/* Product Name */}
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              {product.name}
            </h1>

            {/* Rating */}
            {reviews.length > 0 && (
              <div className="flex items-center gap-3 mb-6">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < Math.round(averageRating)
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-gray-600">
                  {averageRating.toFixed(1)} ({reviews.length} reviews)
                </span>
              </div>
            )}

            {/* Price */}
            <div className="mb-6">
              <span className="text-sm text-gray-600 block mb-1">
                Starting at
              </span>
              <span className="text-4xl font-bold text-gray-900">
                {formatPrice(product.basePrice)}
              </span>
            </div>

            {/* Description */}
            <p className="text-lg text-gray-700 leading-relaxed mb-8">
              {product.description}
            </p>

            {/* Variants */}
            {product.variants.length > 0 && (
              <div className="mb-8">
                <VariantSelector
                  variants={product.variants}
                  basePrice={product.basePrice}
                />
              </div>
            )}

            {/* CTA Button */}
            {editorRoute ? (
              <Link
                href={editorRoute}
                role="button"
                className="w-full flex items-center justify-center gap-2 px-8 py-4 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors font-medium text-lg mb-8"
              >
                Start Customizing
                <ArrowRight className="w-5 h-5" />
              </Link>
            ) : (
              <div className="mb-8 rounded-lg border border-amber-200 bg-amber-50 px-6 py-4 text-amber-900">
                Customizer coming soon for this product.
              </div>
            )}

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-4 py-8 border-t border-b">
              <div className="text-center">
                <Shield className="w-8 h-8 mx-auto mb-2 text-green-600" />
                <div className="text-xs font-medium">100% Satisfaction</div>
              </div>
              <div className="text-center">
                <Truck className="w-8 h-8 mx-auto mb-2 text-blue-600" />
                <div className="text-xs font-medium">Free Shipping €50+</div>
              </div>
              <div className="text-center">
                <Star className="w-8 h-8 mx-auto mb-2 text-yellow-600" />
                <div className="text-xs font-medium">Premium Quality</div>
              </div>
            </div>

            {/* Customization Fields Info */}
            {product.customizationFields.length > 0 && (
              <div className="mt-8 bg-blue-50 p-6 rounded-lg">
                <h3 className="font-semibold mb-3 text-gray-900">
                  What you can customize:
                </h3>
                <ul className="space-y-2">
                  {product.customizationFields.map((field) => (
                    <li
                      key={field.id}
                      className="flex items-start gap-2 text-sm text-gray-700"
                    >
                      <span className="text-blue-600">✓</span>
                      <span>{field.label}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Write Review Section */}
        {session?.user && (
          <div className="mt-20">
            <WriteReview
              productId={product.id}
              productName={product.name}
              hasPurchased={hasPurchased}
              hasReviewed={hasReviewed}
            />
          </div>
        )}

        {/* Reviews Section */}
        {reviews.length > 0 && (
          <div className="mt-20">
            <ProductReviews
              reviews={product.reviews}
              averageRating={averageRating}
              totalReviews={reviews.length}
            />
          </div>
        )}

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-20">
            <RelatedProducts products={relatedProducts} />
          </div>
        )}
      </div>
    </div>
  );
}
