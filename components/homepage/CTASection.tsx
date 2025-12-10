'use client';

import Link from 'next/link';

interface CTASectionProps {
  onVendorSignup?: () => void;
}

export default function CTASection({ onVendorSignup }: CTASectionProps) {
  return (
    <div className="col-span-full">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-green-500 via-cyan-500 to-blue-600 p-8 sm:p-12 lg:p-16 shadow-2xl">
        {/* Background decorations */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center text-center">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
            Ready to Start Selling?
          </h2>
          <p className="text-lg sm:text-xl text-white/90 mb-8 max-w-2xl">
            Join thousands of vendors already earning on our marketplace. Get access to millions of customers today.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={onVendorSignup}
              className="px-8 py-4 bg-white text-green-600 font-bold rounded-lg hover:bg-gray-50 transition-all duration-300 shadow-lg hover:shadow-xl active:scale-95"
            >
              Become a Vendor
            </button>
            <Link
              href="/"
              className="px-8 py-4 bg-white/20 backdrop-blur-sm border-2 border-white text-white font-bold rounded-lg hover:bg-white/30 transition-all duration-300"
            >
              Learn More
            </Link>
          </div>

          {/* Stats */}
          <div className="mt-12 grid grid-cols-3 gap-8 pt-8 border-t border-white/20">
            <div>
              <p className="text-3xl font-bold text-white">10K+</p>
              <p className="text-white/80 text-sm mt-2">Active Vendors</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-white">1M+</p>
              <p className="text-white/80 text-sm mt-2">Products</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-white">5M+</p>
              <p className="text-white/80 text-sm mt-2">Customers</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
