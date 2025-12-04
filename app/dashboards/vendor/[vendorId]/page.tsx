'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
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
  TrendingUp,
  Users,
  Bell,
  Plus,
  Edit2,
} from 'lucide-react';

export default function VendorDashboard() {
  const router = useRouter();
  const params = useParams();
  const vendorId = params.vendorId as string;

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [vendor, setVendor] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch vendor session and verify vendorId matches
  useEffect(() => {
    const fetchSession = async () => {
      try {
        console.log('[VENDOR_DASHBOARD] fetchSession called for vendorId:', vendorId);
        const response = await fetch('/api/auth/session', {
          credentials: 'include',
        });
        const data = await response.json();
        console.log('[VENDOR_DASHBOARD] Session data:', data);

        if (!data.vendor) {
          // Not logged in, redirect to home
          console.log('[VENDOR_DASHBOARD] No vendor in session, redirecting to home');
          router.push('/');
          return;
        }

        console.log('[VENDOR_DASHBOARD] Vendor found:', data.vendor.email);
        console.log('[VENDOR_DASHBOARD] Checking authorization: vendor._id =', data.vendor._id, 'vendorId =', vendorId);

        // SECURITY: Verify that the logged-in vendor's ID matches the requested vendorId
        if (data.vendor._id !== vendorId) {
          console.error('[VENDOR_DASHBOARD] Authorization failed: vendor trying to access different dashboard');
          setError('Unauthorized: You cannot access another vendor\'s dashboard');
          setTimeout(() => router.push('/'), 2000);
          return;
        }

        console.log('[VENDOR_DASHBOARD] Authorization successful, setting vendor');
        console.log('[VENDOR_DASHBOARD] Vendor data:', {
          storeName: data.vendor.storeName,
          email: data.vendor.email,
          businessCategory: data.vendor.businessCategory,
          _id: data.vendor._id,
        });
        setVendor(data.vendor);
      } catch (error) {
        console.error('[VENDOR_DASHBOARD] Error fetching session:', error);
        router.push('/');
      } finally {
        setLoading(false);
      }
    };

    fetchSession();
  }, [router, vendorId]);

  // Dummy data for demonstration
  const vendorStats = {
    totalProducts: vendor?.totalProducts || 0,
    totalOrders: vendor?.totalOrders || 0,
    totalRevenue: vendor?.totalRevenue || 0,
    storeRating: vendor?.storeRating || 0,
  };

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
            className={`p-1 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded transition ${
              sidebarOpen ? '' : 'hidden'
            }`}
          >
            {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
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
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition"
          >
            <LogOut className="h-5 w-5 flex-shrink-0" />
            {sidebarOpen && <span className="font-semibold">Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="p-8">
          {/* Top Section with Welcome Message and Theme Toggle */}
          <div className="flex items-start justify-between mb-8">
            <div>
              <h2 className="text-4xl font-bold mb-2">Welcome back, {vendor?.storeName}! 🏪</h2>
              <p className="text-gray-600 dark:text-gray-400">
                Manage your store, products, and orders efficiently
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">Vendor ID: {vendorId}</p>
            </div>
            <ThemeToggle />
          </div>

          {/* Content based on active tab */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {[
                  {
                    label: 'Total Products',
                    value: vendorStats.totalProducts,
                    icon: Package,
                    color: 'from-blue-400 to-blue-600',
                  },
                  {
                    label: 'Total Orders',
                    value: vendorStats.totalOrders,
                    icon: ShoppingCart,
                    color: 'from-green-400 to-green-600',
                  },
                  {
                    label: 'Total Revenue',
                    value: `₦${(vendorStats.totalRevenue / 1000).toFixed(1)}K`,
                    icon: DollarSign,
                    color: 'from-purple-400 to-purple-600',
                  },
                  {
                    label: 'Store Rating',
                    value: `${vendorStats.storeRating}/5.0`,
                    icon: TrendingUp,
                    color: 'from-orange-400 to-orange-600',
                  },
                ].map((stat, i) => {
                  const Icon = stat.icon;
                  return (
                    <div
                      key={i}
                      className="bg-white dark:bg-zinc-900 rounded-lg p-6 border border-gray-200 dark:border-zinc-800"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-gray-600 dark:text-gray-400 text-sm">{stat.label}</p>
                          <p className="text-3xl font-bold mt-2">{stat.value}</p>
                        </div>
                        <div className={`bg-gradient-to-br ${stat.color} p-3 rounded-lg`}>
                          <Icon className="h-6 w-6 text-white" />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Store Information */}
              <div className="bg-white dark:bg-zinc-900 rounded-lg p-6 border border-gray-200 dark:border-zinc-800">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <Store className="h-5 w-5 text-green-500" />
                  Store Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">Store Name</p>
                    <p className="text-lg font-semibold">{vendor?.storeName}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">Business Category</p>
                    <p className="text-lg font-semibold">{vendor?.businessCategory}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">Email</p>
                    <p className="text-lg font-semibold">{vendor?.email}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">Phone</p>
                    <p className="text-lg font-semibold">{vendor?.phone}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Products Tab */}
          {activeTab === 'products' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-bold">Your Products</h3>
                <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-500 text-white hover:bg-green-600 transition">
                  <Plus className="h-5 w-5" />
                  Add Product
                </button>
              </div>

              <div className="bg-white dark:bg-zinc-900 rounded-lg p-12 border border-gray-200 dark:border-zinc-800 text-center">
                <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 dark:text-gray-400 text-lg">No products yet</p>
                <p className="text-gray-500 dark:text-gray-500 text-sm">
                  Start by adding your first product to your store
                </p>
              </div>
            </div>
          )}

          {/* Orders Tab */}
          {activeTab === 'orders' && (
            <div className="space-y-6">
              <h3 className="text-2xl font-bold">Orders</h3>
              <div className="bg-white dark:bg-zinc-900 rounded-lg p-12 border border-gray-200 dark:border-zinc-800 text-center">
                <ShoppingCart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 dark:text-gray-400 text-lg">No orders yet</p>
                <p className="text-gray-500 dark:text-gray-500 text-sm">
                  Your orders will appear here once customers start buying
                </p>
              </div>
            </div>
          )}

          {/* Revenue Tab */}
          {activeTab === 'revenue' && (
            <div className="space-y-6">
              <h3 className="text-2xl font-bold">Revenue & Payments</h3>
              <div className="bg-white dark:bg-zinc-900 rounded-lg p-12 border border-gray-200 dark:border-zinc-800 text-center">
                <DollarSign className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 dark:text-gray-400 text-lg">No revenue data</p>
                <p className="text-gray-500 dark:text-gray-500 text-sm">
                  Your revenue and payment history will appear here
                </p>
              </div>
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <div className="space-y-6">
              <h3 className="text-2xl font-bold">Store Settings</h3>

              <div className="bg-white dark:bg-zinc-900 rounded-lg p-6 border border-gray-200 dark:border-zinc-800">
                <h4 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <Edit2 className="h-5 w-5 text-green-500" />
                  Store Information
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-sm font-semibold mb-2">Store Name</label>
                    <input
                      type="text"
                      value={vendor?.storeName}
                      disabled
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-zinc-700 bg-gray-100 dark:bg-zinc-800 cursor-not-allowed"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2">Email</label>
                    <input
                      type="email"
                      value={vendor?.email}
                      disabled
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-zinc-700 bg-gray-100 dark:bg-zinc-800 cursor-not-allowed"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2">Phone</label>
                    <input
                      type="tel"
                      value={vendor?.phone}
                      disabled
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-zinc-700 bg-gray-100 dark:bg-zinc-800 cursor-not-allowed"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2">Business Category</label>
                    <input
                      type="text"
                      value={vendor?.businessCategory}
                      disabled
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-zinc-700 bg-gray-100 dark:bg-zinc-800 cursor-not-allowed"
                    />
                  </div>
                </div>

                <button className="px-6 py-2 rounded-lg bg-green-500 text-white hover:bg-green-600 transition">
                  Edit Store Information
                </button>
              </div>

              {/* Bank Account Section */}
              <div className="bg-white dark:bg-zinc-900 rounded-lg p-6 border border-gray-200 dark:border-zinc-800">
                <h4 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-green-500" />
                  Bank Account
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-sm font-semibold mb-2">Account Name</label>
                    <input
                      type="text"
                      value={vendor?.bankAccount?.accountName}
                      disabled
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-zinc-700 bg-gray-100 dark:bg-zinc-800 cursor-not-allowed"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2">Account Number</label>
                    <input
                      type="text"
                      value={vendor?.bankAccount?.accountNumber}
                      disabled
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-zinc-700 bg-gray-100 dark:bg-zinc-800 cursor-not-allowed"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2">Bank Name</label>
                    <input
                      type="text"
                      value={vendor?.bankAccount?.bankName}
                      disabled
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-zinc-700 bg-gray-100 dark:bg-zinc-800 cursor-not-allowed"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2">Bank Code</label>
                    <input
                      type="text"
                      value={vendor?.bankAccount?.bankCode}
                      disabled
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-zinc-700 bg-gray-100 dark:bg-zinc-800 cursor-not-allowed"
                    />
                  </div>
                </div>

                <button className="px-6 py-2 rounded-lg bg-green-500 text-white hover:bg-green-600 transition">
                  Update Bank Account
                </button>
              </div>

              {/* Danger Zone */}
              <div className="bg-red-50 dark:bg-red-900/10 rounded-lg p-6 border border-red-200 dark:border-red-900">
                <h4 className="text-lg font-bold text-red-600 dark:text-red-400 mb-4">Danger Zone</h4>
                <p className="text-red-700 dark:text-red-300 mb-4">
                  Closing your store will make it unavailable to customers.
                </p>
                <button className="px-6 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white transition">
                  Close Store
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
