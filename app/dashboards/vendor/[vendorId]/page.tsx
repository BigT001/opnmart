'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import {
  BarChart3,
  Package,
  ShoppingCart,
  DollarSign,
  LogOut,
  Menu,
  X,
  Settings,
  Store,
  Wallet,
  MessageSquare,
  Star,
  BarChart2,
  HelpCircle,
} from 'lucide-react';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import Overview from './components/Overview/Overview';
import Products from './components/Products/Products';
import Orders from './components/Orders/Orders';
import Revenue from './components/Revenue/Revenue';
import WalletComponent from './components/Wallet/Wallet';
import Messages from './components/Messages/Messages';
import Reviews from './components/Reviews/Reviews';
import Reports from './components/Reports/Reports';
import Support from './components/Support/Support';
import SettingsComponent from './components/Settings/Settings';

const waveStyle = `
  @keyframes wave {
    0% { transform: rotate(0deg); }
    10% { transform: rotate(14deg); }
    20% { transform: rotate(-8deg); }
    30% { transform: rotate(14deg); }
    40% { transform: rotate(-4deg); }
    50% { transform: rotate(10deg); }
    60% { transform: rotate(0deg); }
    100% { transform: rotate(0deg); }
  }
  .wave-hand {
    display: inline-block;
    animation: wave 2s ease-in-out infinite;
    transform-origin: 70% 70%;
  }
`;

