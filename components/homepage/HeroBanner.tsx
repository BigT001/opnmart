'use client';

import Link from 'next/link';
import { Rocket, ChevronDown } from 'lucide-react';

export default function HeroBanner() {
  const handleScrollToProducts = () => {
    const productsSection = document.getElementById('products-section');
    if (productsSection) {
      productsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };
  return (
    <div className="relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-green-500/10 to-transparent rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-bl from-cyan-500/10 to-transparent rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <div className="bg-gradient-to-br from-white via-gray-50 to-white dark:from-black dark:via-zinc-900 dark:to-black rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-10 text-black dark:text-white relative overflow-hidden border border-green-500/30">
        {/* Top Badge */}
        <div className="flex items-center justify-center mb-6 animate-bounce" style={{ animationDuration: '3s' }}>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-green-500/20 to-cyan-500/20 border border-green-500/50">
            <span className="text-lg">⚡</span>
            <span className="text-xs font-bold text-green-500 uppercase tracking-widest">MEGA SALE THIS WEEK</span>
            <span className="text-lg">🎉</span>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center mb-2">
          {/* Left Side - Heading & Description */}
          <div className="text-left">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 leading-tight">
              Welcome to <span className="bg-gradient-to-r from-green-400 via-cyan-400 to-green-400 bg-clip-text text-transparent">OpnMart</span>
              <br />
              <span className="text-xl sm:text-2xl lg:text-3xl text-gray-700 dark:text-gray-300">
                Nigeria's Premier Online Marketplace
              </span>
            </h1>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
              Shop Electronics, Appliances, Fashion & More from Trusted Sellers. Fast Delivery. Secure Payments. Amazing Deals.
            </p>
          </div>

          {/* Right Side - CTA Buttons Grid */}
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={handleScrollToProducts}
              className="relative flex items-center justify-center gap-2 px-6 sm:px-8 py-3 rounded-xl bg-gradient-to-r from-green-500 via-cyan-500 to-green-500 text-white font-bold hover:shadow-2xl hover:shadow-green-500/60 transition-all duration-300 transform hover:scale-110 active:scale-95 text-sm sm:text-base group overflow-hidden"
            >
              {/* Animated background shine effect */}
              <div className="absolute inset-0 bg-white/20 transform -skew-x-12 group-hover:translate-x-full duration-700 transition-transform"></div>
              
              {/* Bouncing arrow with text */}
              <div className="relative animate-bounce" style={{ animationDuration: '2s' }}>
                <ChevronDown className="h-6 w-6 drop-shadow-lg" />
              </div>
              <span className="relative z-10">Shop Now</span>

              {/* Glow effect */}
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-green-400 to-cyan-400 opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-300"></div>
            </button>
            <Link
              href="/auth/vendor-signup"
              className="relative flex items-center justify-center gap-2 px-6 sm:px-8 py-3 rounded-xl bg-white dark:bg-zinc-900 text-black dark:text-white font-bold hover:shadow-lg hover:shadow-green-500/30 transition-all duration-300 transform hover:scale-105 active:scale-95 text-sm sm:text-base border-2 border-green-500/50 hover:border-green-500 group overflow-hidden"
            >
              {/* Animated background */}
              <div className="absolute inset-0 bg-green-500/10 transform -skew-x-12 group-hover:translate-x-full duration-700 transition-transform"></div>
              
              <Rocket className="h-5 w-5 text-green-500 relative z-10" />
              <span className="relative z-10">Start Selling</span>
            </Link>
          </div>
        </div>

        {/* Trust Badges */}
        <div className="flex flex-wrap justify-center gap-4 sm:gap-6 text-xs sm:text-sm">
          {[
            { icon: '✅', text: 'Verified Sellers' },
            { icon: '🛡️', text: 'Secure Checkout' },
            { icon: '⚡', text: 'Fast Delivery' },
            { icon: '💬', text: '24/7 Support' },
          ].map((badge, idx) => (
            <div
              key={idx}
              className="flex items-center gap-2 px-3 py-1 rounded-full bg-gray-100 dark:bg-zinc-800/50 animate-fade-in"
              style={{ animationDelay: `${idx * 150}ms` }}
            >
              <span className="text-base">{badge.icon}</span>
              <span className="font-semibold text-gray-700 dark:text-gray-300">{badge.text}</span>
            </div>
          ))}
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 text-6xl sm:text-8xl opacity-5 pointer-events-none">📦</div>
        <div className="absolute bottom-0 left-0 text-6xl sm:text-8xl opacity-5 pointer-events-none">🛒</div>
      </div>

      {/* Custom Animation Styles */}
      <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.5s ease-out forwards;
          opacity: 0;
        }
      `}</style>
    </div>
  );
}
