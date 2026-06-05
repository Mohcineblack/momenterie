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

  if (reviews.length === 0) {
    return null;
  }

  const avgRating = reviews.reduce((s, r) => s + r.rating, 0) / reviews.length;

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">
            Ce que nos clients disent
          </h2>
          <div className="flex items-center justify-center gap-2">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-5 h-5 ${i < Math.round(avgRating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                />
              ))}
            </div>
            <span className="text-gray-600">
              {avgRating.toFixed(1)} / 5 ({reviews.length} avis vérifiés)
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {reviews.slice(0, 4).map((review) => (
            <div key={review.id} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                  />
                ))}
              </div>
              {review.title && (
                <p className="font-semibold text-gray-900 mb-1">{review.title}</p>
              )}
              <p className="text-gray-600 text-sm line-clamp-4 mb-4">{review.comment}</p>
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span className="font-medium">{review.user.name || 'Client'}</span>
                <span>{review.product.name}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