export default function VendorDashboard() {
  const router = useRouter();
  const params = useParams();
  const vendorId = params.vendorId as string;

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [vendor, setVendor] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showWelcomeHeader, setShowWelcomeHeader] = useState(true);

  // Fetch vendor session and verify vendorId matches
  useEffect(() => {
    const fetchSession = async () => {
      try {
        console.log('[VENDOR_DASHBOARD] fetchSession called for vendorId:', vendorId);
        const storedVendor = localStorage.getItem('vendor');
        if (!storedVendor) {
          console.log('[VENDOR_DASHBOARD] No vendor in localStorage, redirecting to home');
          setError('Unauthorized: You must be a registered vendor to access this page');
          setTimeout(() => router.push('/'), 2000);
          return;
        }

        const data = JSON.parse(storedVendor);
        console.log('[VENDOR_DASHBOARD] Vendor data:', data);

        console.log('[VENDOR_DASHBOARD] Checking authorization: vendor._id =', data._id, 'vendorId =', vendorId);

        // SECURITY: Verify that the logged-in vendor's ID matches the requested vendorId
        if (data._id !== vendorId) {
          console.error('[VENDOR_DASHBOARD] Authorization failed: vendor trying to access different dashboard');
          setError('Unauthorized: You cannot access another vendor\'s dashboard');
          setTimeout(() => router.push('/'), 2000);
          return;
        }

        console.log('[VENDOR_DASHBOARD] Authorization successful, setting vendor');
        console.log('[VENDOR_DASHBOARD] Vendor data:', {
          name: data.name,
          email: data.email,
          role: data.role,
          _id: data._id,
        });
        setVendor(data);
      } catch (error) {
        console.error('[VENDOR_DASHBOARD] Error fetching session:', error);
        setError('Error loading vendor session');
        setTimeout(() => router.push('/'), 2000);
      } finally {
        setLoading(false);
      }
    };

    fetchSession();
  }, [router, vendorId]);

  // Auto-hide welcome header after 30 seconds when viewing overview tab
  useEffect(() => {
    if (activeTab === 'overview' && showWelcomeHeader) {
      const timer = setTimeout(() => {
        setShowWelcomeHeader(false);
      }, 30000); // 30 seconds

      return () => clearTimeout(timer);
    }
  }, [activeTab, showWelcomeHeader]);

  // Show welcome header again when user leaves and returns to overview
  useEffect(() => {
    if (activeTab === 'overview') {
      setShowWelcomeHeader(true);
    }
  }, [activeTab]);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch (error) {
      console.error('Logout error:', error);
    }
    router.push('/');
  };

  const navItems = [
    {
      id: 'overview',
      label: 'Overview',
      icon: BarChart3,
      description: 'Dashboard & Analytics',
    },
    {
      id: 'products',
      label: 'Products',
      icon: Package,
      description: 'Manage your products',
    },
    {
      id: 'orders',
      label: 'Orders',
      icon: ShoppingCart,
      description: 'Order management',
    },
    {
      id: 'revenue',
      label: 'Revenue',
      icon: DollarSign,
      description: 'Financial reports',
    },
    {
      id: 'wallet',
      label: 'Wallet',
      icon: Wallet,
      description: 'Payment & Payouts',
    },
    {
      id: 'messages',
      label: 'Messages',
      icon: MessageSquare,
      description: 'Customer messages',
    },
    {
      id: 'reviews',
      label: 'Reviews',
      icon: Star,
      description: 'Customer reviews',
    },
    {
      id: 'reports',
      label: 'Reports',
      icon: BarChart2,
      description: 'Business reports',
    },
    {
      id: 'support',
      label: 'Support',
      icon: HelpCircle,
      description: 'Help & Support',
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: Settings,
      description: 'Store settings',
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
          <p>Loading vendor dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <p className="text-red-600 dark:text-red-400 font-semibold mb-4">{error}</p>
          <p className="text-gray-600 dark:text-gray-400">Redirecting to home...</p>
        </div>
      </div>
    );
  }

  if (!vendor) {
    return null;
  }

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-black text-black dark:text-white transition-colors duration-200">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? 'w-64' : 'w-20'
        } bg-white dark:bg-zinc-900 border-r border-gray-200 dark:border-zinc-800 transition-all duration-300 flex flex-col`}
      >
        <div className="p-6 flex items-center justify-between">
          <Link href="/" className={`flex items-center gap-2 ${sidebarOpen ? '' : 'justify-center'}`}>
            <Store className="w-6 h-6 text-green-500" />
            {sidebarOpen && <span className="font-bold text-lg">OpnMart</span>}
          </Link>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-1 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded transition flex-shrink-0"
          >
            {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        <nav className="flex-1 px-4 py-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg transition ${
                  activeTab === item.id
                    ? 'bg-green-500 text-white'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-zinc-800'
                }`}
                title={sidebarOpen ? '' : item.label}
              >
                <Icon className="h-5 w-5 flex-shrink-0" />
                {sidebarOpen && <span>{item.label}</span>}
              </button>
            );
          })}
        </nav>

        <div className="border-t border-gray-200 dark:border-zinc-800 p-4 space-y-2">
          <div className={`flex items-center ${sidebarOpen ? 'gap-2' : 'justify-center'}`}>
            <ThemeToggle />
            {sidebarOpen && <span className="text-sm text-gray-600 dark:text-gray-400">Theme</span>}
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition"
          >
            <LogOut className="h-5 w-5 flex-shrink-0" />
            {sidebarOpen && <span className="font-semibold">Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <style>{waveStyle}</style>
        <div className="p-8">
          {/* Top Section with Welcome Message */}
          <div className="flex items-start justify-between mb-8">
            {activeTab === 'overview' && showWelcomeHeader && (
              <div>
                <h2 className="text-4xl font-bold mb-2">Welcome back, {vendor?.storeName}! <span className="wave-hand">🏪</span></h2>
                <p className="text-gray-600 dark:text-gray-400">
                  Manage your store, products, and orders efficiently
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">Vendor ID: {vendorId}</p>
              </div>
            )}
          </div>

          {/* Render Components Based on Active Tab */}
          {activeTab === 'overview' && <Overview vendor={vendor} vendorId={vendorId} />}
          {activeTab === 'products' && <Products />}
          {activeTab === 'orders' && <Orders />}
          {activeTab === 'revenue' && <Revenue />}
          {activeTab === 'wallet' && <WalletComponent />}
          {activeTab === 'messages' && <Messages />}
          {activeTab === 'reviews' && <Reviews />}
          {activeTab === 'reports' && <Reports />}
          {activeTab === 'support' && <Support />}
          {activeTab === 'settings' && <SettingsComponent vendor={vendor} />}
        </div>
      </main>
    </div>
  );
}
