'use client';

import { useState } from 'react';
import { BarChart3, TrendingUp, ShoppingBag, Users, AlertCircle, Settings, LogOut, Menu, X, Eye, Edit, Trash2, Plus, DollarSign, Package, Clock } from 'lucide-react';
import Link from 'next/link';
import ProductUploadModal from '@/components/ProductUploadModal';
import { useProducts } from '@/app/context/ProductContext';

export default function VendorDashboard() {
  const { allProducts, addProduct, removeProduct } = useProducts();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [orders, setOrders] = useState([
    { id: 'ORD001', customer: 'Chinedu Okafor', product: 'Product pending...', amount: 0, status: 'Pending' },
    { id: 'ORD002', customer: 'Amara Eze', product: 'Product pending...', amount: 0, status: 'Processing' },
    { id: 'ORD003', customer: 'Ibrahim Hassan', product: 'Product pending...', amount: 0, status: 'Shipped' },
    { id: 'ORD004', customer: 'Zainab Mohammed', product: 'Product pending...', amount: 0, status: 'Delivered' },
    { id: 'ORD005', customer: 'Oluwaseun Adeyemi', product: 'Product pending...', amount: 0, status: 'Delivered' },
  ]);

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'Pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'Processing': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
      case 'Shipped': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400';
      case 'Delivered': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
    }
  };

  // Calculate stats from products
  const vendorStats = {
    totalProducts: allProducts.length,
    totalSales: allProducts.reduce((sum, p) => sum + (p.price * (p.sold || 0)), 0),
    totalOrders: orders.length,
    pendingOrders: orders.filter(o => o.status === 'Pending').length,
    revenue: allProducts.reduce((sum, p) => sum + (p.price * (p.sold || 0)), 0) * 0.95, // 5% commission
    rating: 4.8,
  };

  const handleProductUpload = (newProduct: any) => {
    addProduct(newProduct);
  };

  const handleDeleteProduct = (id: number) => {
    if (confirm('Are you sure you want to delete this product?')) {
      removeProduct(id);
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
            { id: 'overview', label: 'Overview', icon: BarChart3 },
            { id: 'products', label: 'Products', icon: Package },
            { id: 'orders', label: 'Orders', icon: ShoppingBag },
            { id: 'analytics', label: 'Analytics', icon: TrendingUp },
            { id: 'settings', label: 'Settings', icon: Settings },
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
            <h2 className="text-4xl font-bold mb-2">Vendor Dashboard</h2>
            <p className="text-gray-600 dark:text-gray-400">Welcome back, Fashion Corner Store 👋</p>
          </div>

          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <>
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {[
                  { label: 'Total Products', value: vendorStats.totalProducts, icon: Package, color: 'from-blue-500 to-cyan-500' },
                  { label: 'Total Sales', value: `₦${vendorStats.totalSales.toLocaleString()}`, icon: DollarSign, color: 'from-green-500 to-emerald-500' },
                  { label: 'Total Orders', value: vendorStats.totalOrders, icon: ShoppingBag, color: 'from-purple-500 to-pink-500' },
                  { label: 'Pending Orders', value: vendorStats.pendingOrders, icon: Clock, color: 'from-yellow-500 to-orange-500' },
                  { label: 'Revenue (This Month)', value: `₦${vendorStats.revenue.toLocaleString()}`, icon: TrendingUp, color: 'from-green-400 to-green-600' },
                  { label: 'Store Rating', value: `${vendorStats.rating}★`, icon: AlertCircle, color: 'from-red-500 to-pink-500' },
                ].map((stat, i) => {
                  const Icon = stat.icon;
                  return (
                    <div key={i} className={`bg-gradient-to-br ${stat.color} rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition transform hover:scale-105`}>
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <p className="text-sm font-medium opacity-90">{stat.label}</p>
                          <h3 className="text-3xl font-bold mt-2">{stat.value}</h3>
                        </div>
                        <Icon className="h-8 w-8 opacity-60" />
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
                    <ShoppingBag className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-600 dark:text-gray-400">No orders yet. Upload products to start receiving orders.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-200 dark:border-zinc-800">
                          <th className="text-left py-4 px-4 font-semibold text-gray-600 dark:text-gray-400">Order ID</th>
                          <th className="text-left py-4 px-4 font-semibold text-gray-600 dark:text-gray-400">Customer</th>
                          <th className="text-left py-4 px-4 font-semibold text-gray-600 dark:text-gray-400">Product</th>
                          <th className="text-left py-4 px-4 font-semibold text-gray-600 dark:text-gray-400">Amount</th>
                          <th className="text-left py-4 px-4 font-semibold text-gray-600 dark:text-gray-400">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {orders.map(order => (
                          <tr key={order.id} className="border-b border-gray-200 dark:border-zinc-800 hover:bg-gray-50 dark:hover:bg-zinc-800/50 transition">
                            <td className="py-4 px-4 font-semibold text-green-500">{order.id}</td>
                            <td className="py-4 px-4">{order.customer}</td>
                            <td className="py-4 px-4 text-sm text-gray-600 dark:text-gray-400">{order.product}</td>
                            <td className="py-4 px-4 font-semibold">₦{order.amount.toLocaleString()}</td>
                            <td className="py-4 px-4"><span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.status)}`}>{order.status}</span></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </>
          )}

          {/* Products Tab */}
          {activeTab === 'products' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold">Your Products</h3>
                <button 
                  onClick={() => setUploadModalOpen(true)}
                  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-cyan-500 text-black rounded-lg font-semibold hover:shadow-lg transition"
                >
                  <Plus className="h-5 w-5" />
                  Add Product
                </button>
              </div>

              {allProducts.length === 0 ? (
                <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-200 dark:border-zinc-800 p-12 text-center">
                  <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h4 className="text-xl font-bold mb-2">No Products Yet</h4>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">Upload your first product to get started selling on OpnMart</p>
                  <button 
                    onClick={() => setUploadModalOpen(true)}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-cyan-500 text-black rounded-lg font-semibold hover:shadow-lg transition"
                  >
                    <Plus className="h-5 w-5" />
                    Upload First Product
                  </button>
                </div>
              ) : (
                <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-200 dark:border-zinc-800 p-6 overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200 dark:border-zinc-800">
                        <th className="text-left py-4 px-4 font-semibold text-gray-600 dark:text-gray-400">Product</th>
                        <th className="text-left py-4 px-4 font-semibold text-gray-600 dark:text-gray-400">Category</th>
                        <th className="text-left py-4 px-4 font-semibold text-gray-600 dark:text-gray-400">Price</th>
                        <th className="text-left py-4 px-4 font-semibold text-gray-600 dark:text-gray-400">Stock</th>
                        <th className="text-left py-4 px-4 font-semibold text-gray-600 dark:text-gray-400">Sold</th>
                        <th className="text-left py-4 px-4 font-semibold text-gray-600 dark:text-gray-400">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {allProducts.map((product: any) => {
                        const stockCount = product.stock || 0;
                        return (
                        <tr key={product.id} className="border-b border-gray-200 dark:border-zinc-800 hover:bg-gray-50 dark:hover:bg-zinc-800/50 transition">
                          <td className="py-4 px-4 font-semibold">{product.name}</td>
                          <td className="py-4 px-4 text-sm text-gray-600 dark:text-gray-400">{product.category}</td>
                          <td className="py-4 px-4 font-semibold">₦{product.price.toLocaleString()}</td>
                          <td className="py-4 px-4"><span className={`px-3 py-1 rounded-lg text-sm font-semibold ${stockCount > 20 ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'}`}>{stockCount}</span></td>
                          <td className="py-4 px-4 font-semibold text-green-500">{product.sold || 0}</td>
                          <td className="py-4 px-4 flex items-center gap-2">
                            <button className="p-2 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-lg transition text-blue-500" title="View">
                              <Eye className="h-4 w-4" />
                            </button>
                            <button className="p-2 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-lg transition text-green-500" title="Edit">
                              <Edit className="h-4 w-4" />
                            </button>
                            <button 
                              onClick={() => handleDeleteProduct(product.id)}
                              className="p-2 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-lg transition text-red-500" 
                              title="Delete"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </td>
                        </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* Orders Tab */}
          {activeTab === 'orders' && (
            <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-200 dark:border-zinc-800 p-6">
              <h3 className="text-2xl font-bold mb-6">All Orders</h3>
              {orders.length === 0 ? (
                <div className="text-center py-12">
                  <ShoppingBag className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-600 dark:text-gray-400">No orders yet</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200 dark:border-zinc-800">
                        <th className="text-left py-4 px-4 font-semibold text-gray-600 dark:text-gray-400">Order ID</th>
                        <th className="text-left py-4 px-4 font-semibold text-gray-600 dark:text-gray-400">Customer</th>
                        <th className="text-left py-4 px-4 font-semibold text-gray-600 dark:text-gray-400">Date</th>
                        <th className="text-left py-4 px-4 font-semibold text-gray-600 dark:text-gray-400">Amount</th>
                        <th className="text-left py-4 px-4 font-semibold text-gray-600 dark:text-gray-400">Status</th>
                        <th className="text-left py-4 px-4 font-semibold text-gray-600 dark:text-gray-400">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map((order, i) => (
                        <tr key={order.id} className="border-b border-gray-200 dark:border-zinc-800 hover:bg-gray-50 dark:hover:bg-zinc-800/50 transition">
                          <td className="py-4 px-4 font-semibold text-green-500">{order.id}</td>
                          <td className="py-4 px-4">{order.customer}</td>
                          <td className="py-4 px-4 text-sm text-gray-600 dark:text-gray-400">Dec {i + 1}, 2025</td>
                          <td className="py-4 px-4 font-semibold">₦{order.amount.toLocaleString() || 'N/A'}</td>
                          <td className="py-4 px-4"><span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.status)}`}>{order.status}</span></td>
                          <td className="py-4 px-4">
                            <button className="text-green-500 hover:text-green-600 font-semibold text-sm">View</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* Analytics Tab */}
          {activeTab === 'analytics' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-200 dark:border-zinc-800 p-6">
                <h3 className="text-xl font-bold mb-6">Sales Analytics</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span>Total Revenue</span>
                      <span className="font-bold text-green-500">₦{vendorStats.totalSales.toLocaleString()}</span>
                    </div>
                    <div className="h-2 bg-gray-200 dark:bg-zinc-800 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-green-500 to-cyan-500 w-4/5"></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span>This Month</span>
                      <span className="font-bold text-cyan-500">₦{vendorStats.revenue.toLocaleString()}</span>
                    </div>
                    <div className="h-2 bg-gray-200 dark:bg-zinc-800 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 w-3/5"></div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-200 dark:border-zinc-800 p-6">
                <h3 className="text-xl font-bold mb-6">Order Status</h3>
                <div className="space-y-3">
                  {[
                    { label: 'Delivered', count: 98, color: 'from-green-500 to-emerald-500' },
                    { label: 'Shipped', count: 34, color: 'from-purple-500 to-pink-500' },
                    { label: 'Processing', count: 16, color: 'from-blue-500 to-cyan-500' },
                    { label: 'Pending', count: 8, color: 'from-yellow-500 to-orange-500' },
                  ].map((item, i) => (
                    <div key={i}>
                      <div className="flex justify-between mb-1">
                        <span>{item.label}</span>
                        <span className="font-bold">{item.count}</span>
                      </div>
                      <div className="h-3 bg-gray-200 dark:bg-zinc-800 rounded-full overflow-hidden">
                        <div className={`h-full bg-gradient-to-r ${item.color}`} style={{ width: `${(item.count / 156) * 100}%` }}></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-200 dark:border-zinc-800 p-8 max-w-2xl">
              <h3 className="text-2xl font-bold mb-8">Store Settings</h3>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold mb-2">Store Name</label>
                  <input type="text" defaultValue="Fashion Corner Store" className="w-full px-4 py-2 border border-gray-300 dark:border-zinc-700 rounded-lg dark:bg-zinc-800 dark:text-white" />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Store Email</label>
                  <input type="email" defaultValue="store@example.com" className="w-full px-4 py-2 border border-gray-300 dark:border-zinc-700 rounded-lg dark:bg-zinc-800 dark:text-white" />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Phone Number</label>
                  <input type="tel" defaultValue="+234 801 234 5678" className="w-full px-4 py-2 border border-gray-300 dark:border-zinc-700 rounded-lg dark:bg-zinc-800 dark:text-white" />
                </div>
                <button className="w-full py-3 bg-gradient-to-r from-green-500 to-cyan-500 text-black rounded-lg font-bold hover:shadow-lg transition">
                  Save Changes
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Product Upload Modal */}
      <ProductUploadModal 
        isOpen={uploadModalOpen} 
        onClose={() => setUploadModalOpen(false)}
        onSubmit={handleProductUpload}
      />
    </div>
  );
}
