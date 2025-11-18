import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export function HeroSection() {
  return (
    <section className="relative bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
      <div className="container mx-auto px-4 py-20 md:py-32">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left Column - Text */}
          <div className="space-y-6">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 leading-tight">
              Preserve Your
              <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Special Moments
              </span>
            </h1>

            <p className="text-lg md:text-xl text-gray-600 leading-relaxed">
              Create beautiful, personalized gifts with our custom city maps, star maps,
              photo puzzles, and more. Turn memories into art.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link
                href="/collections/all"
                className="inline-flex items-center justify-center px-8 py-4 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors font-medium group"
              >
                Start Creating
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link
                href="/about"
                className="inline-flex items-center justify-center px-8 py-4 border-2 border-gray-900 text-gray-900 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Learn More
              </Link>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap items-center gap-6 pt-8 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <div className="text-2xl">⭐</div>
                <div>
                  <div className="font-semibold text-gray-900">4.9/5</div>
                  <div className="text-xs">10,000+ Reviews</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="text-2xl">🚚</div>
                <div>
                  <div className="font-semibold text-gray-900">Free Shipping</div>
                  <div className="text-xs">Over €50</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="text-2xl">😊</div>
                <div>
                  <div className="font-semibold text-gray-900">100% Satisfaction</div>
                  <div className="text-xs">Guaranteed</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Featured Product Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-4">
              <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow">
                <div className="aspect-square bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg mb-4 flex items-center justify-center">
                  <span className="text-4xl">🗺️</span>
                </div>
                <h3 className="font-semibold">City Maps</h3>
                <p className="text-sm text-gray-600">Custom locations</p>
              </div>
              <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow">
                <div className="aspect-square bg-gradient-to-br from-purple-100 to-purple-200 rounded-lg mb-4 flex items-center justify-center">
                  <span className="text-4xl">🧩</span>
                </div>
                <h3 className="font-semibold">Photo Puzzles</h3>
                <p className="text-sm text-gray-600">Your memories</p>
              </div>
            </div>
            <div className="space-y-4 pt-8">
              <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow">
                <div className="aspect-square bg-gradient-to-br from-indigo-100 to-indigo-200 rounded-lg mb-4 flex items-center justify-center">
                  <span className="text-4xl">⭐</span>
                </div>
                <h3 className="font-semibold">Star Maps</h3>
                <p className="text-sm text-gray-600">Night sky prints</p>
              </div>
              <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow">
                <div className="aspect-square bg-gradient-to-br from-pink-100 to-pink-200 rounded-lg mb-4 flex items-center justify-center">
                  <span className="text-4xl">💎</span>
                </div>
                <h3 className="font-semibold">Jewelry</h3>
                <p className="text-sm text-gray-600">Personalized</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000" />
    </section>
  );
}
