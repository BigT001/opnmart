'use client';

import Link from 'next/link';
import { Search, ShoppingCart, Menu, X, User, LogOut, ChevronDown } from 'lucide-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { useCart } from '@/app/context/CartContext';

interface HeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  vendor?: any;
  buyer?: any;
  onLogout: () => void;
  onProfileClick: () => void;
  onSignUpClick: () => void;
  onSignInClick: () => void;
}

export default function Header({
  searchQuery,
  onSearchChange,
  vendor,
  buyer,
  onLogout,
  onProfileClick,
  onSignUpClick,
  onSignInClick,
}: HeaderProps) {
  const { getCartCount } = useCart();
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/95 dark:bg-black/95 backdrop-blur supports-[backdrop-filter]:bg-white/80 dark:supports-[backdrop-filter]:bg-black/60 shadow-lg border-b border-green-500/30">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
        {/* Main Header Row */}
        <div className="flex items-center justify-between h-16 gap-3">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-1.5 sm:gap-2 font-bold flex-shrink-0">
            <span className="text-2xl sm:text-3xl">🛒</span>
            <span className="text-lg sm:text-2xl bg-gradient-to-r from-green-400 to-cyan-400 bg-clip-text text-transparent font-bold hidden sm:inline">
              OpnMart
            </span>
            <span className="text-lg sm:hidden bg-gradient-to-r from-green-400 to-cyan-400 bg-clip-text text-transparent font-bold">
              OM
            </span>
          </Link>

          {/* Desktop Search Bar */}
          <div className="hidden md:flex flex-1 max-w-sm mx-4 lg:max-w-md">
            <div className="relative w-full">
              <Input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full rounded-full bg-gray-100 dark:bg-zinc-900 border border-green-500/50 py-2 pl-4 pr-10 focus:outline-none focus:ring-2 focus:ring-green-500 text-black dark:text-white placeholder-gray-500 text-sm"
              />
              <Search className="absolute right-3 top-2.5 h-5 w-5 text-green-400 pointer-events-none" />
            </div>
          </div>

          {/* Right Menu */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Mobile Search Toggle */}
            <button
              onClick={() => setShowMobileSearch(!showMobileSearch)}
              className="md:hidden p-2 hover:bg-green-100/50 dark:hover:bg-green-500/10 rounded-lg transition text-gray-700 dark:text-gray-300 hover:text-green-500"
            >
              <Search className="h-5 w-5" />
            </button>

            {/* Theme Toggle */}
            <div className="hidden sm:block">
              <ThemeToggle />
            </div>

            {/* Cart Icon */}
            <Link
              href="/cart"
              className="relative p-2 hover:bg-green-100/50 dark:hover:bg-green-500/10 rounded-lg transition text-gray-700 dark:text-gray-300 hover:text-green-500"
            >
              <ShoppingCart className="h-5 w-5 sm:h-6 sm:w-6" />
              {getCartCount() > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-green-500 text-black text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                  {getCartCount()}
                </span>
              )}
            </Link>

            {/* Divider */}
            <div className="hidden sm:block h-6 w-px bg-green-500/30"></div>

            {/* Profile Menu or Auth Buttons */}
            {vendor || buyer ? (
              <div className="relative hidden sm:block">
                <button
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="flex items-center gap-2 px-2 sm:px-3 py-1.5 rounded-lg bg-gradient-to-br from-green-500 to-cyan-500 text-black hover:shadow-lg hover:shadow-green-500/50 transition-all duration-300 font-semibold text-xs sm:text-sm whitespace-nowrap"
                >
                  <div className="flex items-center justify-center h-5 w-5 sm:h-6 sm:w-6 rounded-full bg-black/20 font-bold text-xs">
                    {vendor
                      ? vendor.storeName?.charAt(0).toUpperCase() || vendor.tradingName?.charAt(0).toUpperCase()
                      : buyer?.firstName?.charAt(0).toUpperCase() || buyer?.name?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <span className="hidden sm:inline">Account</span>
                  <ChevronDown className={`h-3 w-3 sm:h-4 sm:w-4 transition-transform ${showProfileMenu ? 'rotate-180' : ''}`} />
                </button>

                {showProfileMenu && (
                  <div className="absolute right-0 mt-2 w-52 bg-white dark:bg-zinc-900 rounded-lg shadow-xl border border-green-500/30 z-50 overflow-hidden">
                    <button
                      onClick={onProfileClick}
                      className="w-full text-left px-4 py-3 text-sm font-semibold text-black dark:text-white hover:bg-green-50 dark:hover:bg-green-500/10 flex items-center gap-2 transition-colors"
                    >
                      <User className="h-4 w-4 text-green-500" />
                      {vendor ? 'Vendor Dashboard' : 'My Dashboard'}
                    </button>
                    <button
                      onClick={onLogout}
                      className="w-full text-left px-4 py-3 text-sm font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 flex items-center gap-2 transition-colors"
                    >
                      <LogOut className="h-4 w-4" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="hidden sm:flex gap-2">
                <button
                  onClick={onSignInClick}
                  className="px-3 py-1.5 text-sm font-semibold text-green-600 dark:text-green-400 hover:bg-green-500/10 rounded-lg transition"
                >
                  Sign In
                </button>
                <button
                  onClick={onSignUpClick}
                  className="px-3 py-1.5 text-sm font-semibold bg-gradient-to-r from-green-500 to-cyan-500 text-black rounded-lg hover:shadow-lg transition"
                >
                  Sign Up
                </button>
              </div>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="md:hidden p-2 hover:bg-green-100/50 dark:hover:bg-green-500/10 rounded-lg transition"
            >
              {showMobileMenu ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        {showMobileSearch && (
          <div className="md:hidden pb-3 border-t border-green-500/20">
            <div className="relative w-full">
              <Input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full rounded-full bg-gray-100 dark:bg-zinc-900 border border-green-500/50 py-2 pl-4 pr-10 focus:outline-none focus:ring-2 focus:ring-green-500 text-black dark:text-white placeholder-gray-500 text-sm"
              />
              <Search className="absolute right-3 top-2.5 h-5 w-5 text-green-400 pointer-events-none" />
            </div>
          </div>
        )}

        {/* Mobile Menu Drawer */}
        {showMobileMenu && (
          <div className="md:hidden pb-4 border-t border-green-500/20 animate-in fade-in slide-in-from-top-2">
            <div className="space-y-2 pt-3">
              <div className="px-2 py-2 flex items-center justify-between hover:bg-green-100/50 dark:hover:bg-green-500/10 rounded-lg transition">
                <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Theme</span>
                <ThemeToggle />
              </div>

              {!(vendor || buyer) && (
                <>
                  <button
                    onClick={() => {
                      onSignInClick();
                      setShowMobileMenu(false);
                    }}
                    className="w-full px-3 py-2.5 text-sm font-semibold text-center text-green-600 dark:text-green-400 hover:bg-green-500/10 border border-green-500/50 rounded-lg transition"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => {
                      onSignUpClick();
                      setShowMobileMenu(false);
                    }}
                    className="w-full px-3 py-2.5 text-sm font-semibold text-center bg-gradient-to-r from-green-500 to-cyan-500 text-black rounded-lg hover:shadow-lg transition"
                  >
                    Sign Up
                  </button>
                </>
              )}

              {vendor || buyer && (
                <>
                  <button
                    onClick={() => {
                      onProfileClick();
                      setShowMobileMenu(false);
                    }}
                    className="w-full text-left px-3 py-2.5 text-sm font-semibold text-black dark:text-white hover:bg-green-50 dark:hover:bg-green-500/10 rounded-lg flex items-center gap-2 transition-colors"
                  >
                    <User className="h-4 w-4 text-green-500" />
                    {vendor ? 'Vendor Dashboard' : 'My Dashboard'}
                  </button>
                  <button
                    onClick={() => {
                      onLogout();
                      setShowMobileMenu(false);
                    }}
                    className="w-full text-left px-3 py-2.5 text-sm font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg flex items-center gap-2 transition-colors"
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
