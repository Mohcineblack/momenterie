export function HowItWorks() {
  const steps = [
    {
      number: '1',
      title: 'Choose Your Product',
      description: 'Select from our range of personalized items - maps, puzzles, jewelry, and more.',
      icon: '🎨',
    },
    {
      number: '2',
      title: 'Customize',
      description: 'Use our easy-to-use editor to personalize with your dates, locations, and messages.',
      icon: '✨',
    },
    {
      number: '3',
      title: 'Preview & Order',
      description: 'See a real-time preview of your creation and place your order with confidence.',
      icon: '👁️',
    },
    {
      number: '4',
      title: 'Receive & Enjoy',
      description: 'We craft your order with care and ship it directly to you. Create lasting memories!',
      icon: '📦',
    },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            How It Works
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Creating your personalized gift is simple and fun
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              {/* Connector Line (hidden on last item) */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-16 left-1/2 w-full h-0.5 bg-gray-200 z-0">
                  <div className="absolute right-0 top-1/2 transform -translate-y-1/2">
                    <svg
                      className="w-4 h-4 text-gray-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </div>
              )}

              {/* Step Content */}
              <div className="relative bg-gray-50 rounded-2xl p-8 text-center hover:shadow-lg transition-shadow">
                {/* Number Badge */}
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-12 h-12 bg-gray-900 text-white rounded-full flex items-center justify-center font-bold text-lg shadow-lg">
                  {step.number}
                </div>

                {/* Icon */}
                <div className="text-5xl mb-4 mt-4">{step.icon}</div>

                {/* Title */}
                <h3 className="text-xl font-bold mb-3">{step.title}</h3>

                {/* Description */}
                <p className="text-gray-600 text-sm leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-16">
          <a
            href="/collections/all"
            className="inline-flex items-center px-8 py-4 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors font-medium"
          >
            Start Creating Now
            <svg
              className="ml-2 h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 7l5 5m0 0l-5 5m5-5H6"
              />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}
