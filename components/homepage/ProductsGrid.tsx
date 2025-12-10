'use client';

import ProductCard from '../ProductCard';

interface Product {
  _id: string;
  name: string;
  price: number;
  image: string;
  rating: number;
  vendorId?: string;
  category?: string;
  [key: string]: any;
}

interface ProductsGridProps {
  products: Product[];
  isLoading: boolean;
  emptyMessage?: string;
}

export default function ProductsGrid({
  products,
  isLoading,
  emptyMessage = 'No products found. Try adjusting your filters.',
}: ProductsGridProps) {
  if (isLoading) {
    return (
      <div className="col-span-full lg:col-span-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="h-80 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-zinc-800 dark:to-zinc-700 rounded-xl animate-pulse"
            />
          ))}
        </div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="col-span-full lg:col-span-4">
        <div className="bg-white/50 dark:bg-zinc-900/30 backdrop-blur-sm rounded-xl border border-gray-200 dark:border-zinc-800 p-12 text-center">
          <p className="text-gray-600 dark:text-gray-400 font-semibold text-lg mb-2">
            🛍️ {emptyMessage}
          </p>
          <p className="text-gray-500 dark:text-gray-500 text-sm">
            Browse other categories or reset your filters
          </p>
        </div>
      </div>
    );
  }

  // Filter out products without valid id to avoid key warnings
  const validProducts = products.filter(p => p._id || p.id);

  return (
    <div className="col-span-full lg:col-span-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {validProducts.map((product, index) => (
          <ProductCard
            key={product._id || product.id || `product-${index}`}
            product={product}
          />
        ))}
      </div>
    </div>
  );
}
