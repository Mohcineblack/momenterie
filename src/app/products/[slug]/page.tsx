import { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { ProductReviews } from "@/components/product/product-reviews";
import { WriteReview } from "@/components/product/write-review";
import { formatPrice } from "@/lib/utils";
import { getEditorRoute } from "@/lib/editor-routes";
import { Star, ShieldCheck, Truck } from "lucide-react";
import { FREE_SHIPPING_THRESHOLD_CENTS } from "@/lib/shipping-config";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await prisma.product.findUnique({ where: { slug } });
  if (!product) return { title: "Product Not Found" };
  return {
    title: `${product.name} \u2014 Momenterie`,
    description: product.description,
    openGraph: { title: product.name, description: product.description, images: product.images },
  };
}

export default async function ProductPage({ params }: PageProps) {
  const session = await auth();
  const { slug } = await params;

  const product = await prisma.product.findUnique({
    where: { slug },
    include: {
      category: true,
      variants: { orderBy: { priceModifier: "asc" } },
      reviews: {
        include: { user: { select: { id: true, name: true, image: true } } },
        orderBy: { createdAt: "desc" },
        take: 10,
      },
    },
  });

  if (!product) notFound();

  const reviews = await prisma.review.findMany({
    where: { productId: product.id },
    select: { rating: true },
  });

  const averageRating = reviews.length > 0
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    : 0;

  let hasPurchased = false;
  let hasReviewed = false;
  if (session?.user) {
    hasPurchased = !!(await prisma.orderItem.findFirst({
      where: { productId: product.id, order: { userId: session.user.id, paymentStatus: "PAID" } },
    }));
    hasReviewed = !!(await prisma.review.findFirst({
      where: { productId: product.id, userId: session.user.id },
    }));
  }

  const editorRoute = getEditorRoute(product.category.slug, product.slug);

  return (
    <div className="max-w-[1280px] mx-auto px-6 md:px-[48px] py-12 md:py-24">
      {/* JSON-LD */}
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-24">
        {/* Left: Gallery */}
        <div className="flex flex-col gap-4">
          <div className="aspect-[4/5] bg-surface-container relative overflow-hidden border border-outline-variant p-2">
            {product.images[0] && (
              <Image
                src={product.images[0]}
                alt={product.name}
                fill
                className="object-cover object-center"
                priority
              />
            )}
          </div>
          {product.images.length > 1 && (
            <div className="grid grid-cols-4 gap-4">
              {product.images.slice(1, 5).map((img, idx) => (
                <div key={idx} className="aspect-square bg-surface-container relative overflow-hidden border border-outline-variant">
                  <Image src={img} alt={`${product.name} ${idx + 2}`} fill className="object-cover" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right: Info */}
        <div className="flex flex-col">
          <div className="sticky top-32">
            <div className="mb-8">
              <Link href={`/collections/${product.category.slug}`} className="font-sans text-[10px] font-semibold uppercase tracking-wider text-secondary mb-4 block hover:text-primary transition-colors">
                {product.category.name}
              </Link>
              <h1 className="font-serif text-4xl lg:text-5xl font-medium text-primary mb-4 tracking-tight">{product.name}</h1>

              <div className="flex items-center gap-4 mb-4">
                <span className="font-sans text-xl text-primary font-medium">{formatPrice(product.basePrice)}</span>
                {reviews.length > 0 && (
                  <div className="flex items-center gap-1 text-primary">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`w-4 h-4 ${i < Math.round(averageRating) ? 'fill-current' : 'fill-transparent stroke-current opacity-30'}`} />
                      ))}
                    </div>
                    <span className="font-sans text-xs text-on-surface-variant font-medium ml-2">({reviews.length} reviews)</span>
                  </div>
                )}
              </div>
              <p className="font-sans text-base text-on-surface-variant leading-relaxed mb-8">{product.description}</p>
            </div>

            {/* CTA */}
            <div className="space-y-6 mb-10">
              <div className="bg-surface-container-low p-6 border border-outline-variant">
                <h3 className="font-serif text-lg font-medium text-primary mb-2">Personalization Required</h3>
                <p className="font-sans text-sm text-on-surface-variant mb-6">This item is custom-made. Launch the studio editor to preview your design.</p>

                {editorRoute ? (
                  <Link
                    href={editorRoute}
                    className="flex items-center justify-center w-full bg-primary text-on-primary py-4 font-sans text-xs uppercase tracking-[0.1em] font-semibold hover:bg-secondary transition-colors duration-200"
                  >
                    Customize Yours
                  </Link>
                ) : (
                  <div className="text-center py-4 text-on-surface-variant font-sans text-sm">
                    Customizer coming soon
                  </div>
                )}
              </div>
            </div>

            {/* Trust badges */}
            <div className="space-y-4 pt-8 border-t border-outline-variant">
              <div className="flex items-start gap-4">
                <ShieldCheck className="w-5 h-5 text-secondary flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-sans text-sm font-semibold text-primary">Museum-Grade Quality</h4>
                  <p className="font-sans text-xs text-on-surface-variant mt-1">Archival inks and heavyweight paper designed to last generations.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Truck className="w-5 h-5 text-secondary flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-sans text-sm font-semibold text-primary">Free Shipping</h4>
                  <p className="font-sans text-xs text-on-surface-variant mt-1">Tracked delivery on all orders over {formatPrice(FREE_SHIPPING_THRESHOLD_CENTS)}.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews */}
      {session?.user && (
        <div className="mt-24">
          <WriteReview productId={product.id} productName={product.name} hasPurchased={hasPurchased} hasReviewed={hasReviewed} />
        </div>
      )}
      {reviews.length > 0 && (
        <div className="mt-24">
          <ProductReviews reviews={product.reviews} averageRating={averageRating} totalReviews={reviews.length} />
        </div>
      )}
    </div>
  );
}
