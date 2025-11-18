import { Truck, Package, RefreshCw, Shield } from 'lucide-react';

export default function ShippingPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Shipping & Returns</h1>
          <p className="text-lg text-gray-600 mb-12">
            Everything you need to know about shipping, delivery, and returns
          </p>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
              <Truck className="w-10 h-10 text-gray-900 mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">Fast Shipping</h3>
              <p className="text-gray-600">
                Orders ship within 3-5 business days. Express options available.
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
              <Package className="w-10 h-10 text-gray-900 mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">Secure Packaging</h3>
              <p className="text-gray-600">
                All products are carefully packaged to ensure they arrive in perfect condition.
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
              <RefreshCw className="w-10 h-10 text-gray-900 mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">Easy Replacements</h3>
              <p className="text-gray-600">
                Damaged or defective products are replaced free of charge.
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
              <Shield className="w-10 h-10 text-gray-900 mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">Satisfaction Guarantee</h3>
              <p className="text-gray-600">
                We stand behind the quality of our products 100%.
              </p>
            </div>
          </div>

          <div className="prose prose-lg max-w-none">
            <section className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Shipping Information</h2>

              <h3 className="text-2xl font-semibold text-gray-900 mb-4">Processing Time</h3>
              <p className="text-gray-700 leading-relaxed mb-6">
                All products are made to order. Production typically takes:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
                <li>
                  <strong>Custom Maps & Prints:</strong> 3-5 business days
                </li>
                <li>
                  <strong>Puzzles:</strong> 5-7 business days
                </li>
                <li>
                  <strong>Framed Products:</strong> 7-10 business days
                </li>
              </ul>

              <h3 className="text-2xl font-semibold text-gray-900 mb-4">Shipping Rates</h3>
              <div className="bg-gray-50 rounded-lg p-6 border border-gray-200 mb-6">
                <h4 className="font-semibold text-gray-900 mb-3">Within Germany</h4>
                <ul className="space-y-2 text-gray-700 mb-4">
                  <li>Standard Shipping (3-5 days): €4.95</li>
                  <li>Express Shipping (1-2 days): €9.95</li>
                  <li>
                    <strong>FREE</strong> standard shipping on orders over €50
                  </li>
                </ul>

                <h4 className="font-semibold text-gray-900 mb-3 mt-6">European Union</h4>
                <ul className="space-y-2 text-gray-700 mb-4">
                  <li>Standard Shipping (5-8 days): €9.95</li>
                  <li>Express Shipping (3-5 days): €19.95</li>
                  <li>
                    <strong>FREE</strong> standard shipping on orders over €100
                  </li>
                </ul>

                <h4 className="font-semibold text-gray-900 mb-3 mt-6">International</h4>
                <ul className="space-y-2 text-gray-700">
                  <li>Standard Shipping (10-15 days): €19.95</li>
                  <li>Express Shipping (5-8 days): €39.95</li>
                  <li>Rates calculated at checkout based on destination</li>
                </ul>
              </div>

              <h3 className="text-2xl font-semibold text-gray-900 mb-4">Tracking Your Order</h3>
              <p className="text-gray-700 leading-relaxed mb-6">
                Once your order ships, you'll receive a shipping confirmation email with a tracking
                number. You can also track your order status from your account dashboard. Tracking
                information may take 24 hours to update after shipping.
              </p>

              <h3 className="text-2xl font-semibold text-gray-900 mb-4">Customs and Duties</h3>
              <p className="text-gray-700 leading-relaxed mb-6">
                For international orders outside the EU, you may be responsible for customs duties
                and import taxes charged by your country. These fees are not included in our
                shipping costs and are the buyer's responsibility.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Returns & Exchanges</h2>

              <h3 className="text-2xl font-semibold text-gray-900 mb-4">Return Policy</h3>
              <p className="text-gray-700 leading-relaxed mb-6">
                Since all our products are custom-made specifically for you, we cannot accept
                returns for change of mind. Please review your customization carefully before
                placing your order.
              </p>

              <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                Damaged or Defective Products
              </h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                We take great care in producing and packaging your order. However, if your product
                arrives damaged or has a manufacturing defect:
              </p>
              <ol className="list-decimal list-inside space-y-2 text-gray-700 mb-6">
                <li>Contact us within 7 days of delivery</li>
                <li>
                  Email us at{' '}
                  <a
                    href="mailto:support@momenterie.com"
                    className="text-gray-900 hover:underline font-medium"
                  >
                    support@momenterie.com
                  </a>
                </li>
                <li>Include photos clearly showing the damage or defect</li>
                <li>Provide your order number</li>
              </ol>
              <p className="text-gray-700 leading-relaxed mb-6">
                We'll review your case and send you a replacement at no additional cost. In some
                cases, we may ask you to return the defective item.
              </p>

              <h3 className="text-2xl font-semibold text-gray-900 mb-4">Cancellations</h3>
              <p className="text-gray-700 leading-relaxed mb-6">
                Orders can be cancelled within 2 hours of placement. After this time, production
                begins and cancellations are no longer possible. To cancel an order, contact us
                immediately at{' '}
                <a
                  href="mailto:support@momenterie.com"
                  className="text-gray-900 hover:underline font-medium"
                >
                  support@momenterie.com
                </a>
                .
              </p>

              <h3 className="text-2xl font-semibold text-gray-900 mb-4">Lost Packages</h3>
              <p className="text-gray-700 leading-relaxed mb-6">
                If your tracking shows the package was delivered but you haven't received it:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
                <li>Check with neighbors or building management</li>
                <li>Verify the shipping address was correct</li>
                <li>Wait 2 business days (sometimes marked delivered early)</li>
                <li>Contact us if still not found – we'll help file a claim with the carrier</li>
              </ul>
            </section>

            <section className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Contact Us</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Have questions about shipping or returns? We're here to help!
              </p>
              <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                <p className="text-gray-700 mb-2">
                  <strong>Email:</strong>{' '}
                  <a
                    href="mailto:support@momenterie.com"
                    className="text-gray-900 hover:underline"
                  >
                    support@momenterie.com
                  </a>
                </p>
                <p className="text-gray-700 mb-2">
                  <strong>Response Time:</strong> Within 24 hours
                </p>
                <p className="text-gray-700">
                  <strong>Support Hours:</strong> Monday-Friday 9:00 AM - 6:00 PM CET
                </p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
