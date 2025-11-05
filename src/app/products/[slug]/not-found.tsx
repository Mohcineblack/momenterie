import Link from 'next/link';

export default function ProductNotFound() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-center px-4">
        <div className="text-8xl mb-6">🔍</div>
        <h1 className="text-4xl font-bold mb-4">Product Not Found</h1>
        <p className="text-lg text-gray-600 mb-8 max-w-md">
          Sorry, we couldn't find the product you're looking for. It may have been
          removed or the link might be incorrect.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/collections/all"
            className="px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors font-medium"
          >
            Browse All Products
          </Link>
          <Link
            href="/"
            className="px-6 py-3 border border-gray-300 text-gray-900 rounded-lg hover:bg-gray-50 transition-colors font-medium"
          >
            Go to Homepage
          </Link>
        </div>
      </div>
    </div>
  );
}
