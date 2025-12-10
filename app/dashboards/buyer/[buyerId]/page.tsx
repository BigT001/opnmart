'use client';

import { useState, useEffect } from 'react';
import { ShoppingBag, Heart, Package, MapPin, LogOut, Menu, X, Star, Download, MessageSquare, ArrowRight, Clock, ChevronDown, User, Settings, Wallet } from 'lucide-react';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import { ThemeToggle } from '@/components/ui/ThemeToggle';

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

export default function BuyerDashboard() {
  const router = useRouter();
  const params = useParams();
  const buyerId = params.buyerId as string;

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [buyer, setBuyer] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showWelcomeHeader, setShowWelcomeHeader] = useState(true);

  // Fetch buyer session and verify buyerId matches
  useEffect(() => {
    const fetchSession = async () => {
      try {
        console.log('[DASHBOARD] fetchSession called for buyerId:', buyerId);
        // Get user data from localStorage
        const storedBuyer = localStorage.getItem('buyer');
        if (!storedBuyer) {
          // Not logged in, redirect to home
          console.log('[DASHBOARD] No buyer in localStorage, redirecting to home');
          router.push('/');
          return;
        }

        const data = JSON.parse(storedBuyer);
        console.log('[DASHBOARD] Buyer data:', data);
        
        console.log('[DASHBOARD] Checking authorization: buyer._id =', data._id, 'buyerId =', buyerId);

        // SECURITY: Verify that the logged-in user's ID matches the requested buyerId
        if (data._id !== buyerId) {
          console.error('[DASHBOARD] Authorization failed: user trying to access different dashboard');
          setError('Unauthorized: You cannot access another user\'s dashboard');
          setTimeout(() => router.push('/'), 2000);
          return;
        }
        
        console.log('[DASHBOARD] Authorization successful, setting buyer');
        console.log('[DASHBOARD] Buyer data:', {
          name: data.name,
          email: data.email,
          phone: data.phone,
          _id: data._id,
        });
        setBuyer(data);
      } catch (error) {
        console.error('[DASHBOARD] Error fetching session:', error);
        router.push('/');
      } finally {
        setLoading(false);
      }
    };
    
    fetchSession();
  }, [router, buyerId]);

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

  // State for dynamic data
  const [orders, setOrders] = useState<any[]>([]);
  const [wishlist, setWishlist] = useState<any[]>([]);
  const [addresses, setAddresses] = useState<any[]>([]);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [newAddress, setNewAddress] = useState({
    type: 'Home',
    address: '',
    phone: '',
  });

  const buyerStats = {
    totalOrders: orders.length,
    totalSpent: orders.reduce((sum, order) => sum + order.amount, 0),
    wishlistItems: wishlist.length,
    trackingOrders: orders.filter(o => o.status !== 'Delivered').length,
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'Processing': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
      case 'In Transit': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400';
      case 'Delivered': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
    }
  };

  const handleLogout = async () => {
    try {
      localStorage.removeItem('buyer');
    } catch (error) {
      console.error('Logout error:', error);
    }
    router.push('/');
  };

  const handleStartShopping = () => {
    router.push('/');
  };

  const handleAddAddress = () => {
    if (!newAddress.address.trim() || !newAddress.phone.trim()) {
      alert('Please fill in all address fields');
      return;
    }

    if (addresses.length >= 2) {
      alert('You can only save up to 2 addresses');
      return;
    }

    const addressToAdd = {
      id: addresses.length + 1,
      ...newAddress,
      default: addresses.length === 0, // First address is default
    };

    setAddresses([...addresses, addressToAdd]);
    setNewAddress({
      type: 'Home',
      address: '',
      phone: '',
    });
    setShowAddressForm(false);
  };

  const handleDeleteAddress = (id: number) => {
    setAddresses(addresses.filter(addr => addr.id !== id));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
          <p>Loading dashboard...</p>
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

  if (!buyer) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-black text-black dark:text-white transition-colors duration-200">
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-white dark:bg-zinc-900 border-r border-gray-200 dark:border-zinc-800 transition-all duration-300 flex flex-col`}>
        <div className="p-6 flex items-center justify-between">
          <Link href="/" className={`flex items-center gap-2 ${sidebarOpen ? '' : 'justify-center'}`}>
            <span className="text-2xl">🛒</span>
            {sidebarOpen && <span className="font-bold text-lg bg-gradient-to-r from-green-400 to-cyan-400 bg-clip-text text-transparent">OpnMart</span>}
          </Link>
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-1 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded transition flex-shrink-0">
            {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        <nav className="flex-1 px-4 py-3 space-y-1 overflow-auto">
          {[
            { id: 'overview', label: 'Overview', icon: ShoppingBag },
            { id: 'orders', label: 'My Orders', icon: Package },
            { id: 'wishlist', label: 'Wishlist', icon: Heart },
            { id: 'wallet', label: 'Wallet', icon: Wallet },
            { id: 'messages', label: 'Messages', icon: MessageSquare },
            { id: 'settings', label: 'Settings', icon: Settings },
          ].map(item => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg transition ${
                  activeTab === item.id
                    ? 'bg-gradient-to-r from-green-500 to-cyan-500 text-black font-semibold'
                    : 'hover:bg-gray-100 dark:hover:bg-zinc-800'
                }`}
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
          {/* Top Section with Welcome Message and Theme Toggle */}
          <div className="flex items-start justify-between mb-8">
            {activeTab === 'overview' && showWelcomeHeader && (
              <div>
                <h2 className="text-4xl font-bold mb-2">Welcome back, {buyer?.firstName}! <span className="wave-hand">👋</span></h2>
                <p className="text-gray-600 dark:text-gray-400">Manage your orders, wishlist, and shipping addresses</p>
                <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">Buyer ID: {buyerId}</p>
              </div>
            )}
            <ThemeToggle />
          </div>

          {/* Content based on active tab */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {[
                  { label: 'Total Orders', value: buyerStats.totalOrders, icon: ShoppingBag, color: 'from-blue-400 to-blue-600' },
                  { label: 'Total Spent', value: `₦${(buyerStats.totalSpent / 1000).toFixed(1)}K`, icon: ArrowRight, color: 'from-green-400 to-green-600' },
                  { label: 'Wishlist Items', value: buyerStats.wishlistItems, icon: Heart, color: 'from-pink-400 to-pink-600' },
                  { label: 'Orders Tracking', value: buyerStats.trackingOrders, icon: Package, color: 'from-purple-400 to-purple-600' },
                ].map((stat, i) => {
                  const Icon = stat.icon;
                  return (
                    <div key={i} className="bg-white dark:bg-zinc-900 rounded-lg p-6 border border-gray-200 dark:border-zinc-800">
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

              {/* Recent Orders */}
              {orders.length > 0 ? (
                <div className="bg-white dark:bg-zinc-900 rounded-lg p-6 border border-gray-200 dark:border-zinc-800">
                  <h3 className="text-xl font-bold mb-4">Recent Orders</h3>
                  <div className="space-y-3">
                    {orders.map((order, i) => (
                      <div key={i} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-zinc-800 rounded-lg">
                        <div className="flex items-center gap-3 flex-1">
                          <Package className="h-5 w-5 text-gray-400" />
                          <div>
                            <p className="font-semibold">{order.name}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Order #{order.id}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">₦{order.amount.toLocaleString()}</p>
                          <span className={`text-xs px-2 py-1 rounded ${getStatusColor(order.status)}`}>
                            {order.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="bg-white dark:bg-zinc-900 rounded-lg p-12 border border-gray-200 dark:border-zinc-800 text-center">
                  <ShoppingBag className="h-16 w-16 mx-auto text-gray-300 dark:text-gray-700 mb-4" />
                  <h3 className="text-xl font-bold mb-2">No Orders Yet</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">Start shopping to see your orders here</p>
                  <button
                    onClick={handleStartShopping}
                    className="px-6 py-2 bg-gradient-to-r from-green-500 to-cyan-500 text-black font-semibold rounded-lg hover:shadow-lg transition"
                  >
                    Start Shopping
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <div className="space-y-6">
              {/* Personal Information */}
              <div className="bg-white dark:bg-zinc-900 rounded-lg p-6 border border-gray-200 dark:border-zinc-800">
                <h3 className="text-xl font-bold mb-4">Personal Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2">First Name</label>
                    <input
                      type="text"
                      value={buyer?.firstName || ''}
                      disabled
                      className="w-full px-4 py-2 rounded-lg bg-gray-100 dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2">Last Name</label>
                    <input
                      type="text"
                      value={buyer?.lastName || ''}
                      disabled
                      className="w-full px-4 py-2 rounded-lg bg-gray-100 dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2">Email</label>
                    <input
                      type="email"
                      value={buyer?.email || ''}
                      disabled
                      className="w-full px-4 py-2 rounded-lg bg-gray-100 dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2">Phone</label>
                    <input
                      type="text"
                      value={buyer?.phonePrefix && buyer?.phone ? `${buyer.phonePrefix} ${buyer.phone}` : ''}
                      disabled
                      className="w-full px-4 py-2 rounded-lg bg-gray-100 dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700"
                    />
                  </div>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-4">Contact us to update your information</p>
              </div>

              {/* Shipping Addresses */}
              <div className="bg-white dark:bg-zinc-900 rounded-lg p-6 border border-gray-200 dark:border-zinc-800">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold">Delivery Addresses</h3>
                  <button
                    onClick={() => setShowAddressForm(!showAddressForm)}
                    disabled={addresses.length >= 2}
                    className="px-4 py-2 bg-gradient-to-r from-green-500 to-cyan-500 text-black font-semibold rounded-lg hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    + Add Address
                  </button>
                </div>

                {/* Add Address Form */}
                {showAddressForm && (
                  <div className="mb-6 p-4 bg-gray-50 dark:bg-zinc-800 rounded-lg border border-gray-200 dark:border-zinc-700">
                    <h4 className="font-semibold mb-4">Add New Address</h4>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-semibold mb-2">Address Type</label>
                        <select
                          value={newAddress.type}
                          onChange={(e) => setNewAddress({ ...newAddress, type: e.target.value })}
                          className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-900"
                        >
                          <option value="Home">Home</option>
                          <option value="Office">Office</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold mb-2">Address</label>
                        <textarea
                          value={newAddress.address}
                          onChange={(e) => setNewAddress({ ...newAddress, address: e.target.value })}
                          placeholder="Enter your full address"
                          className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 resize-none"
                          rows={3}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold mb-2">Phone Number</label>
                        <input
                          type="text"
                          value={newAddress.phone}
                          onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })}
                          placeholder="+234 8XX XXX XXXX"
                          className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-900"
                        />
                      </div>

                      <div className="flex gap-3">
                        <button
                          onClick={handleAddAddress}
                          className="flex-1 py-2 bg-gradient-to-r from-green-500 to-cyan-500 text-black font-semibold rounded-lg hover:shadow-lg transition"
                        >
                          Save Address
                        </button>
                        <button
                          onClick={() => setShowAddressForm(false)}
                          className="flex-1 py-2 border border-gray-300 dark:border-zinc-700 text-gray-700 dark:text-gray-300 font-semibold rounded-lg hover:bg-gray-100 dark:hover:bg-zinc-800 transition"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Saved Addresses */}
                {addresses.length === 0 ? (
                  <div className="text-center py-8">
                    <MapPin className="h-12 w-12 text-gray-300 dark:text-gray-700 mx-auto mb-3" />
                    <p className="text-gray-600 dark:text-gray-400 mb-4">No addresses saved yet</p>
                    <button
                      onClick={() => setShowAddressForm(true)}
                      className="px-4 py-2 bg-gradient-to-r from-green-500 to-cyan-500 text-black font-semibold rounded-lg hover:shadow-lg transition"
                    >
                      + Add Your First Address
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {addresses.map((address) => (
                      <div key={address.id} className="p-4 bg-gray-50 dark:bg-zinc-800 rounded-lg border border-gray-200 dark:border-zinc-700 flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <MapPin className="h-4 w-4 text-green-500" />
                            <p className="font-semibold">{address.type}</p>
                            {address.default && <span className="text-xs bg-green-100 dark:bg-green-500/20 text-green-800 dark:text-green-400 px-2 py-1 rounded">Default</span>}
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{address.address}</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{address.phone}</p>
                        </div>
                        <button
                          onClick={() => handleDeleteAddress(address.id)}
                          className="ml-4 px-3 py-1 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 rounded transition text-sm font-semibold"
                        >
                          Delete
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Delete Account Section */}
              <div className="bg-white dark:bg-zinc-900 rounded-lg p-6 border border-gray-200 dark:border-zinc-800 border-red-200 dark:border-red-800">
                <h3 className="text-xl font-bold mb-2 text-red-600 dark:text-red-400">Danger Zone</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">Permanently delete your account and all associated data. This action cannot be undone.</p>
                <button
                  onClick={() => {
                    if (confirm('Are you sure you want to delete your account? This action cannot be undone and will delete all your data.')) {
                      // Delete account logic would go here
                      console.log('Delete account');
                    }
                  }}
                  className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition"
                >
                  Delete Account
                </button>
              </div>
            </div>
          )}

          {/* Invoices Tab */}
          {activeTab === 'invoices' && (
            <div className="bg-white dark:bg-zinc-900 rounded-lg p-12 border border-gray-200 dark:border-zinc-800 text-center">
              <Download className="h-16 w-16 text-gray-300 dark:text-gray-700 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-400 mb-2">No Invoices Yet</h3>
              <p className="text-gray-500 dark:text-gray-500">Your invoices will appear here once you complete your first order</p>
            </div>
          )}

          {/* Other tabs placeholder */}
          {['orders', 'wishlist', 'tracking'].includes(activeTab) && (
            <div className="bg-white dark:bg-zinc-900 rounded-lg p-12 border border-gray-200 dark:border-zinc-800 text-center">
              <p className="text-gray-600 dark:text-gray-400">{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} section coming soon</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
