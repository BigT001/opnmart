'use client';

// Reusable product card component for homepage and products page
// Supports two variants: 'grid' (homepage) and 'compact' (products page)

import Link from 'next/link';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '@/app/context/CartContext';
import { useToast } from '@/app/context/ToastContext';

interface ProductCardProps {
  product: any;
  variant?: 'grid' | 'compact'; // 'grid' for homepage, 'compact' for products page (compact is default)
}

export default function ProductCard({ product, variant = 'compact' }: ProductCardProps) {
  const { addToCart, isItemInCart } = useCart();
  const { addToast } = useToast();

  // Return null if product is invalid
  if (!product || !product.name || !product.price) {
    return null;
  }

  const formatPrice = (price: number) => '₦' + price.toLocaleString();

  const calculateDiscount = (oldPrice: number, newPrice: number) => {
    if (!oldPrice) return 0;
    return Math.round(((oldPrice - newPrice) / oldPrice) * 100);
  };

  const discount = product.oldPrice ? calculateDiscount(product.oldPrice, product.price) : 0;

  const handleAddToCart = () => {
    if ((product.stock ?? 0) > 0) {
      const productId = product._id || product.id;
      
      // Check if item already in cart
      if (isItemInCart(productId)) {
        addToast('Already added to cart', 'warning', 3000);
        return;
      }
      
      addToCart({
        id: productId,
        name: product.name,
        price: product.price,
        image: product.image,
        quantity: 1,
        category: product.category,
        subcategory: product.subcategory,
        brand: product.brand,
        vendorId: product.vendorId,
      });
      
      addToast('Added to cart!', 'success', 2500);
    }
  };

  // Compact variant (products page style - OFFICIAL STANDARD CARD)
  if (variant === 'compact') {
    return (
      <div className="bg-slate-50 dark:bg-slate-900/50 rounded-lg overflow-hidden hover:shadow-lg transition border border-slate-200 dark:border-green-500/20 hover:border-green-500/50 dark:hover:border-green-500/50 transition flex flex-col h-full">
        <div className="relative h-64 bg-slate-200 dark:bg-slate-800 overflow-hidden flex-shrink-0">
          <img
            src={product.image || 'https://via.placeholder.com/400x300'}
            alt={product.name}
            className="w-full h-full object-cover hover:scale-110 transition duration-300"
          />
          {discount > 0 && (
            <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-lg text-xs font-bold">
              -{discount}%
            </div>
          )}
          <div className="absolute top-2 left-2 bg-green-500 text-black px-2 py-1 rounded-lg text-xs font-bold">
            {product.condition}
          </div>
        </div>

        <div className="p-4 flex-1 flex flex-col">
          <h3 className="font-semibold text-sm mb-1 line-clamp-2">{product.name}</h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 mb-3">
            {product.brand}
          </p>

          <div className="mb-3 flex items-center gap-2">
            <div className="text-lg font-bold text-green-600 dark:text-green-400">
              {formatPrice(product.price)}
            </div>
            {product.oldPrice && product.oldPrice > product.price && (
              <div className="text-sm text-slate-500 line-through">
                {formatPrice(product.oldPrice)}
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-2 mt-auto">
            <Link
              href={`/products/${product._id || product.id}`}
              className="py-2 rounded-lg bg-slate-600 dark:bg-slate-700 hover:bg-slate-700 dark:hover:bg-slate-600 text-white font-semibold transition text-sm text-center"
            >
              Details
            </Link>
            <button
              onClick={handleAddToCart}
              disabled={(product.stock ?? 0) === 0}
              className="py-2 rounded-lg bg-green-500 disabled:bg-slate-400 disabled:cursor-not-allowed text-black font-semibold hover:bg-green-600 transition text-sm flex items-center justify-center gap-1"
              title={`${(product.stock ?? 0) > 0 ? 'Add to cart' : 'Out of stock'}`}
            >
              <ShoppingCart className="w-4 h-4" />
              {(product.stock ?? 0) > 0 ? 'Add' : 'Out'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Grid variant (homepage style)
  return (
    <Link
      href={`/products/${product._id || product.id}`}
      className="group"
    >
      <div className="bg-white dark:bg-slate-900 rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition duration-300 border border-slate-200 dark:border-slate-800 h-full flex flex-col">
        {/* Image Section */}
        <div className="relative bg-gradient-to-br from-slate-100 to-slate-50 dark:from-slate-800 dark:to-slate-900 h-72 sm:h-80 flex items-center justify-center overflow-hidden flex-shrink-0">
          <img
            src={product.image || 'https://via.placeholder.com/400x300'}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
          />

          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition" />

          {/* Badges */}
          <div className="absolute top-3 right-3 flex flex-col gap-2">
            {product.badge && (
              <div className="bg-gradient-to-r from-green-500 to-cyan-500 text-black text-xs font-bold px-3 py-1.5 rounded-lg shadow-md shadow-green-500/50 transform group-hover:scale-110 transition">
                {product.badge}
              </div>
            )}
            {discount > 0 && (
              <div className="bg-red-500 text-white text-xs font-black px-2.5 py-1.5 rounded-lg shadow-md shadow-red-500/50 flex items-center justify-center min-w-11 transform group-hover:scale-110 transition">
                -{discount}%
              </div>
            )}
          </div>

          {/* View Details Button */}
          <button className="absolute bottom-3 left-3 right-3 py-2 bg-gradient-to-r from-green-500 to-cyan-500 text-black rounded-lg font-semibold text-xs opacity-0 group-hover:opacity-100 transition transform group-hover:translate-y-0 translate-y-2 shadow-md shadow-green-500/50">
            View Details
          </button>
        </div>

        {/* Product Info */}
        <div className="p-4 flex-1 flex flex-col">
          {/* Product Name */}
          <h3 className="font-bold text-slate-900 dark:text-white mb-3 line-clamp-2 group-hover:text-green-500 transition text-sm leading-snug">
            {product.name}
          </h3>

          {/* Price Section */}
          <div className="mb-4 pb-4 border-b border-slate-200 dark:border-slate-800">
            <div className="flex items-baseline gap-3">
              <span className="text-2xl font-black text-transparent bg-gradient-to-r from-green-500 to-cyan-500 bg-clip-text">
                {formatPrice(product.price)}
              </span>
              {product.oldPrice && (
                <span className="text-lg text-slate-500 dark:text-slate-600 line-through font-semibold">
                  {formatPrice(product.oldPrice)}
                </span>
              )}
            </div>
          </div>

          {/* Add to Cart Button */}
          <button
            onClick={(e) => {
              e.preventDefault();
              handleAddToCart();
            }}
            disabled={(product.stock ?? 0) === 0}
            className="w-full py-3 bg-gradient-to-r from-green-500 to-cyan-500 hover:from-green-400 hover:to-cyan-400 disabled:from-slate-400 disabled:to-slate-400 disabled:cursor-not-allowed text-black rounded-xl font-bold text-sm transition transform hover:scale-105 shadow-lg shadow-green-500/40 hover:shadow-green-500/60 mt-auto flex items-center justify-center gap-2 group/btn"
          >
            <ShoppingCart className="h-4 w-4 transition group-hover/btn:scale-110" />
            <span>{(product.stock ?? 0) > 0 ? 'Add to Cart' : 'Out of Stock'}</span>
          </button>
        </div>
      </div>
    </Link>
  );
}
