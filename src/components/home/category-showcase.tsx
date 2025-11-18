import Link from 'next/link';

export function CategoryShowcase() {
  const categories = [
    {
      name: 'City Maps',
      description: 'Capture your favorite place',
      href: '/collections/city-maps',
      icon: '🗺️',
      gradient: 'from-blue-500 to-cyan-500',
    },
    {
      name: 'Star Maps',
      description: 'The night sky on your special date',
      href: '/collections/star-maps',
      icon: '⭐',
      gradient: 'from-indigo-500 to-purple-500',
    },
    {
      name: 'Photo Puzzles',
      description: 'Turn memories into fun',
      href: '/collections/puzzles',
      icon: '🧩',
      gradient: 'from-purple-500 to-pink-500',
    },
    {
      name: 'Song Displays',
      description: 'Your favorite song, visualized',
      href: '/collections/song-displays',
      icon: '🎵',
      gradient: 'from-green-500 to-emerald-500',
    },
    {
      name: 'Custom Jewelry',
      description: 'Wear your special moment',
      href: '/collections/jewelry',
      icon: '💎',
      gradient: 'from-pink-500 to-rose-500',
    },
    {
      name: 'Photo Prints',
      description: 'High-quality custom prints',
      href: '/collections/photo-prints',
      icon: '📸',
      gradient: 'from-orange-500 to-amber-500',
    },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Explore Our Collections
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Choose from our wide range of personalized products, each crafted
            with love and attention to detail
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <Link
              key={category.href}
              href={category.href}
              className="group relative overflow-hidden rounded-2xl bg-gray-50 p-8 hover:shadow-2xl transition-all duration-300 border border-gray-200"
            >
              {/* Gradient Background */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${category.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}
              />

              {/* Content */}
              <div className="relative">
                <div className="text-5xl mb-4 transform group-hover:scale-110 transition-transform duration-300">
                  {category.icon}
                </div>

                <h3 className="text-xl font-bold mb-2 group-hover:text-gray-900">
                  {category.name}
                </h3>

                <p className="text-gray-600 text-sm mb-4">
                  {category.description}
                </p>

                <div className="flex items-center text-sm font-medium text-gray-900 group-hover:translate-x-2 transition-transform">
                  Explore Collection
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
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
