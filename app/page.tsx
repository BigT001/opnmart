'use client';

import { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useProducts } from '@/app/context/ProductContext';
import { useCart } from '@/app/context/CartContext';
import SignUpModal from '@/components/AuthModals/SignUpModal';
import LoginModal from '@/components/AuthModals/LoginModal';
import VerificationModal from '@/components/AuthModals/VerificationModal';

// Import homepage components
import Header from '@/components/homepage/Header';
import HeroBanner from '@/components/homepage/HeroBanner';
import CategoryTabs from '@/components/homepage/CategoryTabs';
import CategorySidebar from '@/components/homepage/CategorySidebar';
import BrandFilter from '@/components/homepage/BrandFilter';
import ProductsGrid from '@/components/homepage/ProductsGrid';
import CTASection from '@/components/homepage/CTASection';
import Footer from '@/components/homepage/Footer';

// Import categories configuration
import { HOMEPAGE_CATEGORIES } from '@/config/homepageCategories';

export default function Home() {
  const router = useRouter();
  const { allProducts } = useProducts();
  const { getCartCount } = useCart();

  // State management
  const [activeCategory, setActiveCategory] = useState('electronics');
  const [activeTab, setActiveTab] = useState('all');
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedMenu, setExpandedMenu] = useState(false);
  const [showSignUpModal, setShowSignUpModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [verificationEmail, setVerificationEmail] = useState('');
  const [verificationToken, setVerificationToken] = useState('');
  const [vendor, setVendor] = useState<any>(null);
  const [buyer, setBuyer] = useState<any>(null);

  // Fetch current user on mount
  useEffect(() => {
    const checkSession = async () => {
      try {
        // Check localStorage for stored user data
        const storedBuyer = localStorage.getItem('buyer');
        const storedVendor = localStorage.getItem('vendor');
        
        if (storedVendor) {
          setVendor(JSON.parse(storedVendor));
          setBuyer(null);
        } else if (storedBuyer) {
          setBuyer(JSON.parse(storedBuyer));
          setVendor(null);
        }
      } catch (error) {
        console.error('Session check error:', error);
      }
    };

    checkSession();

    // Listen for storage changes (e.g., from other tabs or modals)
    const handleStorageChange = () => {
      console.log('[HOME PAGE] Storage changed, refreshing session...');
      checkSession();
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const handleLogout = async () => {
    try {
      // Clear localStorage
      localStorage.removeItem('buyer');
      localStorage.removeItem('vendor');
    } catch (error) {
      console.error('Logout error:', error);
    }
    setBuyer(null);
    setVendor(null);
    router.push('/');
  };

  const handleProfileClick = () => {
    if (vendor && vendor._id) {
      const dashboardUrl = `/dashboards/vendor/${vendor._id}`;
      window.location.href = dashboardUrl;
    } else if (buyer && buyer._id) {
      const dashboardUrl = `/dashboards/buyer/${buyer._id}`;
      window.location.href = dashboardUrl;
    }
  };

  // Get current category data
  const currentCategory = HOMEPAGE_CATEGORIES.find((cat: any) => cat.id === activeCategory);

  // Filter products based on category, tab, brand, and search
  const filteredProducts = useMemo(() => {
    let products = (allProducts || []) as any[];

    // Filter by brand
    if (selectedBrand) {
      products = products.filter(p => p.brand === selectedBrand);
    }

    // Filter by search query
    if (searchQuery) {
      products = products.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return products;
  }, [selectedBrand, searchQuery, allProducts]);

  // Get unique brands from current filtered products
  const categoryBrands = useMemo(() => {
    return Array.from(new Set(filteredProducts.map((p: any) => p.brand).filter(Boolean))) as string[];
  }, [filteredProducts]);

  // Debug logging
  useEffect(() => {
    console.log('[HOME PAGE] Debug info:', {
      allProductsCount: allProducts?.length || 0,
      filteredProductsCount: filteredProducts.length,
      activeCategory,
      activeTab,
      selectedBrand,
      searchQuery,
    });
  }, [allProducts, filteredProducts, activeCategory, activeTab, selectedBrand, searchQuery]);

  return (
    <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white">
      {/* Navigation Header */}
      <Header
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        vendor={vendor}
        buyer={buyer}
        onLogout={handleLogout}
        onProfileClick={handleProfileClick}
        onSignUpClick={() => setShowSignUpModal(true)}
        onSignInClick={() => setShowLoginModal(true)}
      />

      {/* Hero Banner Section */}
      <section className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-6 sm:py-8">
        <HeroBanner />
      </section>

      {/* Category Tabs and Products Section */}
      <section id="products-section" className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-8 sm:py-12">
        {/* Category Tabs */}
        <div className="mb-6 sm:mb-8">
          <CategoryTabs
            categories={HOMEPAGE_CATEGORIES}
            activeCategory={activeCategory}
            onCategoryChange={(categoryId) => {
              setActiveCategory(categoryId);
              setActiveTab('all');
              setSelectedBrand(null);
              setExpandedMenu(false);
            }}
          />
        </div>

        {/* Products and Filters Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-3 lg:gap-4 items-start">
          {/* Category Sidebar */}
          <CategorySidebar
            categoryName={currentCategory?.name || 'Category'}
            subcategories={currentCategory?.subcategories || []}
            activeTab={activeTab}
            onTabChange={(tabId) => {
              setActiveTab(tabId);
              setSelectedBrand(null);
            }}
            expandedMenu={expandedMenu}
            onExpandMenu={() => setExpandedMenu(!expandedMenu)}
          />

          {/* Products Section */}
          <div className="lg:col-span-4 space-y-6">
            {/* Brand Filter */}
            {activeTab !== 'all' && categoryBrands.length > 0 && (
              <BrandFilter
                brands={categoryBrands}
                selectedBrand={selectedBrand}
                onBrandSelect={setSelectedBrand}
              />
            )}

            {/* Products Grid */}
            <ProductsGrid
              products={filteredProducts}
              isLoading={false}
              emptyMessage="No products found. Try adjusting your filters."
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-16">
        <CTASection
          onVendorSignup={() => router.push('/auth/vendor-signup')}
        />
      </section>

      {/* Footer */}
      <footer>
        <Footer />
      </footer>

      {/* Auth Modals */}
      <SignUpModal
        isOpen={showSignUpModal}
        onClose={() => {
          setShowSignUpModal(false);
          // Refresh buyer state after signup modal closes
          const storedBuyer = localStorage.getItem('buyer');
          if (storedBuyer) {
            setBuyer(JSON.parse(storedBuyer));
          }
        }}
        onSwitchToLogin={() => {
          setShowSignUpModal(false);
          setShowLoginModal(true);
        }}
        onSignUpSuccess={(email: string, token: string) => {
          setVerificationEmail(email);
          setVerificationToken(token);
          setShowSignUpModal(false);
          setShowVerificationModal(true);
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
      <VerificationModal
        isOpen={showVerificationModal}
        email={verificationEmail}
        token={verificationToken}
        onVerificationComplete={() => {
          setShowVerificationModal(false);
          // Refresh buyer state after verification
          const storedBuyer = localStorage.getItem('buyer');
          if (storedBuyer) {
            setBuyer(JSON.parse(storedBuyer));
          }
        }}
        onClose={() => setShowVerificationModal(false)}
      />
    </div>
  );
}
