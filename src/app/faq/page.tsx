'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

const faqs: FAQItem[] = [
  {
    category: 'Orders & Shipping',
    question: 'How long does it take to process my order?',
    answer: 'Custom orders typically take 3-5 business days to process before shipping. Standard items ship within 1-2 business days. You\'ll receive a confirmation email when your order ships with tracking information.',
  },
  {
    category: 'Orders & Shipping',
    question: 'What are the shipping costs?',
    answer: 'Shipping costs vary based on your location and order size. Standard shipping within the EU is €4.95, or free on orders over €50. Express shipping is available for €9.95.',
  },
  {
    category: 'Orders & Shipping',
    question: 'Do you ship internationally?',
    answer: 'Yes! We ship to most countries worldwide. International shipping rates are calculated at checkout based on your location.',
  },
  {
    category: 'Orders & Shipping',
    question: 'Can I track my order?',
    answer: 'Absolutely! Once your order ships, you\'ll receive a tracking number via email. You can also track your order from your account dashboard.',
  },
  {
    category: 'Products & Customization',
    question: 'What if I make a mistake in my customization?',
    answer: 'You can save drafts and return to edit them before adding to cart. Once an order is placed, customizations cannot be changed as we begin production immediately. Please review carefully before checkout!',
  },
  {
    category: 'Products & Customization',
    question: 'What image quality do I need for puzzles?',
    answer: 'For best results, use high-resolution images (at least 2000x2000px). Images with good contrast and detail work best. We accept JPG, PNG, WEBP, and HEIC formats up to 10MB.',
  },
  {
    category: 'Products & Customization',
    question: 'Are the star maps astronomically accurate?',
    answer: 'Yes! Our star maps use real astronomical calculations to show the exact position of stars at your chosen date, time, and location. The positions are calculated using astronomy-engine library.',
  },
  {
    category: 'Products & Customization',
    question: 'Can I preview my product before ordering?',
    answer: 'Yes! All our editors include a real-time preview showing exactly how your final product will look.',
  },
  {
    category: 'Returns & Refunds',
    question: 'What is your return policy?',
    answer: 'Since all our products are custom-made, we cannot accept returns for change of mind. However, if your product arrives damaged or with a printing error, we\'ll replace it free of charge. Contact us within 7 days of delivery.',
  },
  {
    category: 'Returns & Refunds',
    question: 'What if my order arrives damaged?',
    answer: 'We\'re so sorry if that happens! Please email us at support@momenterie.com with photos of the damage within 7 days of delivery, and we\'ll send you a replacement immediately at no cost.',
  },
  {
    category: 'Returns & Refunds',
    question: 'Can I cancel my order?',
    answer: 'Orders can be cancelled within 2 hours of placement. After that, production begins and cancellations are not possible. Contact us immediately if you need to cancel.',
  },
  {
    category: 'Payment & Security',
    question: 'What payment methods do you accept?',
    answer: 'We accept all major credit cards (Visa, Mastercard, American Express), as well as Apple Pay, Google Pay, and other digital wallets through our secure Stripe payment system.',
  },
  {
    category: 'Payment & Security',
    question: 'Is my payment information secure?',
    answer: 'Yes! We use Stripe, a leading payment processor trusted by millions of businesses. We never store your credit card information on our servers.',
  },
  {
    category: 'Technical Support',
    question: 'I\'m having trouble uploading my image. What should I do?',
    answer: 'Make sure your image is under 10MB and in a supported format (JPG, PNG, WEBP, HEIC). Try using a different browser or clearing your cache. If issues persist, contact our support team.',
  },
  {
    category: 'Technical Support',
    question: 'The map editor isn\'t loading. Help!',
    answer: 'The map editor requires a modern browser with JavaScript enabled. Try refreshing the page, clearing your cache, or using Chrome/Firefox/Safari. If you\'re using a VPN, try disabling it.',
  },
];

const categories = Array.from(new Set(faqs.map(faq => faq.category)));

export default function FAQPage() {
  const [openItems, setOpenItems] = useState<Set<number>>(new Set());
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const toggleItem = (index: number) => {
    const newOpenItems = new Set(openItems);
    if (newOpenItems.has(index)) {
      newOpenItems.delete(index);
    } else {
      newOpenItems.add(index);
    }
    setOpenItems(newOpenItems);
  };

  const filteredFaqs = selectedCategory
    ? faqs.filter(faq => faq.category === selectedCategory)
    : faqs;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Find answers to common questions about orders, products, and customization
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              selectedCategory === null
                ? 'bg-gray-900 text-white'
                : 'bg-white text-gray-700 border border-gray-300 hover:border-gray-400'
            }`}
          >
            All Questions
          </button>
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === category
                  ? 'bg-gray-900 text-white'
                  : 'bg-white text-gray-700 border border-gray-300 hover:border-gray-400'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* FAQ List */}
        <div className="max-w-3xl mx-auto">
          <div className="space-y-4">
            {filteredFaqs.map((faq, index) => {
              const isOpen = openItems.has(index);

              return (
                <div
                  key={index}
                  className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
                >
                  <button
                    onClick={() => toggleItem(index)}
                    className="w-full px-6 py-4 text-left flex items-start justify-between hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex-1 pr-4">
                      <span className="text-xs font-medium text-gray-500 mb-1 block">
                        {faq.category}
                      </span>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {faq.question}
                      </h3>
                    </div>
                    <ChevronDown
                      className={`w-5 h-5 text-gray-500 flex-shrink-0 transition-transform ${
                        isOpen ? 'transform rotate-180' : ''
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-6 pb-4">
                      <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Contact CTA */}
        <div className="mt-16 text-center">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              Still have questions?
            </h2>
            <p className="text-gray-600 mb-6">
              Our support team is here to help! Get in touch and we'll respond within 24 hours.
            </p>
            <a
              href="/contact"
              className="inline-flex items-center justify-center px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors font-medium"
            >
              Contact Support
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
