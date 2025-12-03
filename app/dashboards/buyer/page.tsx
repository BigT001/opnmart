'use client';

import { useState } from 'react';
import { ShoppingBag, Heart, Package, MapPin, LogOut, Menu, X, Star, Download, MessageSquare, ArrowRight, Clock } from 'lucide-react';
import Link from 'next/link';

export default function BuyerDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('orders');

  // State for dynamic data
  const [orders, setOrders] = useState<any[]>([]);
  const [wishlist, setWishlist] = useState<any[]>([]);
  const [addresses, setAddresses] = useState<any[]>([]);

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

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-black text-black dark:text-white">
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-white dark:bg-zinc-900 border-r border-gray-200 dark:border-zinc-800 transition-all duration-300 flex flex-col`}>
        <div className="p-6 border-b border-gray-200 dark:border-zinc-800 flex items-center justify-between">
          <Link href="/">
            {sidebarOpen && <h1 className="text-xl font-bold text-green-500 cursor-pointer hover:text-green-400 transition">OpnMart</h1>}
          </Link>
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-1 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded">
            {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {[
            { id: 'orders', label: 'My Orders', icon: ShoppingBag },
            { id: 'wishlist', label: 'Wishlist', icon: Heart },
            { id: 'tracking', label: 'Track Order', icon: Package },
            { id: 'addresses', label: 'Addresses', icon: MapPin },
          ].map(item => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
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

        <div className="p-4 border-t border-gray-200 dark:border-zinc-800">
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-100 dark:hover:bg-zinc-800 transition text-red-500 font-semibold">
            <LogOut className="h-5 w-5" />
            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="p-8">
          {/* Header */}
          <div className="mb-8">
            <h2 className="text-4xl font-bold mb-2">My Dashboard</h2>
            <p className="text-gray-600 dark:text-gray-400">Welcome back, Chinedu! 👋</p>
          </div>

          {/* Stats Grid */}
          {activeTab === 'orders' && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {[
                  { label: 'Total Orders', value: buyerStats.totalOrders, icon: ShoppingBag, color: 'from-blue-500 to-cyan-500' },
                  { label: 'Total Spent', value: `₦${buyerStats.totalSpent.toLocaleString()}`, icon: '💳', color: 'from-green-500 to-emerald-500' },
                  { label: 'Wishlist Items', value: buyerStats.wishlistItems, icon: Heart, color: 'from-pink-500 to-red-500' },
                  { label: 'In Transit', value: buyerStats.trackingOrders, icon: Package, color: 'from-purple-500 to-pink-500' },
                ].map((stat: any, i: number) => {
                  const Icon = typeof stat.icon === 'string' ? null : stat.icon;
                  return (
                    <div key={i} className={`bg-gradient-to-br ${stat.color} rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition transform hover:scale-105`}>
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <p className="text-sm font-medium opacity-90">{stat.label}</p>
                          <h3 className="text-3xl font-bold mt-2">{stat.value}</h3>
                        </div>
                        {Icon ? <Icon className="h-8 w-8 opacity-60" /> : <span className="text-2xl">{(stat.icon as string)}</span>}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Recent Orders */}
              <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-200 dark:border-zinc-800 p-6">
                <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                  <ShoppingBag className="h-6 w-6 text-green-500" />
                  Recent Orders
                </h3>
                {orders.length === 0 ? (
                  <div className="text-center py-12">
                    <ShoppingBag className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-400 mb-2">No Orders Yet</h3>
                    <p className="text-gray-500 dark:text-gray-500 mb-4">Start shopping to see your orders here.</p>
                    <Link href="/products" className="inline-block px-6 py-2 bg-gradient-to-r from-green-500 to-cyan-500 text-black rounded-lg font-bold hover:shadow-lg transition">
                      Start Shopping
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.map(order => (
                      <div key={order.id} className="flex items-center justify-between p-4 border border-gray-200 dark:border-zinc-800 rounded-lg hover:shadow-md transition">
                        <div className="flex items-center gap-4">
                          <img src={order.image} alt={order.product} className="w-12 h-12 rounded-lg object-cover" />
                          <div>
                            <p className="font-semibold">{order.product}</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">{order.vendor}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-6">
                          <div className="text-right">
                            <p className="font-semibold">₦{order.amount.toLocaleString()}</p>
                            <p className="text-xs text-gray-600 dark:text-gray-400">{order.date}</p>
                          </div>
                          <span className={`px-4 py-2 rounded-full text-xs font-semibold ${getStatusColor(order.status)}`}>{order.status}</span>
                          <button className="text-green-500 hover:text-green-600 font-semibold flex items-center gap-1">
                            View <ArrowRight className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}

          {/* Wishlist Tab */}
          {activeTab === 'wishlist' && (
            <div>
              <h3 className="text-2xl font-bold mb-6">My Wishlist ({wishlist.length} items)</h3>
              {wishlist.length === 0 ? (
                <div className="text-center py-12 bg-white dark:bg-zinc-900 rounded-2xl border border-gray-200 dark:border-zinc-800">
                  <Heart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-400 mb-2">Your Wishlist is Empty</h3>
                  <p className="text-gray-500 dark:text-gray-500 mb-4">Save items to your wishlist for later.</p>
                  <Link href="/products" className="inline-block px-6 py-2 bg-gradient-to-r from-green-500 to-cyan-500 text-black rounded-lg font-bold hover:shadow-lg transition">
                    Browse Products
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {wishlist.map(item => (
                    <div key={item.id} className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-200 dark:border-zinc-800 overflow-hidden hover:shadow-xl transition">
                      <div className="relative h-40 bg-gray-200 dark:bg-zinc-800 overflow-hidden group">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition" />
                        <button className="absolute top-3 right-3 p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition">
                          <Heart className="h-5 w-5 fill-current" />
                        </button>
                      </div>
                      <div className="p-4">
                        <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">{item.vendor}</p>
                        <h4 className="font-bold mb-2 line-clamp-2">{item.name}</h4>
                        <div className="flex items-center gap-2 mb-4">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm font-semibold">{item.rating}</span>
                        </div>
                        <div className="flex items-baseline gap-2 mb-4">
                          <span className="text-2xl font-bold text-green-500">₦{item.price.toLocaleString()}</span>
                          <span className="text-sm text-gray-500 line-through">₦{item.oldPrice.toLocaleString()}</span>
                        </div>
                        <button className="w-full py-2 bg-gradient-to-r from-green-500 to-cyan-500 text-black rounded-lg font-bold hover:shadow-lg transition">
                          Add to Cart
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Tracking Tab */}
          {activeTab === 'tracking' && (
            <div>
              {orders.filter(o => o.status !== 'Delivered').length === 0 ? (
                <div className="text-center py-12 bg-white dark:bg-zinc-900 rounded-2xl border border-gray-200 dark:border-zinc-800">
                  <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-400 mb-2">No Orders in Transit</h3>
                  <p className="text-gray-500 dark:text-gray-500 mb-4">Once you place an order, you can track it here.</p>
                  <Link href="/products" className="inline-block px-6 py-2 bg-gradient-to-r from-green-500 to-cyan-500 text-black rounded-lg font-bold hover:shadow-lg transition">
                    Continue Shopping
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {orders.filter(o => o.status !== 'Delivered').map((order, i) => (
                    <div key={order.id} className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-200 dark:border-zinc-800 p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <Clock className="h-6 w-6 text-blue-500" />
                        <h4 className="font-bold text-lg">{order.id}</h4>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{order.product}</p>
                      <div className="space-y-3 mb-6">
                        {['Order Confirmed', 'Processing', order.status].map((step, idx) => (
                          <div key={idx} className="flex items-center gap-3">
                            <div className={`w-4 h-4 rounded-full ${idx < 2 ? 'bg-green-500' : 'bg-gray-300 dark:bg-zinc-700'}`}></div>
                            <span className={idx < 2 ? 'text-green-600 dark:text-green-400 font-semibold' : 'text-gray-600 dark:text-gray-400'}>{step}</span>
                          </div>
                        ))}
                      </div>
                      <div className="pt-4 border-t border-gray-200 dark:border-zinc-800">
                        <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">Estimated Delivery</p>
                        <p className="font-bold">Dec {5 + i}, 2025</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Addresses Tab */}
          {activeTab === 'addresses' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold">Saved Addresses</h3>
                <button className="px-6 py-2 bg-gradient-to-r from-green-500 to-cyan-500 text-black rounded-lg font-bold hover:shadow-lg transition">
                  + Add Address
                </button>
              </div>
              {addresses.length === 0 ? (
                <div className="text-center py-12 bg-white dark:bg-zinc-900 rounded-2xl border border-gray-200 dark:border-zinc-800">
                  <MapPin className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-400 mb-2">No Addresses Saved</h3>
                  <p className="text-gray-500 dark:text-gray-500 mb-4">Add your delivery addresses for faster checkout.</p>
                  <button className="inline-block px-6 py-2 bg-gradient-to-r from-green-500 to-cyan-500 text-black rounded-lg font-bold hover:shadow-lg transition">
                    + Add Address
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {addresses.map(addr => (
                    <div key={addr.id} className={`border-2 rounded-2xl p-6 transition ${addr.default ? 'border-green-500 bg-green-500/5' : 'border-gray-200 dark:border-zinc-800'}`}>
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <MapPin className="h-5 w-5 text-green-500" />
                          <h4 className="font-bold">{addr.type}</h4>
                        </div>
                        {addr.default && <span className="bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full">Default</span>}
                      </div>
                      <p className="text-gray-600 dark:text-gray-400 mb-4">{addr.address}</p>
                      <div className="flex items-center gap-3">
                        <button className="flex-1 py-2 border border-green-500 text-green-500 rounded-lg font-semibold hover:bg-green-500/10 transition">
                          Edit
                        </button>
                        <button className="flex-1 py-2 border border-red-500 text-red-500 rounded-lg font-semibold hover:bg-red-500/10 transition">
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
