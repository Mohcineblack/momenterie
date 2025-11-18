export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Privacy Policy</h1>
          <p className="text-gray-600 mb-8">Last updated: January 2025</p>

          <div className="prose prose-lg max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Introduction</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Welcome to Momenterie. We respect your privacy and are committed to protecting your
                personal data. This privacy policy will inform you about how we look after your
                personal data when you visit our website and tell you about your privacy rights.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                2. Data We Collect About You
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                We may collect, use, store and transfer different kinds of personal data about you:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 mb-4">
                <li>
                  <strong>Identity Data:</strong> first name, last name, username
                </li>
                <li>
                  <strong>Contact Data:</strong> email address, shipping address, billing address
                </li>
                <li>
                  <strong>Transaction Data:</strong> details about payments and orders
                </li>
                <li>
                  <strong>Technical Data:</strong> IP address, browser type, device information
                </li>
                <li>
                  <strong>Usage Data:</strong> how you use our website and services
                </li>
                <li>
                  <strong>Marketing Data:</strong> your preferences for receiving marketing
                  communications
                </li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">3. How We Use Your Data</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                We will only use your personal data when the law allows us to. Most commonly, we
                use your personal data in the following circumstances:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 mb-4">
                <li>To process and deliver your orders</li>
                <li>To manage payments, fees and charges</li>
                <li>To manage our relationship with you</li>
                <li>To improve our website, products/services and customer experience</li>
                <li>To send you marketing communications (with your consent)</li>
                <li>To protect against fraud and ensure security</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Data Security</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                We have implemented appropriate security measures to prevent your personal data from
                being accidentally lost, used or accessed in an unauthorized way. We use:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 mb-4">
                <li>SSL encryption for all data transmission</li>
                <li>Secure payment processing through Stripe</li>
                <li>Regular security audits and updates</li>
                <li>Limited access to personal data on a need-to-know basis</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Data Retention</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                We will only retain your personal data for as long as necessary to fulfill the
                purposes we collected it for, including satisfying any legal, accounting, or
                reporting requirements. Order data is typically retained for 7 years for tax and
                accounting purposes.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Your Legal Rights</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Under data protection laws, you have rights including:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 mb-4">
                <li>
                  <strong>Right to access:</strong> request copies of your personal data
                </li>
                <li>
                  <strong>Right to rectification:</strong> request correction of your personal data
                </li>
                <li>
                  <strong>Right to erasure:</strong> request deletion of your personal data
                </li>
                <li>
                  <strong>Right to restrict processing:</strong> request restriction of processing
                </li>
                <li>
                  <strong>Right to data portability:</strong> request transfer of your data
                </li>
                <li>
                  <strong>Right to object:</strong> object to processing of your personal data
                </li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Cookies</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                We use cookies and similar tracking technologies to improve your browsing
                experience. Essential cookies are necessary for the website to function. Analytics
                cookies help us understand how you use our site. You can manage your cookie
                preferences in your browser settings.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Third-Party Services</h2>
              <p className="text-gray-700 leading-relaxed mb-4">We work with the following third-party services:</p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 mb-4">
                <li>
                  <strong>Stripe:</strong> Payment processing
                </li>
                <li>
                  <strong>Google OAuth:</strong> Authentication
                </li>
                <li>
                  <strong>Mapbox:</strong> Map services
                </li>
                <li>
                  <strong>Resend:</strong> Email delivery
                </li>
              </ul>
              <p className="text-gray-700 leading-relaxed mb-4">
                These services have their own privacy policies governing their use of your data.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Children's Privacy</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Our services are not directed to children under 16. We do not knowingly collect
                personal data from children under 16. If you believe we have collected data from a
                child, please contact us immediately.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Changes to This Policy</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                We may update this privacy policy from time to time. We will notify you of any
                changes by posting the new policy on this page and updating the "Last updated" date.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Contact Us</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                If you have any questions about this privacy policy or our privacy practices, please
                contact us:
              </p>
              <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                <p className="text-gray-700">
                  <strong>Email:</strong>{' '}
                  <a href="mailto:privacy@momenterie.com" className="text-gray-900 hover:underline">
                    privacy@momenterie.com
                  </a>
                </p>
                <p className="text-gray-700 mt-2">
                  <strong>Address:</strong> Momenterie GmbH, Friedrichstraße 123, 10117 Berlin,
                  Germany
                </p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
