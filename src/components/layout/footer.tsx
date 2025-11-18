import Link from 'next/link';
import { Facebook, Instagram, Twitter, Mail } from 'lucide-react';
import { NewsletterSignup } from '@/components/newsletter/newsletter-signup';

export function Footer() {
  const currentYear = new Date().getFullYear();

  const footerSections = [
    {
      title: 'Shop',
      links: [
        { name: 'City Maps', href: '/collections/city-maps' },
        { name: 'Star Maps', href: '/collections/star-maps' },
        { name: 'Puzzles', href: '/collections/puzzles' },
        { name: 'Jewelry', href: '/collections/jewelry' },
        { name: 'All Products', href: '/collections/all' },
      ],
    },
    {
      title: 'Company',
      links: [
        { name: 'About Us', href: '/about' },
        { name: 'Careers', href: '/careers' },
        { name: 'Reviews', href: '/reviews' },
        { name: 'Contact', href: '/contact' },
      ],
    },
    {
      title: 'Support',
      links: [
        { name: 'FAQ', href: '/faq' },
        { name: 'Shipping Policy', href: '/shipping-policy' },
        { name: 'Happiness Guarantee', href: '/happiness-guarantee' },
        { name: 'Track Order', href: '/orders/track' },
      ],
    },
    {
      title: 'Legal',
      links: [
        { name: 'Privacy Policy', href: '/policies/privacy-policy' },
        { name: 'Terms of Service', href: '/policies/terms-of-service' },
        { name: 'Refund Policy', href: '/policies/refund-policy' },
        { name: 'Legal Notice', href: '/policies/legal-notice' },
      ],
    },
  ];

  return (
    <footer className="bg-gray-50 border-t">
      <div className="container mx-auto px-4 py-12">
        {/* Newsletter Section */}
        <div className="mb-12 max-w-md mx-auto text-center">
          <h3 className="text-lg font-semibold mb-2">Stay in the loop</h3>
          <p className="text-sm text-gray-600 mb-4">
            Subscribe to receive updates, exclusive offers, and more.
          </p>
          <NewsletterSignup variant="compact" />
        </div>

        {/* Links Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          {footerSections.map((section) => (
            <div key={section.title}>
              <h4 className="font-semibold mb-4 text-gray-900">{section.title}</h4>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Social Links */}
        <div className="flex justify-center space-x-6 mb-8">
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-600 hover:text-gray-900 transition-colors"
            aria-label="Facebook"
          >
            <Facebook className="h-5 w-5" />
          </a>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-600 hover:text-gray-900 transition-colors"
            aria-label="Instagram"
          >
            <Instagram className="h-5 w-5" />
          </a>
          <a
            href="https://twitter.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-600 hover:text-gray-900 transition-colors"
            aria-label="Twitter"
          >
            <Twitter className="h-5 w-5" />
          </a>
          <a
            href="mailto:support@momenterie.com"
            className="text-gray-600 hover:text-gray-900 transition-colors"
            aria-label="Email"
          >
            <Mail className="h-5 w-5" />
          </a>
        </div>

        {/* Trust Badges */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8 max-w-3xl mx-auto">
          <div className="text-center">
            <div className="text-2xl mb-1">🚚</div>
            <p className="text-xs font-medium">Free Shipping</p>
            <p className="text-xs text-gray-600">Over €50</p>
          </div>
          <div className="text-center">
            <div className="text-2xl mb-1">😊</div>
            <p className="text-xs font-medium">100% Satisfaction</p>
            <p className="text-xs text-gray-600">Guaranteed</p>
          </div>
          <div className="text-center">
            <div className="text-2xl mb-1">🔒</div>
            <p className="text-xs font-medium">Secure Payment</p>
            <p className="text-xs text-gray-600">SSL Protected</p>
          </div>
          <div className="text-center">
            <div className="text-2xl mb-1">⭐</div>
            <p className="text-xs font-medium">4.9/5 Rating</p>
            <p className="text-xs text-gray-600">10,000+ Reviews</p>
          </div>
        </div>

        {/* Copyright */}
        <div className="text-center text-sm text-gray-600 border-t pt-8">
          <p>© {currentYear} Momenterie. All rights reserved.</p>
          <p className="mt-2">Made with ❤️ for preserving special moments</p>
        </div>
      </div>
    </footer>
  );
}
