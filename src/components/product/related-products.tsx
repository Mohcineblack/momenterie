import { ProductCard } from './product-card';

interface RelatedProduct {
  id: number;
  name: string;
  slug: string;
  description: string;
  basePrice: number;
  images: string[];
  featured?: boolean;
  bestseller?: boolean;
  category: {
    name: string;
    slug: string;
  };
  _count?: {
    reviews: number;
  };
}

interface RelatedProductsProps {
  products: RelatedProduct[];
}

export function RelatedProducts({ products }: RelatedProductsProps) {
  if (products.length === 0) {
    return null;
  }

  // Transform products to match ProductCard interface
  const transformedProducts = products.map((product) => ({
    ...product,
    averageRating: 0, // Could fetch this if needed
    reviewCount: product._count?.reviews || 0,
  }));

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-bold">You Might Also Like</h2>
        <a
          href={`/collections/${products[0].category.slug}`}
          className="text-gray-900 hover:underline font-medium"
        >
          View All
        </a>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {transformedProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
