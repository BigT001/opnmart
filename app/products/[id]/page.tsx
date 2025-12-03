'use client';

import Link from 'next/link';
import { ArrowLeft, ShoppingCart, Heart, Share2, Star, Check } from 'lucide-react';
import { useState } from 'react';
import { use } from 'react';
import { ThemeToggle } from '@/components/ui/ThemeToggle';

// Product Images
const PRODUCT_IMAGES = {
  phones: 'https://images.unsplash.com/photo-1511707267537-b85faf00021e?w=800&q=80',
  laptop: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&q=80',
  camera: 'https://images.unsplash.com/photo-1606986628025-35d57e735ae0?w=800&q=80',
  fridge: 'https://images.unsplash.com/photo-1584622181563-430f63602d4b?w=800&q=80',
  generator: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=800&q=80',
  tablet: 'https://images.unsplash.com/photo-1542286601-b06b24baf08b?w=800&q=80',
  headphones: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80',
  speakers: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=800&q=80',
  powerbank: 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=800&q=80',
  microphone: 'https://images.unsplash.com/photo-1590119957829-11112192aa03?w=800&q=80',
};

// Sample products data - will be populated from vendor uploads
const FEATURED_PRODUCTS: any[] = [];

export default function ProductDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const product = FEATURED_PRODUCTS.find(p => p.id === parseInt(id));
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);

  if (!product) {
    return (
      <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white">
        <header className="sticky top-0 z-50 bg-white/95 dark:bg-black/95 backdrop-blur border-b border-green-500/30 shadow-lg">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <Link href="/" className="flex items-center gap-2 font-bold text-2xl">
                <span className="text-3xl">🛒</span>
                <span className="bg-gradient-to-r from-green-400 to-cyan-400 bg-clip-text text-transparent">OpnMart</span>
              </Link>
              <div className="flex items-center gap-4">
                <ThemeToggle />
                <Link href="/" className="flex items-center gap-2 text-green-500 hover:text-green-400">
                  <ArrowLeft className="h-5 w-5" />
                  Back
                </Link>
              </div>
            </div>
          </div>
        </header>

        <div className="flex items-center justify-center min-h-[calc(100vh-64px)]">
          <div className="text-center">
            <p className="text-xl font-semibold mb-4">Product not found</p>
            <Link href="/" className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-cyan-500 text-black rounded-lg font-semibold hover:shadow-lg">
              Return to Shop
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const discount = Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100);
  const formatPrice = (price: number) => '₦' + price.toLocaleString();

  return (
    <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/95 dark:bg-black/95 backdrop-blur border-b border-green-500/30 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2 font-bold text-2xl">
              <span className="text-3xl">🛒</span>
              <span className="bg-gradient-to-r from-green-400 to-cyan-400 bg-clip-text text-transparent">OpnMart</span>
            </Link>
            <div className="flex items-center gap-4">
              <ThemeToggle />
              <Link href="/" className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-green-500/10 transition text-green-500">
                <ArrowLeft className="h-5 w-5" />
                <span>Back</span>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Image */}
          <div className="flex items-center justify-center">
            <div className="bg-gradient-to-br from-gray-200 to-gray-100 dark:from-zinc-800 dark:to-black rounded-3xl p-8 w-full h-96 sm:h-full flex items-center justify-center">
              <img
                src={product.image}
                alt={product.name}
                className="max-w-full max-h-full object-contain"
              />
            </div>
          </div>

          {/* Product Info */}
          <div className="flex flex-col justify-between">
            {/* Top Section */}
            <div>
              {/* Breadcrumb */}
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-4">
                <span>{product.category}</span>
                <span>/</span>
                <span className="text-green-500">{product.brand}</span>
              </div>

              {/* Title & Badges */}
              <h1 className="text-4xl sm:text-5xl font-bold mb-4">{product.name}</h1>

              {/* Badges Row */}
              <div className="flex items-center gap-3 mb-6">
                {product.badge && (
                  <div className="bg-gradient-to-r from-green-500 to-cyan-500 text-black text-xs font-bold px-4 py-2 rounded-full">
                    {product.badge}
                  </div>
                )}
                <div className="bg-green-500/10 dark:bg-green-500/15 text-green-600 dark:text-green-300 text-xs font-semibold px-4 py-2 rounded-full border border-green-500/20 flex items-center gap-1">
                  <Check className="h-3 w-3" />
                  {product.condition}
                </div>
              </div>

              {/* Rating */}
              <div className="flex items-center gap-4 mb-8">
                <div className="flex items-center gap-2">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${i < Math.floor(product.rating) ? 'fill-green-400 text-green-400' : 'text-gray-400'}`}
                    />
                  ))}
                </div>
                <span className="text-lg font-semibold">{product.rating}</span>
                <span className="text-gray-600 dark:text-gray-400">({product.reviews} reviews)</span>
              </div>

              {/* Price Section */}
              <div className="bg-gray-50 dark:bg-zinc-900/50 rounded-2xl p-6 mb-8">
                <div className="flex items-baseline gap-4 mb-4">
                  <span className="text-5xl font-black text-transparent bg-gradient-to-r from-green-400 to-cyan-400 bg-clip-text">
                    {formatPrice(product.price)}
                  </span>
                  {product.oldPrice && (
                    <>
                      <span className="text-2xl text-gray-400 line-through">{formatPrice(product.oldPrice)}</span>
                      <span className="text-lg font-bold bg-red-500/20 text-red-500 px-3 py-1 rounded-lg">-{discount}%</span>
                    </>
                  )}
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Free delivery on orders above ₦50,000</p>
              </div>

              {/* Description */}
              <div className="mb-8">
                <h3 className="text-lg font-bold mb-3">About this product</h3>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{product.description}</p>
              </div>

              {/* Specs */}
              <div className="mb-8">
                <h3 className="text-lg font-bold mb-4">Specifications</h3>
                <div className="grid grid-cols-2 gap-4">
                  {Object.entries(product.specs).map(([key, value]: [string, unknown]) => (
                    <div key={key} className="bg-gray-50 dark:bg-zinc-900/30 p-3 rounded-lg">
                      <p className="text-xs text-gray-600 dark:text-gray-400 uppercase tracking-widest mb-1">{key}</p>
                      <p className="font-semibold text-sm">{String(value)}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Stock Status */}
              <div className="flex items-center gap-3 mb-8">
                <div className={`w-3 h-3 rounded-full ${product.inStock ? 'bg-green-500' : 'bg-red-500'}`}></div>
                <span className={`font-semibold ${product.inStock ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                  {product.inStock ? 'In Stock' : 'Out of Stock'}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              {/* Quantity Selector */}
              <div className="flex items-center gap-4 mb-6">
                <span className="text-sm font-semibold">Quantity:</span>
                <div className="flex items-center border border-gray-300 dark:border-zinc-700 rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-zinc-800 transition"
                  >
                    −
                  </button>
                  <span className="px-6 py-2 font-semibold">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-zinc-800 transition"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Add to Cart Button */}
              <button className="w-full py-4 bg-gradient-to-r from-green-500 to-cyan-500 hover:from-green-400 hover:to-cyan-400 text-black rounded-xl font-bold text-lg transition transform hover:shadow-xl shadow-lg shadow-green-500/40 flex items-center justify-center gap-2">
                <ShoppingCart className="h-6 w-6" />
                Add to Cart
              </button>

              {/* Wishlist Button */}
              <button
                onClick={() => setIsWishlisted(!isWishlisted)}
                className={`w-full py-3 rounded-xl font-semibold transition flex items-center justify-center gap-2 ${
                  isWishlisted
                    ? 'bg-red-500/20 text-red-500 border border-red-500/30'
                    : 'bg-gray-100 dark:bg-zinc-900 text-black dark:text-white border border-gray-300 dark:border-zinc-700 hover:bg-gray-200 dark:hover:bg-zinc-800'
                }`}
              >
                <Heart className={`h-5 w-5 ${isWishlisted ? 'fill-current' : ''}`} />
                {isWishlisted ? 'Added to Wishlist' : 'Add to Wishlist'}
              </button>

              {/* Share Button */}
              <button className="w-full py-3 bg-gray-100 dark:bg-zinc-900 text-black dark:text-white rounded-xl font-semibold transition hover:bg-gray-200 dark:hover:bg-zinc-800 flex items-center justify-center gap-2 border border-gray-300 dark:border-zinc-700">
                <Share2 className="h-5 w-5" />
                Share
              </button>
            </div>
          </div>
        </div>

        {/* Additional Info Section */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-green-500/10 dark:bg-green-500/5 border border-green-500/20 rounded-2xl p-6 text-center">
            <div className="text-4xl mb-3">🚚</div>
            <h3 className="font-bold mb-2">Fast Delivery</h3>
            <p className="text-sm text-gray-700 dark:text-gray-400">Get your order delivered within 1-3 business days</p>
          </div>
          <div className="bg-green-500/10 dark:bg-green-500/5 border border-green-500/20 rounded-2xl p-6 text-center">
            <div className="text-4xl mb-3">🔒</div>
            <h3 className="font-bold mb-2">Secure Payment</h3>
            <p className="text-sm text-gray-700 dark:text-gray-400">100% secure transactions with multiple payment options</p>
          </div>
          <div className="bg-green-500/10 dark:bg-green-500/5 border border-green-500/20 rounded-2xl p-6 text-center">
            <div className="text-4xl mb-3">✅</div>
            <h3 className="font-bold mb-2">Quality Guarantee</h3>
            <p className="text-sm text-gray-700 dark:text-gray-400">All products are original and backed by warranty</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-20 bg-gray-50 dark:bg-zinc-900 border-t border-gray-200 dark:border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center text-gray-600 dark:text-gray-400">
            <p>© 2025 OpnMart. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
