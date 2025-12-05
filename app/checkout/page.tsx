'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/app/context/CartContext';
import { Check, Lock, Truck, AlertCircle, MapPin } from 'lucide-react';
import { calculateShipping, getEstimatedDeliveryDate, type ShippingCalculation } from '@/utils/shippingCalculator';

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, getCartTotal, clearCart } = useCart();
  const [step, setStep] = useState(1); // 1: Shipping, 2: Payment, 3: Confirmation
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [shippingCalculation, setShippingCalculation] = useState<ShippingCalculation | null>(null);
  const [estimatedDelivery, setEstimatedDelivery] = useState<Date | null>(null);

  // Form states
  const [shippingInfo, setShippingInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    nearestBusStop: '',
    city: '',
    state: '',
    postalCode: '',
  });

  const [paymentInfo, setPaymentInfo] = useState({
    cardName: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    paymentMethod: 'card', // card, bank, paypal
  });

  const formatPrice = (price: number) => '₦' + price.toLocaleString();

  const subtotal = getCartTotal();
  const shipping = shippingCalculation?.finalCost || 5000;
  const tax = Math.round(subtotal * 0.075);
  const total = subtotal + shipping + tax;

  // Calculate shipping when state changes
  useEffect(() => {
    if (shippingInfo.state.trim()) {
      const calculation = calculateShipping(shippingInfo.state, subtotal);
      setShippingCalculation(calculation);
      
      const deliveryDate = getEstimatedDeliveryDate(shippingInfo.state);
      setEstimatedDelivery(deliveryDate);
    }
  }, [shippingInfo.state, subtotal]);

  if (cart.length === 0 && !orderPlaced) {
    return (
      <div className="min-h-screen bg-white dark:bg-black">
        <header className="sticky top-0 z-40 bg-white/95 dark:bg-black/95 backdrop-blur border-b border-green-500/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 font-bold text-2xl">
              <span className="text-3xl">🛒</span>
              <span className="bg-gradient-to-r from-green-400 to-cyan-400 bg-clip-text text-transparent">OpnMart</span>
            </Link>
          </div>
        </header>
        <div className="max-w-7xl mx-auto px-4 py-16 text-center">
          <p className="text-xl text-slate-600 dark:text-slate-400 mb-4">Your cart is empty</p>
          <Link href="/products" className="inline-block bg-gradient-to-r from-green-500 to-cyan-500 text-black px-6 py-2 rounded-full font-semibold">
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!shippingInfo.firstName || !shippingInfo.email || !shippingInfo.address || !shippingInfo.nearestBusStop) {
      alert('Please fill in all required fields');
      return;
    }
    setStep(2);
  };

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      setOrderPlaced(true);
      setStep(3);
      clearCart();
    }, 2000);
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
          <p className="text-black dark:text-white text-lg font-semibold">Checkout</p>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Step Indicator */}
        {!orderPlaced && (
          <div className="mb-8 flex items-center justify-center gap-4">
            <div className={`flex items-center justify-center w-10 h-10 rounded-full ${step >= 1 ? 'bg-green-500 text-white' : 'bg-slate-300 dark:bg-slate-700 text-slate-600'}`}>
              1
            </div>
            <div className={`h-1 flex-1 ${step >= 2 ? 'bg-green-500' : 'bg-slate-300 dark:bg-slate-700'}`}></div>
            <div className={`flex items-center justify-center w-10 h-10 rounded-full ${step >= 2 ? 'bg-green-500 text-white' : 'bg-slate-300 dark:bg-slate-700 text-slate-600'}`}>
              2
            </div>
            <div className={`h-1 flex-1 ${step >= 3 ? 'bg-green-500' : 'bg-slate-300 dark:bg-slate-700'}`}></div>
            <div className={`flex items-center justify-center w-10 h-10 rounded-full ${step >= 3 ? 'bg-green-500 text-white' : 'bg-slate-300 dark:bg-slate-700 text-slate-600'}`}>
              3
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Order Confirmation */}
            {orderPlaced && (
              <div className="bg-white dark:bg-slate-900 rounded-lg p-8 border border-green-500/30 text-center space-y-6">
                <div className="flex justify-center">
                  <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center animate-pulse">
                    <Check className="w-8 h-8 text-white" />
                  </div>
                </div>
                <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Order Confirmed!</h2>
                <p className="text-slate-600 dark:text-slate-400">
                  Thank you for your purchase. Your order has been placed successfully.
                </p>
                <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-6 space-y-2 text-left">
                  <div className="flex justify-between">
                    <span className="text-slate-600 dark:text-slate-400">Order ID:</span>
                    <span className="font-bold text-slate-900 dark:text-white">#ORD-{Math.random().toString(36).substr(2, 9).toUpperCase()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600 dark:text-slate-400">Status:</span>
                    <span className="font-bold text-green-600 dark:text-green-400">Processing</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600 dark:text-slate-400">Total:</span>
                    <span className="font-bold text-slate-900 dark:text-white">{formatPrice(total)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600 dark:text-slate-400">Delivery:</span>
                    <span className="font-bold text-slate-900 dark:text-white">1-3 Business Days</span>
                  </div>
                </div>
                <div className="flex gap-4 pt-4">
                  <Link
                    href="/products"
                    className="flex-1 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-900 dark:text-white rounded-lg py-3 font-semibold transition"
                  >
                    Continue Shopping
                  </Link>
                  <button
                    onClick={() => router.push('/')}
                    className="flex-1 bg-gradient-to-r from-green-500 to-cyan-500 text-black rounded-lg py-3 font-semibold hover:shadow-lg transition"
                  >
                    Back to Home
                  </button>
                </div>
              </div>
            )}

            {/* Shipping Form */}
            {step === 1 && !orderPlaced && (
              <form onSubmit={handleShippingSubmit} className="space-y-6">
                <div className="bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-950 rounded-2xl p-8 border border-slate-200 dark:border-slate-700 shadow-sm">
                  <div className="flex items-center gap-3 mb-8">
                    <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-cyan-500 rounded-full flex items-center justify-center">
                      <Truck className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-200 bg-clip-text text-transparent">Shipping Information</h3>
                  </div>

                  {/* Personal Information Section */}
                  <div className="mb-8">
                    <h4 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-4">Personal Details</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">First Name *</label>
                        <input
                          type="text"
                          required
                          value={shippingInfo.firstName}
                          onChange={(e) => setShippingInfo({ ...shippingInfo, firstName: e.target.value })}
                          className="w-full px-4 py-3 border-2 border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Last Name *</label>
                        <input
                          type="text"
                          required
                          value={shippingInfo.lastName}
                          onChange={(e) => setShippingInfo({ ...shippingInfo, lastName: e.target.value })}
                          className="w-full px-4 py-3 border-2 border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mt-4">
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Email *</label>
                        <input
                          type="email"
                          required
                          value={shippingInfo.email}
                          onChange={(e) => setShippingInfo({ ...shippingInfo, email: e.target.value })}
                          className="w-full px-4 py-3 border-2 border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Phone *</label>
                        <input
                          type="tel"
                          required
                          value={shippingInfo.phone}
                          onChange={(e) => setShippingInfo({ ...shippingInfo, phone: e.target.value })}
                          className="w-full px-4 py-3 border-2 border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Delivery Address Section */}
                  <div className="mb-8">
                    <h4 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-4">Delivery Address</h4>
                    
                    <div className="mb-4">
                      <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Street Address *</label>
                      <input
                        type="text"
                        required
                        value={shippingInfo.address}
                        onChange={(e) => setShippingInfo({ ...shippingInfo, address: e.target.value })}
                        placeholder="e.g., 123 Main Street"
                        className="w-full px-4 py-3 border-2 border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition"
                      />
                    </div>

                    <div className="mb-4">
                      <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-2">
                        📍 Nearest Bus Stop *
                      </label>
                      <input
                        type="text"
                        required
                        value={shippingInfo.nearestBusStop}
                        onChange={(e) => setShippingInfo({ ...shippingInfo, nearestBusStop: e.target.value })}
                        placeholder="e.g., Lekki Phase 1 Bus Stop"
                        className="w-full px-4 py-3 border-2 border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition"
                      />
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Help riders find your location easily</p>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">City *</label>
                        <input
                          type="text"
                          required
                          value={shippingInfo.city}
                          onChange={(e) => setShippingInfo({ ...shippingInfo, city: e.target.value })}
                          placeholder="e.g., Lagos"
                          className="w-full px-4 py-3 border-2 border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">State *</label>
                        <input
                          type="text"
                          required
                          value={shippingInfo.state}
                          onChange={(e) => setShippingInfo({ ...shippingInfo, state: e.target.value })}
                          placeholder="e.g., Lagos"
                          className="w-full px-4 py-3 border-2 border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Postal Code *</label>
                        <input
                          type="text"
                          required
                          value={shippingInfo.postalCode}
                          onChange={(e) => setShippingInfo({ ...shippingInfo, postalCode: e.target.value })}
                          placeholder="e.g., 100001"
                          className="w-full px-4 py-3 border-2 border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Shipping Cost Preview */}
                  {shippingCalculation && (
                    <div className="mt-8 p-6 bg-gradient-to-r from-green-50 to-cyan-50 dark:from-green-950/30 dark:to-cyan-950/30 rounded-xl border-2 border-green-200 dark:border-green-800/50">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-cyan-500 rounded-full flex items-center justify-center flex-shrink-0">
                          <MapPin className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Shipping Summary</h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between text-slate-700 dark:text-slate-300">
                              <span>Zone:</span>
                              <span className="font-semibold text-slate-900 dark:text-white">{shippingCalculation.zone}</span>
                            </div>
                            <div className="flex justify-between text-slate-700 dark:text-slate-300">
                              <span>Base Cost:</span>
                              <span className="font-semibold text-slate-900 dark:text-white">{formatPrice(shippingCalculation.baseCost)}</span>
                            </div>
                            {shippingCalculation.discount && shippingCalculation.discount > 0 && (
                              <div className="flex justify-between text-green-600 dark:text-green-400 font-semibold bg-white/50 dark:bg-slate-800/50 p-2 rounded">
                                <span>Discount:</span>
                                <span>-{formatPrice(shippingCalculation.discount)}</span>
                              </div>
                            )}
                            <div className="flex justify-between text-slate-700 dark:text-slate-300 pt-2 border-t border-green-200 dark:border-green-800">
                              <span className="font-bold">Final Cost:</span>
                              <span className="text-xl font-bold text-green-600 dark:text-green-400">{formatPrice(shippingCalculation.finalCost)}</span>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400 mt-3 pt-2 border-t border-green-200 dark:border-green-800">
                              <span>⏱️ Estimated:</span>
                              <span className="font-semibold">{estimatedDelivery?.toLocaleDateString('en-NG', { weekday: 'short', month: 'short', day: 'numeric' })}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Google Maps Section */}
                  <div className="mt-8 pt-8 border-t border-slate-300 dark:border-slate-700">
                    <h4 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-4">📍 Pin Your Location</h4>
                    <div className="bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 rounded-xl overflow-hidden border-2 border-slate-300 dark:border-slate-700 shadow-md">
                      <iframe
                        title="Delivery Location Map"
                        width="100%"
                        height="300"
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3964.5380220852776!2d3.4329!3d6.4969!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x103bf53440000001%3A0xa6a03e0cf8e75b8f!2sLagos%2C%20Nigeria!5e0!3m2!1sen!2sng!4v1701000000000"
                        style={{ border: 0, filter: 'invert(1) hue-rotate(180deg)' }}
                        allowFullScreen
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        className="dark:invert dark:hue-rotate-180"
                      ></iframe>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-3">
                      💡 Tip: Providing an accurate location and bus stop helps our riders deliver faster!
                    </p>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-green-500 to-cyan-500 hover:from-green-600 hover:to-cyan-600 text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-xl transition transform hover:-translate-y-0.5"
                >
                  ✓ Continue to Payment
                </button>
              </form>
            )}

            {/* Payment Form */}
            {step === 2 && !orderPlaced && (
              <form onSubmit={handlePaymentSubmit} className="space-y-6">
                <div className="bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-950 rounded-2xl p-8 border border-slate-200 dark:border-slate-700 shadow-sm">
                  <h3 className="text-3xl font-bold text-slate-900 dark:text-white mb-8 flex items-center gap-3">
                    <Lock className="w-6 h-6 text-green-500" />
                    <span>Payment Information</span>
                  </h3>

                  {/* Payment Method Selection */}
                  <div className="mb-8 space-y-3">
                    <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-4">Select Payment Method</p>
                    {['card', 'bank', 'paypal'].map((method) => (
                      <label key={method} className="flex items-center p-4 border-2 rounded-xl cursor-pointer transition"
                        style={{
                          borderColor: paymentInfo.paymentMethod === method ? '#10b981' : '#e2e8f0',
                          backgroundColor: paymentInfo.paymentMethod === method ? '#f0fdf4' : 'transparent'
                        }}
                      >
                        <input
                          type="radio"
                          name="paymentMethod"
                          value={method}
                          checked={paymentInfo.paymentMethod === method}
                          onChange={(e) => setPaymentInfo({ ...paymentInfo, paymentMethod: e.target.value })}
                          className="mr-4 w-5 h-5 cursor-pointer"
                        />
                        <span className="font-semibold text-slate-900 dark:text-white text-lg">
                          {method === 'card' && '💳 Debit/Credit Card'}
                          {method === 'bank' && '🏦 Bank Transfer'}
                          {method === 'paypal' && '🌐 PayPal'}
                        </span>
                      </label>
                    ))}
                  </div>

                  {/* Card Payment Form */}
                  {paymentInfo.paymentMethod === 'card' && (
                    <div className="space-y-4 mb-6">
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Cardholder Name *</label>
                        <input
                          type="text"
                          required
                          value={paymentInfo.cardName}
                          onChange={(e) => setPaymentInfo({ ...paymentInfo, cardName: e.target.value })}
                          className="w-full px-4 py-3 border-2 border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Card Number *</label>
                        <input
                          type="text"
                          required
                          placeholder="1234 5678 9012 3456"
                          value={paymentInfo.cardNumber}
                          onChange={(e) => setPaymentInfo({ ...paymentInfo, cardNumber: e.target.value.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim() })}
                          className="w-full px-4 py-3 border-2 border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Expiry Date *</label>
                          <input
                            type="text"
                            required
                            placeholder="MM/YY"
                            value={paymentInfo.expiryDate}
                            onChange={(e) => setPaymentInfo({ ...paymentInfo, expiryDate: e.target.value })}
                            className="w-full px-4 py-3 border-2 border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">CVV *</label>
                          <input
                            type="text"
                            required
                            placeholder="123"
                            maxLength={3}
                            value={paymentInfo.cvv}
                            onChange={(e) => setPaymentInfo({ ...paymentInfo, cvv: e.target.value })}
                            className="w-full px-4 py-3 border-2 border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {paymentInfo.paymentMethod === 'bank' && (
                    <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg border border-blue-200 dark:border-blue-800 mb-6">
                      <p className="text-sm text-slate-700 dark:text-slate-300">
                        🏦 Bank transfer details will be provided after order confirmation.
                      </p>
                    </div>
                  )}

                  {paymentInfo.paymentMethod === 'paypal' && (
                    <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg border border-blue-200 dark:border-blue-800 mb-6">
                      <p className="text-sm text-slate-700 dark:text-slate-300">
                        🌐 You will be redirected to PayPal to complete your payment.
                      </p>
                    </div>
                  )}
                </div>

                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="flex-1 bg-white dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-900 dark:text-white rounded-xl py-4 font-bold transition"
                  >
                    ← Back
                  </button>
                  <button
                    type="submit"
                    disabled={isProcessing}
                    className="flex-1 bg-gradient-to-r from-green-500 to-cyan-500 hover:from-green-600 hover:to-cyan-600 text-white rounded-xl py-4 font-bold hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-0.5"
                  >
                    {isProcessing ? '⏳ Processing...' : '✓ Place Order'}
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-slate-50 dark:bg-slate-900 rounded-lg p-6 border border-slate-200 dark:border-slate-700 sticky top-24">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Order Summary</h3>

              {/* Items */}
              <div className="space-y-3 mb-6 max-h-64 overflow-y-auto">
                {cart.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span className="text-slate-600 dark:text-slate-400">
                      {item.name} <span className="text-slate-500">x{item.quantity}</span>
                    </span>
                    <span className="font-semibold text-slate-900 dark:text-white">{formatPrice(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="space-y-3 border-t border-slate-300 dark:border-slate-700 pt-4">
                <div className="flex justify-between text-sm text-slate-600 dark:text-slate-400">
                  <span>Subtotal</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm text-slate-600 dark:text-slate-400">
                  <span>Shipping</span>
                  <div className="text-right">
                    <div className="text-green-600 dark:text-green-400 font-semibold">{formatPrice(shipping)}</div>
                    {shippingCalculation && (
                      <div className="text-xs text-slate-500 dark:text-slate-400">{shippingCalculation.zone}</div>
                    )}
                  </div>
                </div>
                <div className="flex justify-between text-sm text-slate-600 dark:text-slate-400">
                  <span>Tax (7.5%)</span>
                  <span>{formatPrice(tax)}</span>
                </div>
                <div className="flex justify-between text-lg font-bold text-slate-900 dark:text-white border-t border-slate-300 dark:border-slate-700 pt-4">
                  <span>Total</span>
                  <span>{formatPrice(total)}</span>
                </div>
              </div>

              {/* Shipping Info */}
              <div className="mt-6 pt-6 border-t border-slate-300 dark:border-slate-700 space-y-2 text-xs text-slate-600 dark:text-slate-400">
                <div className="flex items-start gap-2">
                  <Truck className="w-4 h-4 flex-shrink-0 mt-0.5 text-green-500" />
                  <div>
                    <p className="font-semibold text-slate-900 dark:text-white">Free Shipping on Orders</p>
                    <p>above ₦20,000</p>
                  </div>
                </div>
                <div className="flex items-start gap-2 mt-3">
                  <Lock className="w-4 h-4 flex-shrink-0 mt-0.5 text-green-500" />
                  <div>
                    <p className="font-semibold text-slate-900 dark:text-white">Secure Payment</p>
                    <p>SSL Encrypted</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
