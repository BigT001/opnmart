'use client';

import Link from 'next/link';
import { Trash2, Plus, Minus, ArrowLeft, AlertCircle } from 'lucide-react';
import { useCart } from '@/app/context/CartContext';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, getCartTotal, clearCart } = useCart();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const router = useRouter();

  const formatPrice = (price: number) => '₦' + price.toLocaleString();

  const subtotal = getCartTotal();
  const tax = Math.round(subtotal * 0.075);
  const total = subtotal + tax; // Shipping will be calculated on checkout page

  const handleCheckout = () => {
    setIsCheckingOut(true);
    // Redirect to checkout page
    router.push('/checkout');
  };

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/95 dark:bg-black/95 backdrop-blur border-b border-green-500/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-bold text-2xl">
            <span className="text-3xl">🛒</span>
            <span className="bg-gradient-to-r from-green-400 to-cyan-400 bg-clip-text text-transparent">OpnMart</span>
          </Link>
          <p className="text-black dark:text-white text-lg font-semibold">Shopping Cart</p>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {cart.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🛒</div>
            <p className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Your cart is empty</p>
            <p className="text-slate-600 dark:text-slate-400 mb-8">Start shopping to add items to your cart!</p>
            <Link 
              href="/products" 
              className="inline-flex items-center gap-2 bg-gradient-to-r from-green-500 to-cyan-500 text-black px-8 py-3 rounded-full font-semibold hover:shadow-lg hover:shadow-green-500/50 transition"
            >
              <ArrowLeft className="w-5 h-5" />
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
                  Cart Items <span className="text-green-500">({cart.length})</span>
                </h2>
                {cart.length > 0 && (
                  <button
                    onClick={clearCart}
                    className="text-red-500 hover:text-red-700 text-sm font-semibold transition"
                  >
                    Clear Cart
                  </button>
                )}
              </div>

              <div className="space-y-4">
                {cart.map((item, index) => (
                  <div
                    key={`${item.id}-${index}`}
                    className="bg-slate-50 dark:bg-slate-900/50 rounded-lg p-6 border border-slate-200 dark:border-green-500/20 hover:border-green-500/50 dark:hover:border-green-500/50 transition flex items-center gap-4"
                  >
                    {/* Image */}
                    <div className="w-24 h-24 bg-slate-200 dark:bg-slate-800 rounded-lg flex-shrink-0 overflow-hidden">
                      <img
                        src={item.image || 'https://via.placeholder.com/100'}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Item Info */}
                    <div className="flex-1">
                      <h3 className="font-bold text-slate-900 dark:text-white mb-1">{item.name}</h3>
                      <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                        {item.brand && <span>{item.brand} • </span>}
                        {item.subcategory}
                      </p>
                      <p className="text-green-600 dark:text-green-400 font-bold">{formatPrice(item.price)}</p>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 rounded-lg border border-slate-300 dark:border-slate-600">
                      <button
                        onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                        className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition p-2"
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="text-slate-900 dark:text-white font-semibold px-3 min-w-[2rem] text-center">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition p-2"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>

                    {/* Item Total */}
                    <div className="text-right min-w-[80px]">
                      <p className="text-sm text-slate-600 dark:text-slate-400">Subtotal</p>
                      <p className="text-lg font-bold text-slate-900 dark:text-white">{formatPrice(item.price * item.quantity)}</p>
                    </div>

                    {/* Remove Button */}
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-slate-400 hover:text-red-500 transition p-2"
                      title="Remove from cart"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-slate-50 dark:bg-slate-900/50 rounded-lg p-6 border border-slate-200 dark:border-green-500/20 sticky top-24 space-y-4">
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Order Summary</h3>

                {/* Items Count */}
                <div className="flex justify-between text-slate-700 dark:text-slate-300 text-sm">
                  <span>{cart.length} item{cart.length !== 1 ? 's' : ''}</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>

                {/* Tax */}
                <div className="flex justify-between text-slate-700 dark:text-slate-300 text-sm border-b border-slate-300 dark:border-slate-700 pb-4">
                  <span>Tax (7.5%)</span>
                  <span>{formatPrice(tax)}</span>
                </div>

                {/* Total */}
                <div className="flex justify-between text-xl font-bold">
                  <span className="text-slate-900 dark:text-white">Total</span>
                  <span className="text-transparent bg-gradient-to-r from-green-500 to-cyan-500 bg-clip-text">
                    {formatPrice(total)}
                  </span>
                </div>

                {/* Checkout Button */}
                <button
                  onClick={handleCheckout}
                  disabled={isCheckingOut || cart.length === 0}
                  className="w-full mt-6 bg-gradient-to-r from-green-500 to-cyan-600 hover:from-green-600 hover:to-cyan-700 disabled:from-slate-400 disabled:to-slate-400 disabled:cursor-not-allowed text-white rounded-lg py-3 font-bold transition shadow-lg hover:shadow-xl"
                >
                  {isCheckingOut ? 'Processing...' : 'Proceed to Checkout'}
                </button>

                {/* Continue Shopping */}
                <Link
                  href="/"
                  className="w-full block text-center bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-900 dark:text-white rounded-lg py-2 font-semibold transition"
                >
                  Continue Shopping
                </Link>

                {/* Trust Badges */}
                <div className="mt-6 pt-6 border-t border-slate-300 dark:border-slate-700 space-y-3 text-xs text-slate-600 dark:text-slate-400">
                  <div className="flex items-center gap-2">
                    <span className="text-green-500">✓</span>
                    <span>Secure & Encrypted</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-green-500">✓</span>
                    <span>Fast Delivery</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-green-500">✓</span>
                    <span>30-Day Money Back</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-green-500">✓</span>
                    <span>24/7 Customer Support</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
