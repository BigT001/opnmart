'use client';

import Link from 'next/link';
import { Search, ShoppingCart, Menu, Star, TrendingUp, Zap, Gift, Package, User, LogOut, ChevronDown } from 'lucide-react';
import { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { useProducts } from '@/app/context/ProductContext';
import SignUpModal from '@/components/AuthModals/SignUpModal';
import LoginModal from '@/components/AuthModals/LoginModal';

// Cloudinary image URLs (free stock images)
const PRODUCT_IMAGES = {
  phones: 'https://images.unsplash.com/photo-1511707267537-b85faf00021e?w=400&q=80',
  laptop: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&q=80',
  camera: 'https://images.unsplash.com/photo-1606986628025-35d57e735ae0?w=400&q=80',
  fridge: 'https://images.unsplash.com/photo-1584622181563-430f63602d4b?w=400&q=80',
  generator: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=400&q=80',
  tablet: 'https://images.unsplash.com/photo-1542286601-b06b24baf08b?w=400&q=80',
  headphones: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&q=80',
  speakers: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&q=80',
  powerbank: 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=400&q=80',
  microphone: 'https://images.unsplash.com/photo-1590119957829-11112192aa03?w=400&q=80',
  tv: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=400&q=80',
};

const CATEGORIES_CONFIG = [
  {
    id: 'electronics',
    name: 'Electronics',
    icon: '📱',
    neon: 'from-cyan-400 to-green-400',
    subcategories: [
      { id: 'mobile_phones', name: 'Mobile Phones', icon: '📱' },
      { id: 'televisions', name: 'Televisions (TVs)', icon: '📺' },
      { id: 'laptops', name: 'Laptops', icon: '💻' },
      { id: 'tablets', name: 'Tablets', icon: '📱' },
      { id: 'cameras', name: 'Cameras', icon: '📷' },
      { id: 'headphones', name: 'Headphones', icon: '🎧' },
      { id: 'speakers', name: 'Speakers', icon: '🔊' },
      { id: 'microphones', name: 'Microphones', icon: '🎤' },
      { id: 'power_banks', name: 'Power Banks', icon: '🔋' },
    ],
  },
  {
    id: 'appliances',
    name: 'Appliances',
    icon: '🏠',
    neon: 'from-blue-400 to-cyan-400',
    subcategories: [
      { id: 'refrigerators', name: 'Refrigerators & Freezers', icon: '🧊' },
      { id: 'ac', name: 'Air Conditioners', icon: '❄️' },
      { id: 'generators', name: 'Generators & Power', icon: '⚡' },
      { id: 'washing_machines', name: 'Washing Machines', icon: '🌊' },
      { id: 'cookers_ovens', name: 'Cookers & Ovens', icon: '🔥' },
      { id: 'cleaning_appliances', name: 'Cleaning Appliances', icon: '🧹' },
      { id: 'fans_cooling', name: 'Fans & Cooling', icon: '🌀' },
      { id: 'inverter_solar', name: 'Inverter & Solar', icon: '☀️' },
      { id: 'kitchen_appliances', name: 'Kitchen Appliances', icon: '🍽️' },
      { id: 'home_appliances', name: 'Home Appliances', icon: '🏠' },
    ],
  },
  {
    id: 'furniture',
    name: 'Furniture',
    icon: '🛋️',
    neon: 'from-orange-400 to-red-400',
    subcategories: [
      { id: 'sofas', name: 'Sofas & Chairs', icon: '🛋️' },
      { id: 'beds', name: 'Beds & Mattresses', icon: '🛏️' },
      { id: 'tables', name: 'Tables & Desks', icon: '📦' },
      { id: 'storage', name: 'Storage & Shelves', icon: '🗄️' },
      { id: 'lighting', name: 'Lighting', icon: '💡' },
    ],
  },
  {
    id: 'grocery',
    name: 'Grocery Store',
    icon: '🛒',
    neon: 'from-yellow-400 to-orange-400',
    subcategories: [
      { id: 'fresh_produce', name: 'Fresh Produce', icon: '🥬' },
      { id: 'dairy', name: 'Dairy & Eggs', icon: '🥛' },
      { id: 'beverages', name: 'Beverages', icon: '🥤' },
      { id: 'snacks', name: 'Snacks & Treats', icon: '🍪' },
      { id: 'spices', name: 'Spices & Seasonings', icon: '🌶️' },
    ],
  },
];

const FEATURED_PRODUCTS: any[] = [];

export default function Home() {
  const { allProducts } = useProducts();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('electronics');
  const [activeTab, setActiveTab] = useState('all');
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);
  const [expandedMenu, setExpandedMenu] = useState(false);
  const [showSignUpModal, setShowSignUpModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [buyer, setBuyer] = useState<any>(null);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [loading, setLoading] = useState(true);

  // Function to check session
  const checkSession = async () => {
    try {
      console.log('[HOME PAGE] Checking session...');
      const response = await fetch('/api/auth/session', {
        credentials: 'include', // IMPORTANT: Include cookies in the request
      });
      const data = await response.json();
      console.log('[HOME PAGE] Session response:', data);
      
      if (data.buyer) {
        console.log('[HOME PAGE] User logged in:', data.buyer.email);
        setBuyer(data.buyer);
        setShowSignUpModal(false);
        setShowLoginModal(false);
      } else {
        console.log('[HOME PAGE] No user in session');
        setBuyer(null);
      }
    } catch (error) {
      console.error('[HOME PAGE] Failed to check session:', error);
      setBuyer(null);
    } finally {
      setLoading(false);
    }
  };

  // Check if user is logged in on mount and when page becomes visible
  useEffect(() => {
    checkSession();

    // Also check when page becomes visible (e.g., after returning from another page)
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        console.log('[HOME PAGE] Page became visible, refreshing session...');
        checkSession();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  const checkSessionAfterAuth = async () => {
    try {
      console.log('[HOME PAGE] Refreshing session after auth...');
      const response = await fetch('/api/auth/session');
      const data = await response.json();
      console.log('[HOME PAGE] Refreshed session response:', data);
      
      if (data.buyer) {
        console.log('[HOME PAGE] User now logged in:', data.buyer.email);
        setBuyer(data.buyer);
        setShowSignUpModal(false);
        setShowLoginModal(false);
      } else {
        console.log('[HOME PAGE] Still no user after auth');
        setBuyer(null);
      }
    } catch (error) {
      console.error('[HOME PAGE] Failed to refresh session:', error);
      setBuyer(null);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch (error) {
      console.error('Logout error:', error);
    }
    setBuyer(null);
    setShowProfileMenu(false);
    router.push('/');
  };

  const handleProfileClick = () => {
    console.log('[HOME PAGE] handleProfileClick called');
    console.log('[HOME PAGE] buyer._id:', buyer?._id);
    
    if (buyer && buyer._id) {
      const dashboardUrl = `/dashboards/buyer/${buyer._id}`;
      console.log('[HOME PAGE] Navigating to:', dashboardUrl);
      setShowProfileMenu(false);
      
      // Use window.location for hard redirect to ensure it works
      window.location.href = dashboardUrl;
    } else {
      console.error('[HOME PAGE] No buyer or buyer._id found');
    }
  };

  // Build categories with real counts from database
  const CATEGORIES_DATA = useMemo(() => {
    return CATEGORIES_CONFIG.map(category => ({
      ...category,
      subcategories: category.subcategories.map(sub => ({
        ...sub,
        count: allProducts.filter(p => p.subcategory === sub.id).length,
      })),
    }));
  }, [allProducts]);

  const currentCategory = CATEGORIES_DATA.find(c => c.id === activeCategory);
  
  const filteredProducts = useMemo(() => {
    let products = allProducts.filter(p => {
      // Find which category this subcategory belongs to
      const category = CATEGORIES_DATA.find(c => 
        c.subcategories.some(sub => sub.id === p.subcategory)
      );
      return category?.id === activeCategory;
    });
    
    // Filter by selected subcategory
    if (activeTab !== 'all') {
      products = products.filter(p => p.subcategory === activeTab);
    }
    
    // Filter by selected brand
    if (selectedBrand) {
      products = products.filter(p => p.brand === selectedBrand);
    }

    if (searchQuery) {
      products = products.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()));
    }

    return products;
  }, [activeCategory, activeTab, searchQuery, selectedBrand, allProducts, CATEGORIES_DATA]);

  const formatPrice = (price: number) => {
    return '₦' + price.toLocaleString();
  };

  const calculateDiscount = (oldPrice: number, newPrice: number) => {
    return Math.round(((oldPrice - newPrice) / oldPrice) * 100);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white">
      {/* Navigation Header */}
      <header className="sticky top-0 z-50 bg-white/95 dark:bg-black/95 backdrop-blur supports-[backdrop-filter]:bg-white/80 dark:supports-[backdrop-filter]:bg-black/60 shadow-2xl border-b border-green-500/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 font-bold text-2xl flex-shrink-0">
              <span className="text-3xl">🛒</span>
              <span className="bg-gradient-to-r from-green-400 to-cyan-400 bg-clip-text text-transparent">OpnMart</span>
            </Link>

            {/* Search Bar */}
            <div className="hidden md:flex flex-1 max-w-md mx-6">
              <div className="relative w-full">
                <Input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-full bg-gray-100 dark:bg-zinc-900 border border-green-500/50 py-2 pl-4 pr-10 focus:outline-none focus:ring-2 focus:ring-green-500 text-black dark:text-white placeholder-gray-500"
                />
                <Search className="absolute right-3 top-2.5 h-5 w-5 text-green-400" />
              </div>
            </div>

            {/* Right Menu */}
            <div className="flex items-center gap-2 sm:gap-4">
              <ThemeToggle />
              <Link
                href="/cart"
                className="relative p-2 text-gray-700 dark:text-gray-300 hover:text-green-400 transition"
              >
                <ShoppingCart className="h-6 w-6" />
                <span className="absolute -top-1 -right-1 bg-green-500 text-black text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                  0
                </span>
              </Link>

              {/* Divider */}
              <div className="hidden sm:block h-6 w-px bg-green-500/30"></div>

              {/* Profile Menu or Auth Buttons */}
              {buyer ? (
                // Logged In - Account Button with Avatar
                <div className="relative">
                  <button
                    onClick={() => setShowProfileMenu(!showProfileMenu)}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gradient-to-br from-green-500 to-cyan-500 text-black hover:shadow-lg hover:shadow-green-500/50 transition-all duration-300 font-semibold text-sm"
                    title={`${buyer.firstName} ${buyer.lastName}`}
                  >
                    <div className="flex items-center justify-center h-6 w-6 rounded-full bg-black/20 font-bold text-xs">
                      {buyer.firstName.charAt(0).toUpperCase()}
                    </div>
                    <span className="hidden sm:inline">Account</span>
                    <ChevronDown className={`h-4 w-4 transition-transform ${showProfileMenu ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Dropdown Menu */}
                  {showProfileMenu && (
                    <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-zinc-900 rounded-lg shadow-xl border border-green-500/30 z-50 overflow-hidden">
                      <div className="px-4 py-3 border-b border-green-500/20 bg-gray-50 dark:bg-zinc-800">
                        <p className="text-sm font-semibold text-black dark:text-white">{buyer.firstName} {buyer.lastName}</p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">{buyer.email}</p>
                      </div>
                      <button
                        onClick={(e) => {
                          console.log('[HOME PAGE] Dashboard button clicked, event:', e);
                          handleProfileClick();
                        }}
                        className="w-full text-left px-4 py-3 text-sm font-semibold text-black dark:text-white hover:bg-green-50 dark:hover:bg-green-500/10 flex items-center gap-2 transition-colors"
                      >
                        <User className="h-4 w-4 text-green-500" />
                        My Dashboard
                      </button>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-3 text-sm font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 flex items-center gap-2 transition-colors"
                      >
                        <LogOut className="h-4 w-4" />
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                // Not Logged In - Clear Minimal Buttons
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowLoginModal(true)}
                    className="px-3 py-1.5 rounded-md text-xs sm:text-sm font-semibold transition-all duration-300 text-green-600 dark:text-green-400 hover:bg-green-500/10 dark:hover:bg-green-500/20 border border-green-500/50 hover:border-green-500 hover:text-green-700 dark:hover:text-green-300"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => setShowSignUpModal(true)}
                    className="px-3 py-1.5 rounded-md text-xs sm:text-sm font-semibold transition-all duration-300 bg-gradient-to-r from-green-500 to-cyan-500 text-black hover:shadow-lg hover:shadow-green-500/50 transform hover:scale-105 active:scale-95"
                  >
                    Sign Up
                  </button>
                </div>
              )}

              <button className="md:hidden p-2 text-gray-700 dark:text-gray-300 hover:text-green-400">
                <Menu className="h-6 w-6" />
              </button>
            </div>
          </div>

          {/* Mobile Search */}
          <div className="md:hidden pb-4">
            <div className="relative">
              <Input
                type="text"
                placeholder="Search products..."
                className="w-full rounded-full bg-gray-100 dark:bg-zinc-900 border border-green-500/50 py-2 pl-4 pr-10 text-black dark:text-white placeholder-gray-500"
              />
              <Search className="absolute right-3 top-2.5 h-5 w-5 text-green-400" />
            </div>
          </div>
        </div>
      </header>

      {/* Hero Banner - Compact Card */}
      <section className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-8">
        <div className="bg-gradient-to-br from-white via-gray-50 to-white dark:from-black dark:via-zinc-900 dark:to-black rounded-3xl p-8 sm:p-10 text-black dark:text-white relative overflow-hidden border border-green-500/30">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(16,185,129,0.1),transparent)] opacity-40" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(34,197,94,0.1),transparent)] opacity-40" />
          
          <div className="relative z-10 flex items-center justify-between gap-4">
            {/* Left Content */}
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="h-5 w-5 text-green-400 animate-pulse" />
                <span className="text-xs sm:text-sm font-semibold text-green-400 uppercase tracking-widest">MEGA SALE THIS WEEK</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold mb-2">
                Shop Nigeria's Best
                <br />
                <span className="bg-gradient-to-r from-green-400 to-cyan-400 bg-clip-text text-transparent">Electronics & Appliances</span>
              </h1>
              <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 max-w-md">
                Discover thousands of products from trusted sellers. Fast delivery, secure payments, amazing deals.
              </p>
            </div>
            
            {/* Right Visual */}
            <div className="hidden sm:block text-5xl opacity-30">📦</div>
          </div>
        </div>
      </section>

      {/* Category Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Main Category Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 md:gap-4 mb-12">
          {CATEGORIES_DATA.map((category) => (
            <button
              key={category.id}
              onClick={() => {
                setActiveCategory(category.id);
                setActiveTab('all');
              }}
              className={`relative group px-4 sm:px-6 py-3 sm:py-4 rounded-xl sm:rounded-2xl font-bold text-sm sm:text-lg transition-all duration-500 transform overflow-hidden ${
                activeCategory === category.id
                  ? `bg-gradient-to-br ${category.neon} text-black shadow-2xl shadow-green-500/50 scale-105`
                  : 'bg-gradient-to-br from-gray-100 to-gray-50 dark:from-zinc-800 dark:to-zinc-900 text-black dark:text-white border-2 border-gray-200 dark:border-zinc-700 hover:border-green-500 dark:hover:border-green-500 hover:shadow-xl'
              }`}
            >
              {/* Background animation for active state */}
              {activeCategory === category.id && (
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse" />
              )}
              
              <div className="relative z-10 flex items-center gap-1 sm:gap-2 flex-1">
                <span className="text-2xl sm:text-4xl group-hover:scale-125 transition duration-300 flex-shrink-0">{category.icon}</span>
                <div className="text-left min-w-0">
                  <div className="text-xs sm:text-base font-bold leading-tight">{category.name}</div>
                  <div className={`text-[10px] sm:text-xs ${activeCategory === category.id ? 'text-black/70' : 'text-gray-600 dark:text-gray-400'}`}>
                    {category.subcategories.length} sub
                  </div>
                </div>
                <span className="text-sm sm:text-lg group-hover:translate-x-1 transition duration-300 flex-shrink-0">→</span>
              </div>
            </button>
          ))}
        </div>

        {/* Vertical Layout: Sidebar + Products */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-8">
          {/* Left Sidebar - Vertical Subcategory Menu */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 max-h-[calc(100vh-120px)] overflow-y-auto scrollbar-hide bg-white/50 dark:bg-zinc-900/30 backdrop-blur-sm rounded-xl border border-gray-200 dark:border-zinc-800 p-4">
              {/* Header with label */}
              <div className="flex items-center gap-2 mb-4 pb-4 border-b border-gray-200 dark:border-zinc-800">
                <div className="w-1 h-4 bg-gradient-to-b from-green-500 to-cyan-500 rounded-full"></div>
                <p className="text-sm font-bold text-gray-600 dark:text-gray-400 uppercase tracking-widest">
                  {currentCategory?.name}
                </p>
              </div>
              
              {/* Vertical Tabs Container */}
              <div className="flex flex-col gap-2">
                {/* All Category Button */}
                <button
                  onClick={() => {
                    setActiveTab('all');
                    setSelectedBrand(null);
                  }}
                  className={`px-4 py-3 rounded-lg text-sm font-semibold transition-all duration-300 flex items-center gap-2 text-left ${
                    activeTab === 'all'
                      ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-black shadow-md shadow-green-500/30'
                      : 'bg-gray-100 dark:bg-zinc-800/50 text-black dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-zinc-700/50'
                  }`}
                >
                  <span className="text-lg flex-shrink-0">✨</span>
                  <span className="flex-1">All Products</span>
                </button>

                {/* Subcategory Buttons - Limited to 5 items */}
                {currentCategory?.subcategories.slice(0, expandedMenu ? undefined : 5).map((sub) => (
                  <button
                    key={sub.id}
                    onClick={() => {
                      setActiveTab(sub.id);
                      setSelectedBrand(null);
                    }}
                    className={`px-3 py-2 rounded-lg text-xs font-semibold transition-all duration-300 flex items-center gap-2 text-left ${
                      activeTab === sub.id
                        ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-black shadow-md shadow-cyan-500/30'
                        : 'bg-gray-100 dark:bg-zinc-800/50 text-black dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-zinc-700/50'
                    }`}
                  >
                    <span className="text-base flex-shrink-0">{sub.icon}</span>
                    <div className="flex-1 text-left flex items-center justify-between gap-2">
                      <div>{sub.name}</div>
                      <div className={`text-xs font-normal whitespace-nowrap ${
                        activeTab === sub.id ? 'text-black/60' : 'text-gray-500 dark:text-gray-500'
                      }`}>
                        {sub.count}
                      </div>
                    </div>
                  </button>
                ))}

                {/* See More Button - Show if more than 5 items */}
                {currentCategory && currentCategory.subcategories.length > 5 && (
                  <button
                    onClick={() => setExpandedMenu(!expandedMenu)}
                    className="px-4 py-3 rounded-lg text-sm font-semibold transition-all duration-300 flex items-center justify-center gap-2 bg-gradient-to-r from-green-500/20 to-cyan-500/20 text-green-600 dark:text-green-400 hover:from-green-500/40 hover:to-cyan-500/40 border border-green-500/30 dark:border-green-500/50"
                  >
                    <span>{expandedMenu ? '↑ See Less' : '↓ See More'}</span>
                    <span className="text-lg">{expandedMenu ? '⬆' : '⬇'}</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Right Content - Products Grid */}
          <div className="lg:col-span-3">
            {/* Section Header */}
            <div className="mb-8">
              <h2 className="text-3xl sm:text-4xl font-bold text-black dark:text-white mb-6">
                {activeTab === 'all' ? currentCategory?.name : currentCategory?.subcategories.find(s => s.id === activeTab)?.name}
              </h2>
            </div>

            {/* Brand Filter - Square Boxes Grid */}
            <div className="mb-8">
              <div className="flex gap-3 flex-wrap">
                {/* Get all unique brands from current subcategory */}
                {Array.from(new Set(filteredProducts.map(p => p.brand))).map((brand: any) => {
                    const brandEmojiMap: Record<string, string> = {
                      'Samsung': '📱',
                      'Apple': '🍎',
                      'Google': '🔵',
                      'Dell': '💻',
                      'ASUS': '⚙️',
                      'Canon': '📷',
                      'Sony': '🎬',
                      'LG': '❄️',
                      'Elepaq': '⚡',
                      'Honda': '🏍️',
                      'Bose': '🎵',
                      'JBL': '🔊',
                      'Marshall': '🎸',
                      'Anker': '🔋',
                      'Audio-Technica': '🎤',
                      'Shure': '🎙️',
                      'Tecno': '📲',
                      'Infinix': '⚡',
                      'Itel': '🔌',
                      'Nokia': '📞',
                      'Huawei': '🌐',
                      'OPPO': '🎨',
                      'Xiaomi': '🔴',
                      'Vivo': '🎭',
                      'Freeyond': '✨',
                      'Gionee': '💎',
                      'HMD': '🏠',
                      'Umidigi': '🌟',
                    };
                    const brandEmoji = brandEmojiMap[brand as string] || '✨';

                    return (
                      <button
                        key={brand}
                        onClick={() => setSelectedBrand(selectedBrand === brand ? null : brand)}
                        className={`w-16 h-16 sm:w-20 sm:h-20 rounded-xl flex flex-col items-center justify-center gap-1 transition-all duration-300 font-semibold text-xs sm:text-sm ${
                          selectedBrand === brand
                            ? 'bg-gradient-to-br from-green-500 to-cyan-500 text-black shadow-lg shadow-green-500/50 scale-105'
                            : 'bg-gray-100 dark:bg-zinc-800 text-black dark:text-gray-300 hover:bg-green-500/20 dark:hover:bg-green-500/20 border border-gray-200 dark:border-zinc-700'
                        }`}
                      >
                        <span className="text-xl sm:text-2xl">{brandEmoji}</span>
                        <span className="line-clamp-1">{brand}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

            {/* Products Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
              {filteredProducts.map((product) => {
                const discount = product.oldPrice ? calculateDiscount(product.oldPrice, product.price) : 0;
                return (
                  <Link
                    key={product.id}
                    href={`/products/${product.id}`}
                    className="group"
                  >
                    <div className="bg-white dark:bg-zinc-900 rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition duration-300 border border-gray-200 dark:border-zinc-800 h-full flex flex-col">
                      {/* Image Section */}
                      <div className="relative bg-gradient-to-br from-gray-100 to-gray-50 dark:from-zinc-800 dark:to-zinc-900 h-44 sm:h-52 flex items-center justify-center overflow-hidden">
                        <img
                          src={product.image}
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

                        {/* Quick View Button */}
                        <button className="absolute bottom-3 left-3 right-3 py-2 bg-gradient-to-r from-green-500 to-cyan-500 text-black rounded-lg font-semibold text-xs opacity-0 group-hover:opacity-100 transition transform group-hover:translate-y-0 translate-y-2 shadow-md shadow-green-500/50">
                          Quick View
                        </button>
                      </div>

                  {/* Product Info */}
                  <div className="p-4 flex-1 flex flex-col">
                    {/* Product Name */}
                    <h3 className="font-bold text-black dark:text-white mb-3 line-clamp-2 group-hover:text-green-500 transition text-sm leading-snug">
                      {product.name}
                    </h3>

                    {/* Rating */}
                    <div className="flex items-center gap-2 mb-4">
                      <div className="flex text-green-400 gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-3 w-3 ${i < Math.floor(product.rating || 4) ? 'fill-green-400' : 'text-gray-400 dark:text-gray-700'}`}
                          />
                        ))}
                      </div>
                      <span className="text-xs text-gray-600 dark:text-gray-400 font-medium">
                        ({product.reviews || 0})
                      </span>
                    </div>

                    {/* Price Section */}
                    <div className="mb-4 pb-4 border-b border-gray-200 dark:border-zinc-800">
                      <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-black text-transparent bg-gradient-to-r from-green-500 to-cyan-500 bg-clip-text">
                          {formatPrice(product.price)}
                        </span>
                        {product.oldPrice && (
                          <span className="text-xs text-gray-500 dark:text-gray-600 line-through font-medium">
                            {formatPrice(product.oldPrice)}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Add to Cart Button */}
                    <button className="w-full py-3 bg-gradient-to-r from-green-500 to-cyan-500 hover:from-green-400 hover:to-cyan-400 text-black rounded-xl font-bold text-sm transition transform hover:scale-105 shadow-lg shadow-green-500/40 hover:shadow-green-500/60 mt-auto flex items-center justify-center gap-2 group/btn">
                      <ShoppingCart className="h-4 w-4 transition group-hover/btn:scale-110" />
                      <span>Add to Cart</span>
                    </button>
                  </div>
                </div>
              </Link>
            );
          })}
            </div>

            {filteredProducts.length === 0 && (
              <div className="text-center py-16">
                <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-black dark:text-white mb-2">No Products Available</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">Products will appear here once vendors upload them to this category.</p>
                <p className="text-sm text-gray-500 dark:text-gray-500">Start exploring other categories or check back soon!</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-16">
        <div className="bg-gradient-to-r from-green-500/10 to-cyan-500/10 dark:from-green-500/5 dark:to-cyan-500/5 rounded-3xl p-12 sm:p-16 border border-green-500/20 dark:border-green-500/30 backdrop-blur-sm overflow-hidden group cursor-pointer hover:shadow-2xl hover:shadow-green-500/20 transition duration-500 text-center">
          <h2 className="text-4xl sm:text-5xl font-bold mb-4 text-black dark:text-white">
            Become a Vendor
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
            Grow your business on OpnMart. Reach thousands of customers and manage your inventory with our powerful vendor dashboard.
          </p>
          <Link 
            href="/dashboards/vendor" 
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-green-500 to-cyan-500 text-black rounded-xl font-bold text-lg hover:shadow-lg transition transform hover:scale-105"
          >
            Start Selling Now
            <span className="text-xl">→</span>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-50 dark:bg-black border-t border-green-500/30 mt-16">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
            {[
              {
                title: 'About OpnMart',
                links: ['Our Story', 'Careers', 'Press', 'Blog'],
              },
              {
                title: 'Support',
                links: ['Help Center', 'Track Order', 'Returns', 'Contact'],
              },
              {
                title: 'Policies',
                links: ['Privacy', 'Terms', 'Shipping', 'Security'],
              },
              {
                title: 'Follow Us',
                links: ['Facebook', 'Twitter', 'Instagram', 'LinkedIn'],
              },
            ].map((section, i) => (
              <div key={i}>
                <h4 className="font-bold text-green-400 mb-4">{section.title}</h4>
                <ul className="space-y-2">
                  {section.links.map((link, j) => (
                    <li key={j}>
                      <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-green-400 transition text-sm">
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="border-t border-green-500/30 pt-8 text-center text-gray-400 text-sm">
            <p className="text-gray-600 dark:text-gray-400">&copy; 2024 OpnMart. All rights reserved. | Proudly serving Nigeria from Computer Village, Lagos.</p>
          </div>
        </div>
      </footer>

      {/* Auth Modals */}
      <SignUpModal
        isOpen={showSignUpModal}
        onClose={() => setShowSignUpModal(false)}
        onSwitchToLogin={() => {
          setShowSignUpModal(false);
          setShowLoginModal(true);
        }}
      />
      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onSwitchToSignUp={() => {
          setShowLoginModal(false);
          setShowSignUpModal(true);
        }}
      />
    </div>
  );
}

