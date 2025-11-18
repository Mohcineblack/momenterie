import { Star } from 'lucide-react';

export function TestimonialsSection() {
  const testimonials = [
    {
      name: 'Sarah M.',
      location: 'Berlin, Germany',
      rating: 5,
      comment:
        'Absolutely beautiful! I ordered a city map of where my husband proposed, and it turned out stunning. The quality is exceptional and the customization process was so easy.',
      product: 'City Map',
    },
    {
      name: 'Michael K.',
      location: 'Vienna, Austria',
      rating: 5,
      comment:
        'Got a star map for our anniversary showing the night sky from our wedding day. My wife cried when she saw it. Thank you for creating such a meaningful gift!',
      product: 'Star Map',
    },
    {
      name: 'Emma L.',
      location: 'Paris, France',
      rating: 5,
      comment:
        'The photo puzzle was a huge hit at our family gathering! Great quality pieces and the image came out crystal clear. Will definitely order again.',
      product: 'Photo Puzzle',
    },
    {
      name: 'David R.',
      location: 'Munich, Germany',
      rating: 5,
      comment:
        'Amazing customer service and fast shipping. The song display looks even better in person. Perfect gift for any music lover!',
      product: 'Song Display',
    },
    {
      name: 'Lisa T.',
      location: 'Zurich, Switzerland',
      rating: 5,
      comment:
        'The star map necklace is gorgeous! Such a unique piece and the quality is outstanding. I get compliments every time I wear it.',
      product: 'Star Necklace',
    },
    {
      name: 'Thomas B.',
      location: 'Hamburg, Germany',
      rating: 5,
      comment:
        'Ordered multiple prints for Christmas gifts and everyone loved them. The personalization options are fantastic and the results are professional quality.',
      product: 'Custom Prints',
    },
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <div className="flex justify-center items-center gap-1 mb-4">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-8 h-8 fill-yellow-400 text-yellow-400" />
            ))}
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Loved by Thousands
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Don't just take our word for it - see what our customers have to say
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-4 h-4 fill-yellow-400 text-yellow-400"
                  />
                ))}
              </div>

              {/* Comment */}
              <p className="text-gray-700 mb-4 line-clamp-4">
                "{testimonial.comment}"
              </p>

              {/* Author */}
              <div className="border-t pt-4">
                <div className="font-semibold text-gray-900">
                  {testimonial.name}
                </div>
                <div className="text-sm text-gray-600">{testimonial.location}</div>
                <div className="text-xs text-gray-500 mt-1">
                  Purchased: {testimonial.product}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View All Reviews Link */}
        <div className="text-center mt-12">
          <a
            href="/reviews"
            className="inline-flex items-center text-gray-900 font-medium hover:underline"
          >
            Read all 10,000+ reviews
            <svg
              className="ml-2 h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}
