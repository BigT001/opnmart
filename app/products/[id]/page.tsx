'use client';

import Link from 'next/link';
import { ArrowLeft, ShoppingCart, Heart, Share2, Loader, Star, Truck, Shield, RotateCcw, ChevronLeft, ChevronRight, Check, Zap, Award } from 'lucide-react';
import { useState, useEffect } from 'react';
import { use } from 'react';

export default function ProductDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // Combine main image with additional images - fixed to handle null product
  const allImages = product && product.image 
    ? (product.images && product.images.length > 0 
        ? [{ url: product.image }, ...product.images]
        : [{ url: product.image }])
    : [];

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        console.log(`Fetching product with ID: ${id}`);
        const response = await fetch(`/api/products/${id}`);
        const data = await response.json();
        console.log(`API response status: ${response.status}`, data);
        
        if (response.ok) {
          if (data.product) {
            console.log('Product found:', data.product);
            console.log('Main image:', data.product.image);
            console.log('Additional images:', data.product.images);
            console.log('All images combined:', data.product.images && data.product.images.length > 0 
              ? [{ url: data.product.image }, ...data.product.images]
              : [{ url: data.product.image }]);
            setProduct(data.product);
          } else {
            console.log('No product in response');
          }
        } else {
          console.log('API error response:', data);
        }
      } catch (error) {
        console.error('Failed to fetch product:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
        <div className="text-center">
          <Loader className="h-12 w-12 text-emerald-500 animate-spin mx-auto mb-4" />
          <p className="text-slate-600 dark:text-slate-400">Loading product...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">Product not found</h1>
          <p className="text-slate-600 dark:text-slate-400 mb-8">The product you're looking for doesn't exist.</p>
          <Link href="/" className="inline-flex items-center gap-2 px-6 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition">
            <ArrowLeft className="w-4 h-4" />
            Return to Shop
          </Link>
        </div>
      </div>
    );
  }

  const discount = product.oldPrice ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100) : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      {/* Sticky Header */}
      <div className="sticky top-0 z-40 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 py-3 sm:px-6 lg:px-8 flex items-center justify-between">
          <Link href="/" className="inline-flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition font-medium">
            <ArrowLeft className="w-4 h-4" />
            Back
          </Link>
          <h1 className="flex-1 text-center text-sm font-bold text-slate-900 dark:text-white truncate px-4">{product.name}</h1>
          <button className="w-9 h-9" />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Image Section - Elegant & Clean */}
          <div className="lg:col-span-1">
            {/* Main Image Container */}
            <div className="relative bg-white dark:bg-slate-800 rounded-2xl overflow-hidden shadow-lg border border-slate-200 dark:border-slate-700 mb-4">
              <div className="aspect-square bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-800 flex items-center justify-center relative group">
                <img 
                  src={allImages[activeImageIndex]?.url} 
                  alt={product.name}
                  className="w-full h-full object-contain p-8"
                />
                
                {/* Badge */}
                {(product.badge || discount > 0) && (
                  <div className="absolute top-4 right-4 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                    {discount > 0 ? `Save ${discount}%` : product.badge}
                  </div>
                )}

                {/* Image Navigation Arrows - Only show if multiple images */}
                {allImages.length > 1 && (
                  <>
                    <button
                      onClick={() => setActiveImageIndex((i) => (i - 1 + allImages.length) % allImages.length)}
                      className="absolute left-2 top-1/2 -translate-y-1/2 bg-white dark:bg-slate-700 hover:bg-slate-100 dark:hover:bg-slate-600 text-slate-900 dark:text-white rounded-full p-2 transition shadow-md opacity-0 group-hover:opacity-100"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => setActiveImageIndex((i) => (i + 1) % allImages.length)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 bg-white dark:bg-slate-700 hover:bg-slate-100 dark:hover:bg-slate-600 text-slate-900 dark:text-white rounded-full p-2 transition shadow-md opacity-0 group-hover:opacity-100"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </>
                )}

                {/* Image Counter */}
                {allImages.length > 1 && (
                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-black/60 text-white px-3 py-1 rounded-full text-xs font-medium">
                    {activeImageIndex + 1} / {allImages.length}
                  </div>
                )}
              </div>
            </div>

            {/* Thumbnail Gallery - Only show if multiple images */}
            {allImages.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {allImages.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveImageIndex(index)}
                    className={`flex-shrink-0 w-14 h-14 rounded-lg overflow-hidden border-2 transition ${
                      activeImageIndex === index
                        ? 'border-emerald-500 ring-2 ring-emerald-300 dark:ring-emerald-800'
                        : 'border-slate-300 dark:border-slate-600 hover:border-emerald-400'
                    }`}
                  >
                    <img
                      src={img.url}
                      alt={`View ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Info Section */}
            <div className="bg-white dark:bg-slate-800 rounded-xl p-4 mt-4 border border-slate-200 dark:border-slate-700 space-y-3">
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-amber-500" />
                <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">{product.brand}</span>
              </div>
              <div className="flex items-center gap-2">
                {product.stock > 0 ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-500" />
                    <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">In Stock</span>
                  </>
                ) : (
                  <>
                    <span className="text-xs font-semibold text-red-600 dark:text-red-400">Out of Stock</span>
                  </>
                )}
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400">{product.condition}</div>
            </div>
          </div>

          {/* Details Section - Polished & Professional */}
          <div className="lg:col-span-2 space-y-5">
            
            {/* Product Title */}
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-2 leading-tight">{product.name}</h1>
              <p className="text-slate-600 dark:text-slate-400 text-sm">{product.subcategory}</p>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-3 pb-4 border-b border-slate-200 dark:border-slate-700">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${i < Math.round(product.rating || 4.5) ? 'fill-amber-400 text-amber-400' : 'text-slate-300 dark:text-slate-600'}`}
                  />
                ))}
              </div>
              <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                {product.rating || 4.5} ({product.reviews || 0} reviews)
              </span>
            </div>

            {/* Description */}
            <div>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-sm">{product.description}</p>
            </div>

            {/* Price Section - Premium Card */}
            <div className="bg-gradient-to-br from-emerald-50 to-cyan-50 dark:from-emerald-950/40 dark:to-cyan-950/40 rounded-xl p-6 border border-emerald-200 dark:border-emerald-800">
              <p className="text-slate-600 dark:text-slate-400 text-xs font-semibold uppercase tracking-wide mb-2">Price</p>
              <div className="flex items-baseline gap-4">
                <span className="text-5xl font-black text-emerald-600 dark:text-emerald-400">
                  ₦{product.price.toLocaleString()}
                </span>
                {product.oldPrice && (
                  <span className="text-2xl text-slate-400 dark:text-slate-500 line-through font-semibold">
                    ₦{product.oldPrice.toLocaleString()}
                  </span>
                )}
              </div>
            </div>

            {/* Quantity & Action Buttons */}
            <div className="space-y-4 pt-2">
              {/* Quantity */}
              <div className="flex items-center gap-4">
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Quantity</span>
                <div className="flex items-center bg-slate-100 dark:bg-slate-800 rounded-lg border border-slate-300 dark:border-slate-600 w-fit">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 flex items-center justify-center text-slate-600 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-700 transition"
                  >
                    −
                  </button>
                  <span className="w-8 text-center font-bold text-slate-900 dark:text-white">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    className="w-10 h-10 flex items-center justify-center text-slate-600 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-700 transition"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Main Action Button */}
              <button 
                disabled={product.stock === 0}
                className="w-full bg-gradient-to-r from-emerald-500 to-cyan-600 hover:from-emerald-600 hover:to-cyan-700 disabled:from-slate-300 disabled:to-slate-400 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl flex items-center justify-center gap-3 transition shadow-lg hover:shadow-xl"
              >
                <ShoppingCart className="w-5 h-5" />
                {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
              </button>

              {/* Secondary Actions */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setIsWishlisted(!isWishlisted)}
                  className={`py-3 px-4 rounded-lg font-semibold transition border-2 ${
                    isWishlisted
                      ? 'bg-red-100 dark:bg-red-950 border-red-300 dark:border-red-700 text-red-600 dark:text-red-400'
                      : 'bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white hover:border-red-300'
                  }`}
                >
                  <Heart className={`w-4 h-4 inline mr-2 ${isWishlisted ? 'fill-current' : ''}`} />
                  Wishlist
                </button>
                <button className="py-3 px-4 rounded-lg font-semibold border-2 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 transition">
                  <Share2 className="w-4 h-4 inline mr-2" />
                  Share
                </button>
              </div>
            </div>

            {/* Trust Section */}
            <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
              <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wide mb-3">Why buy from us</p>
              <div className="grid grid-cols-2 gap-2">
                <div className="flex items-start gap-2 text-sm">
                  <Truck className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-slate-900 dark:text-white">Fast Delivery</p>
                    <p className="text-xs text-slate-600 dark:text-slate-400">1-3 business days</p>
                  </div>
                </div>
                <div className="flex items-start gap-2 text-sm">
                  <Shield className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-slate-900 dark:text-white">Secure Payment</p>
                    <p className="text-xs text-slate-600 dark:text-slate-400">100% protected</p>
                  </div>
                </div>
                <div className="flex items-start gap-2 text-sm">
                  <RotateCcw className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-slate-900 dark:text-white">Easy Returns</p>
                    <p className="text-xs text-slate-600 dark:text-slate-400">30-day guarantee</p>
                  </div>
                </div>
                <div className="flex items-start gap-2 text-sm">
                  <Zap className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-slate-900 dark:text-white">Customer Care</p>
                    <p className="text-xs text-slate-600 dark:text-slate-400">24/7 support</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Specifications Section */}
        {product.specifications && Object.keys(product.specifications).length > 0 && (
          <div className="mt-12 bg-white dark:bg-slate-800 rounded-xl p-8 border border-slate-200 dark:border-slate-700">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Specifications</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Object.entries(product.specifications).map(([key, value]) => (
                <div key={key} className="pb-4">
                  <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wide mb-1">{key}</p>
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">{String(value)}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}