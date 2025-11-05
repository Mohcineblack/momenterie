import { Heart, Sparkles, Globe, Users } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="bg-gray-900 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-5xl font-bold mb-6">
              Turning Moments Into Memories
            </h1>
            <p className="text-xl text-gray-300 leading-relaxed">
              We believe every special moment deserves to be remembered. That's why we create
              beautiful, personalized products that capture your most meaningful experiences.
            </p>
          </div>
        </div>
      </div>

      {/* Story Section */}
      <div className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Our Story</h2>
            <div className="prose prose-lg max-w-none text-gray-700 space-y-6">
              <p>
                Momenterie was born from a simple idea: what if we could turn any moment in time
                into a beautiful piece of art? Whether it's the city where you fell in love, the
                night sky on your wedding day, or a cherished photo of your family, we wanted to
                create products that help you celebrate and remember life's most precious moments.
              </p>
              <p>
                Founded in 2024, we've helped thousands of people around the world create
                personalized gifts that tell their unique stories. From custom city maps that mark
                where your journey began, to astronomically accurate star maps showing the exact
                night sky of your special day, each product is crafted with care and attention to
                detail.
              </p>
              <p>
                What makes us different? We combine cutting-edge technology with traditional
                craftsmanship. Our star maps use real astronomical data. Our city maps are built on
                accurate geographical information. And every product is printed with premium
                materials that are built to last.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Values Section */}
      <div className="bg-gray-50 py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">Our Values</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            <div className="text-center">
              <div className="w-16 h-16 bg-gray-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Crafted with Love</h3>
              <p className="text-gray-600">
                Every product is made with care and attention to detail, because your memories
                deserve nothing less.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gray-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Premium Quality</h3>
              <p className="text-gray-600">
                We use only the finest materials and printing techniques to ensure your products
                last a lifetime.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gray-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <Globe className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Eco-Friendly</h3>
              <p className="text-gray-600">
                We're committed to sustainability, using eco-friendly materials and responsible
                production methods.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gray-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Customer First</h3>
              <p className="text-gray-600">
                Your satisfaction is our priority. We're here to help make your vision come to
                life.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Statistics Section */}
      <div className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto text-center">
            <div>
              <div className="text-5xl font-bold text-gray-900 mb-2">50K+</div>
              <p className="text-gray-600">Happy Customers</p>
            </div>
            <div>
              <div className="text-5xl font-bold text-gray-900 mb-2">100K+</div>
              <p className="text-gray-600">Products Created</p>
            </div>
            <div>
              <div className="text-5xl font-bold text-gray-900 mb-2">40+</div>
              <p className="text-gray-600">Countries Served</p>
            </div>
          </div>
        </div>
      </div>

      {/* Production Section */}
      <div className="bg-gray-900 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">Made in Germany</h2>
            <p className="text-lg text-gray-300 leading-relaxed mb-8">
              All our products are printed and assembled in Germany using state-of-the-art
              equipment and premium materials. We partner with local manufacturers who share our
              commitment to quality and sustainability.
            </p>
            <p className="text-gray-400">
              From design to delivery, every step is carefully managed to ensure you receive a
              product you'll treasure forever.
            </p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20">
        <div className="container mx-auto px-4">
          <div className="bg-gray-50 rounded-2xl p-12 text-center max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Ready to Create Your Moment?
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Start designing your personalized product today and turn your memories into beautiful
              art.
            </p>
            <a
              href="/collections/all"
              className="inline-flex items-center justify-center px-8 py-4 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors font-medium text-lg"
            >
              Browse Products
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
