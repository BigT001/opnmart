'use client';

import Link from 'next/link';
import { ChevronLeft, Trash2, Plus, Minus } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

export default function CartPage() {
  const [cartItems, setCartItems] = useState<any[]>([]);

  const updateQuantity = (id: number, quantity: number) => {
    if (quantity < 1) return;
    setCartItems(cartItems.map(item =>
      item.id === id ? { ...item, quantity } : item
    ));
  };

  const removeItem = (id: number) => {
    setCartItems(cartItems.filter(item => item.id !== id));
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => {
      const price = parseInt(item.price.replace(/[^0-9]/g, ''));
      return total + (price * item.quantity);
    }, 0);
  };

  const formatPrice = (price: number) => {
    return '₦' + price.toLocaleString();
  };

  const subtotal = calculateTotal();
  const shipping = 5000;
  const tax = Math.round(subtotal * 0.075);
  const total = subtotal + shipping + tax;

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-black/95 backdrop-blur border-b border-green-500/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-bold text-2xl">
            <span className="text-3xl">🛒</span>
            <span className="bg-gradient-to-r from-green-400 to-cyan-400 bg-clip-text text-transparent">OpnMart</span>
          </Link>
          <p className="text-white text-lg font-semibold">Shopping Cart</p>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {cartItems.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-2xl text-gray-400 mb-4">Your cart is empty</p>
            <Link href="/" className="bg-gradient-to-r from-green-500 to-cyan-500 text-black px-6 py-3 rounded-full font-semibold hover:shadow-lg hover:shadow-green-500/50 transition inline-block">
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <h2 className="text-3xl font-bold text-white mb-6">Cart Items ({cartItems.length})</h2>
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="bg-zinc-900/50 rounded-lg p-6 border border-green-500/20 hover:border-green-500/50 transition flex items-center gap-4"
                  >
                    {/* Image */}
                    <div className="w-24 h-24 bg-gradient-to-br from-zinc-800 to-black rounded-lg flex items-center justify-center flex-shrink-0">
                      <span className="text-4xl">{item.image}</span>
                    </div>

                    {/* Item Info */}
                    <div className="flex-1">
                      <h3 className="font-bold text-white mb-1">{item.name}</h3>
                      <p className="text-green-400 font-semibold">{item.price}</p>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center gap-3 bg-zinc-800 rounded-lg p-2 border border-green-500/30">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="text-gray-300 hover:text-green-400 transition"
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="text-white font-semibold px-3">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="text-gray-300 hover:text-green-400 transition"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>

                    {/* Remove Button */}
                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-gray-400 hover:text-red-400 transition p-2"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-zinc-900/50 rounded-lg p-6 border border-green-500/20 sticky top-24 space-y-4">
                <h3 className="text-2xl font-bold text-white mb-6">Order Summary</h3>

                {/* Subtotal */}
                <div className="flex justify-between text-white/80">
                  <span>Subtotal:</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>

                {/* Shipping */}
                <div className="flex justify-between text-white/80">
                  <span>Shipping:</span>
                  <span className="text-green-400">{formatPrice(shipping)}</span>
                </div>

                {/* Tax */}
                <div className="flex justify-between text-white/80 border-b border-green-500/30 pb-4">
                  <span>Tax (7.5%):</span>
                  <span>{formatPrice(tax)}</span>
                </div>

                {/* Total */}
                <div className="flex justify-between text-xl font-bold text-transparent bg-gradient-to-r from-green-400 to-cyan-400 bg-clip-text">
                  <span>Total:</span>
                  <span>{formatPrice(total)}</span>
                </div>

                {/* Promo Code */}
                <div className="mt-6 space-y-2">
                  <label className="text-sm text-gray-400">Promo Code</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Enter code..."
                      className="flex-1 bg-zinc-800 border border-green-500/30 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                    <button className="bg-green-500/10 border border-green-500/30 hover:bg-green-500/20 text-green-400 px-4 py-2 rounded-lg font-semibold transition">
                      Apply
                    </button>
                  </div>
                </div>

                {/* Checkout Button */}
                <button className="w-full mt-6 bg-gradient-to-r from-green-500 to-cyan-500 text-black rounded-lg py-3 font-semibold hover:shadow-lg hover:shadow-green-500/50 transition">
                  Proceed to Checkout
                </button>

                {/* Trust Badges */}
                <div className="mt-6 space-y-3 text-xs text-gray-400">
                  <div className="flex items-center gap-2">
                    <span>✓</span>
                    <span>Secure Checkout</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>✓</span>
                    <span>Fast Delivery (1-3 days)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>✓</span>
                    <span>Easy Returns</span>
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
