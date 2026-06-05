import { prisma } from '@/lib/prisma';
import { Star } from 'lucide-react';

export async function ReviewsCarousel() {
  const reviews = await prisma.review.findMany({
    where: { verified: true },
    orderBy: { createdAt: 'desc' },
    take: 8,
    include: {
      user: { select: { name: true } },
      product: { select: { name: true } },
    },
  });

  if (reviews.length === 0) return null;

  const avgRating = reviews.reduce((s, r) => s + r.rating, 0) / reviews.length;

  return (
    <section className="py-[96px] px-6 md:px-[48px] bg-surface">
      <div className="max-w-[1280px] mx-auto">
        <div className="text-center mb-16">
          <h2 className="font-serif italic text-4xl text-primary mb-4">What Our Clients Say</h2>
          <div className="flex items-center justify-center gap-3">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className={`w-4 h-4 ${i < Math.round(avgRating) ? 'fill-current text-primary' : 'text-surface-container-high'}`} />
              ))}
            </div>
            <span className="font-sans text-xs text-on-surface-variant uppercase tracking-wider">
              {avgRating.toFixed(1)} / 5 &mdash; {reviews.length} verified reviews
            </span>
          </div>
          <div className="w-12 h-[1px] bg-primary/30 mx-auto mt-6" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {reviews.slice(0, 4).map((review) => (
            <div key={review.id} className="bg-surface-container-lowest border border-outline-variant p-6 flex flex-col">
              <div className="flex mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`w-3.5 h-3.5 ${i < review.rating ? 'fill-current text-primary' : 'text-surface-container-high'}`} />
                ))}
              </div>
              {review.title && (
                <p className="font-sans text-sm font-semibold text-primary mb-1">{review.title}</p>
              )}
              <p className="font-serif italic text-sm text-on-surface-variant line-clamp-4 mb-4 flex-1">{review.comment}</p>
              <div className="flex items-center justify-between text-[10px] uppercase tracking-wider font-semibold text-on-surface-variant pt-4 border-t border-outline-variant">
                <span>{review.user.name || 'Client'}</span>
                <span>{review.product.name}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
