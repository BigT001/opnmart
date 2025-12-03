'use client';

import { useState } from 'react';
import { BarChart3, Users, Store, TrendingUp, AlertCircle, Settings, LogOut, Menu, X, Eye, CheckCircle, XCircle, Search, Ban, Award } from 'lucide-react';
import Link from 'next/link';

export default function AdminDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [searchQuery, setSearchQuery] = useState('');

  // Sample data
  const adminStats = {
    totalUsers: 2450,
    totalVendors: 342,
    totalRevenue: 125000000,
    totalOrders: 8456,
    newUsers: 156,
    platformGrowth: 24.5,
  };

  const vendors = [
    { id: 1, name: 'Fashion Corner Store', owner: 'Uche Okoro', products: 47, revenue: 2850000, status: 'Active', rating: 4.8, joined: 'Jan 15, 2025' },
    { id: 2, name: 'Tech Hub Nigeria', owner: 'Amina Ibrahim', products: 156, revenue: 8500000, status: 'Active', rating: 4.9, joined: 'Dec 1, 2024' },
    { id: 3, name: 'Furniture Paradise', owner: 'Segun Adeyemi', products: 89, revenue: 5200000, status: 'Suspended', rating: 3.2, joined: 'Nov 20, 2024' },
    { id: 4, name: 'Fresh Farms', owner: 'Grace Chioma', products: 234, revenue: 12500000, status: 'Active', rating: 4.7, joined: 'Oct 10, 2024' },
    { id: 5, name: 'Sleep Well Mattress', owner: 'David Okonkwo', products: 23, revenue: 1850000, status: 'Pending', rating: 0, joined: 'Dec 25, 2024' },
  ];

  const recentTransactions = [
    { id: 1, vendor: 'Tech Hub Nigeria', amount: 450000, type: 'Order', date: 'Dec 3, 2025', status: 'Completed' },
    { id: 2, vendor: 'Fashion Corner Store', amount: 125000, type: 'Withdrawal', date: 'Dec 2, 2025', status: 'Processing' },
    { id: 3, vendor: 'Fresh Farms', amount: 890000, type: 'Order', date: 'Dec 1, 2025', status: 'Completed' },
    { id: 4, vendor: 'Furniture Paradise', amount: 245000, type: 'Refund', date: 'Nov 30, 2025', status: 'Failed' },
  ];

  const reports = [
    { id: 1, vendor: 'Suspicious Store', reason: 'Fake products', reporter: 'Customer Report', date: 'Dec 3, 2025', priority: 'High' },
    { id: 2, vendor: 'Tech Hub Nigeria', reason: 'Misleading description', reporter: 'System', date: 'Dec 2, 2025', priority: 'Medium' },
    { id: 3, vendor: 'Fresh Farms', reason: 'Delayed shipment', reporter: 'Customer Report', date: 'Dec 1, 2025', priority: 'Low' },
  ];

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'Active': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'Suspended': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      case 'Pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch(priority) {
      case 'High': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      case 'Medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'Low': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
    }
  };

  const filteredVendors = vendors.filter(vendor =>
    vendor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    vendor.owner.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
            { id: 'vendors', label: 'Vendors', icon: Store },
            { id: 'users', label: 'Users', icon: Users },
            { id: 'transactions', label: 'Transactions', icon: TrendingUp },
            { id: 'reports', label: 'Reports', icon: AlertCircle },
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
            <h2 className="text-4xl font-bold mb-2">Admin Dashboard</h2>
            <p className="text-gray-600 dark:text-gray-400">Platform Statistics & Management</p>
          </div>

          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <>
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {[
                  { label: 'Total Users', value: adminStats.totalUsers.toLocaleString(), icon: Users, color: 'from-blue-500 to-cyan-500', subtext: `+${adminStats.newUsers} this month` },
                  { label: 'Active Vendors', value: adminStats.totalVendors, icon: Store, color: 'from-green-500 to-emerald-500', subtext: '342 verified' },
                  { label: 'Platform Revenue', value: `₦${(adminStats.totalRevenue / 1000000).toFixed(0)}M`, icon: TrendingUp, color: 'from-purple-500 to-pink-500', subtext: '+24.5% vs last month' },
                  { label: 'Total Orders', value: adminStats.totalOrders.toLocaleString(), icon: '📦', color: 'from-yellow-500 to-orange-500', subtext: 'All time' },
                  { label: 'Pending Approvals', value: 8, icon: AlertCircle, color: 'from-red-500 to-pink-500', subtext: '3 urgent' },
                  { label: 'Platform Health', value: '98.5%', icon: Award, color: 'from-green-400 to-green-600', subtext: 'Uptime' },
                ].map((stat: any, i: number) => {
                  const Icon = typeof stat.icon === 'string' ? null : stat.icon;
                  return (
                    <div key={i} className={`bg-gradient-to-br ${stat.color} rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition transform hover:scale-105`}>
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <p className="text-sm font-medium opacity-90">{stat.label}</p>
                          <h3 className="text-3xl font-bold mt-2">{stat.value}</h3>
                          <p className="text-xs mt-2 opacity-80">{stat.subtext}</p>
                        </div>
                        {Icon ? <Icon className="h-8 w-8 opacity-60" /> : <span className="text-2xl">{(stat.icon as string)}</span>}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Recent Transactions */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-200 dark:border-zinc-800 p-6">
                  <h3 className="text-xl font-bold mb-6">Recent Transactions</h3>
                  <div className="space-y-4">
                    {recentTransactions.map(tx => (
                      <div key={tx.id} className="flex items-center justify-between p-4 border border-gray-200 dark:border-zinc-800 rounded-lg hover:shadow-md transition">
                        <div>
                          <p className="font-semibold">{tx.vendor}</p>
                          <p className="text-xs text-gray-600 dark:text-gray-400">{tx.type} • {tx.date}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-green-500">₦{tx.amount.toLocaleString()}</p>
                          <span className={`text-xs font-semibold px-2 py-1 rounded ${
                            tx.status === 'Completed' ? 'text-green-600 dark:text-green-400' :
                            tx.status === 'Processing' ? 'text-blue-600 dark:text-blue-400' :
                            'text-red-600 dark:text-red-400'
                          }`}>
                            {tx.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-200 dark:border-zinc-800 p-6">
                  <h3 className="text-xl font-bold mb-6">Platform Metrics</h3>
                  <div className="space-y-4">
                    {[
                      { label: 'User Engagement', value: 76, color: 'from-blue-500 to-cyan-500' },
                      { label: 'Vendor Performance', value: 82, color: 'from-green-500 to-emerald-500' },
                      { label: 'Payment Success Rate', value: 94, color: 'from-purple-500 to-pink-500' },
                      { label: 'Customer Satisfaction', value: 88, color: 'from-yellow-500 to-orange-500' },
                    ].map((metric, i) => (
                      <div key={i}>
                        <div className="flex justify-between mb-2">
                          <span className="font-semibold">{metric.label}</span>
                          <span className="font-bold text-green-500">{metric.value}%</span>
                        </div>
                        <div className="h-3 bg-gray-200 dark:bg-zinc-800 rounded-full overflow-hidden">
                          <div className={`h-full bg-gradient-to-r ${metric.color}`} style={{ width: `${metric.value}%` }}></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Vendors Tab */}
          {activeTab === 'vendors' && (
            <div>
              <div className="mb-6 flex items-center gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search vendors..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 dark:border-zinc-700 rounded-lg dark:bg-zinc-800 dark:text-white"
                  />
                </div>
              </div>

              <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-200 dark:border-zinc-800 overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-zinc-800">
                      <th className="text-left py-4 px-6 font-semibold text-gray-600 dark:text-gray-400">Vendor</th>
                      <th className="text-left py-4 px-6 font-semibold text-gray-600 dark:text-gray-400">Owner</th>
                      <th className="text-left py-4 px-6 font-semibold text-gray-600 dark:text-gray-400">Products</th>
                      <th className="text-left py-4 px-6 font-semibold text-gray-600 dark:text-gray-400">Revenue</th>
                      <th className="text-left py-4 px-6 font-semibold text-gray-600 dark:text-gray-400">Rating</th>
                      <th className="text-left py-4 px-6 font-semibold text-gray-600 dark:text-gray-400">Status</th>
                      <th className="text-left py-4 px-6 font-semibold text-gray-600 dark:text-gray-400">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredVendors.map(vendor => (
                      <tr key={vendor.id} className="border-b border-gray-200 dark:border-zinc-800 hover:bg-gray-50 dark:hover:bg-zinc-800/50 transition">
                        <td className="py-4 px-6 font-semibold">{vendor.name}</td>
                        <td className="py-4 px-6 text-sm text-gray-600 dark:text-gray-400">{vendor.owner}</td>
                        <td className="py-4 px-6 font-semibold text-green-500">{vendor.products}</td>
                        <td className="py-4 px-6 font-semibold">₦{vendor.revenue.toLocaleString()}</td>
                        <td className="py-4 px-6">{vendor.rating > 0 ? `${vendor.rating}★` : 'N/A'}</td>
                        <td className="py-4 px-6"><span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(vendor.status)}`}>{vendor.status}</span></td>
                        <td className="py-4 px-6 flex items-center gap-2">
                          <button className="p-2 hover:bg-gray-100 dark:hover:bg-zinc-700 rounded-lg transition text-green-500" title="Approve">
                            <CheckCircle className="h-5 w-5" />
                          </button>
                          <button className="p-2 hover:bg-gray-100 dark:hover:bg-zinc-700 rounded-lg transition text-red-500" title="Suspend">
                            <Ban className="h-5 w-5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Reports Tab */}
          {activeTab === 'reports' && (
            <div className="space-y-4">
              <h3 className="text-2xl font-bold mb-6">Vendor Reports</h3>
              {reports.map(report => (
                <div key={report.id} className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-200 dark:border-zinc-800 p-6 hover:shadow-lg transition">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="font-bold text-lg">{report.vendor}</h4>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getPriorityColor(report.priority)}`}>{report.priority}</span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{report.reason}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-600">Reported by {report.reporter} • {report.date}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button className="px-4 py-2 bg-gradient-to-r from-green-500 to-cyan-500 text-black rounded-lg font-semibold hover:shadow-lg transition">
                        Resolve
                      </button>
                      <button className="px-4 py-2 border border-red-500 text-red-500 rounded-lg font-semibold hover:bg-red-500/10 transition">
                        Ban Vendor
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Users Tab */}
          {activeTab === 'users' && (
            <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-200 dark:border-zinc-800 p-6">
              <h3 className="text-2xl font-bold mb-6">User Management</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  { label: 'Total Users', value: adminStats.totalUsers, color: 'from-blue-500 to-cyan-500' },
                  { label: 'Active Users', value: 1856, color: 'from-green-500 to-emerald-500' },
                  { label: 'Inactive (30 days)', value: 594, color: 'from-gray-500 to-gray-600' },
                  { label: 'New Users (This Month)', value: 156, color: 'from-purple-500 to-pink-500' },
                  { label: 'Users Blocked', value: 12, color: 'from-red-500 to-pink-500' },
                  { label: 'Verified Users', value: 2015, color: 'from-green-400 to-green-600' },
                ].map((stat, i) => (
                  <div key={i} className={`bg-gradient-to-br ${stat.color} rounded-2xl p-6 text-white`}>
                    <p className="text-sm font-medium opacity-90">{stat.label}</p>
                    <h3 className="text-3xl font-bold mt-2">{stat.value}</h3>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Transactions Tab */}
          {activeTab === 'transactions' && (
            <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-200 dark:border-zinc-800 p-6 overflow-x-auto">
              <h3 className="text-2xl font-bold mb-6">All Transactions</h3>
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-zinc-800">
                    <th className="text-left py-4 px-4 font-semibold text-gray-600 dark:text-gray-400">ID</th>
                    <th className="text-left py-4 px-4 font-semibold text-gray-600 dark:text-gray-400">Vendor</th>
                    <th className="text-left py-4 px-4 font-semibold text-gray-600 dark:text-gray-400">Type</th>
                    <th className="text-left py-4 px-4 font-semibold text-gray-600 dark:text-gray-400">Amount</th>
                    <th className="text-left py-4 px-4 font-semibold text-gray-600 dark:text-gray-400">Date</th>
                    <th className="text-left py-4 px-4 font-semibold text-gray-600 dark:text-gray-400">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentTransactions.map(tx => (
                    <tr key={tx.id} className="border-b border-gray-200 dark:border-zinc-800 hover:bg-gray-50 dark:hover:bg-zinc-800/50 transition">
                      <td className="py-4 px-4 font-semibold text-green-500">#{tx.id}</td>
                      <td className="py-4 px-4">{tx.vendor}</td>
                      <td className="py-4 px-4 text-sm font-semibold">{tx.type}</td>
                      <td className="py-4 px-4 font-bold">₦{tx.amount.toLocaleString()}</td>
                      <td className="py-4 px-4 text-sm text-gray-600 dark:text-gray-400">{tx.date}</td>
                      <td className="py-4 px-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          tx.status === 'Completed' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
                          tx.status === 'Processing' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' :
                          'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                        }`}>
                          {tx.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-200 dark:border-zinc-800 p-8 max-w-2xl">
              <h3 className="text-2xl font-bold mb-8">Platform Settings</h3>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold mb-2">Platform Name</label>
                  <input type="text" defaultValue="OpnMart" className="w-full px-4 py-2 border border-gray-300 dark:border-zinc-700 rounded-lg dark:bg-zinc-800 dark:text-white" />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Commission Rate (%)</label>
                  <input type="number" defaultValue="5" className="w-full px-4 py-2 border border-gray-300 dark:border-zinc-700 rounded-lg dark:bg-zinc-800 dark:text-white" />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Support Email</label>
                  <input type="email" defaultValue="support@opnmart.com" className="w-full px-4 py-2 border border-gray-300 dark:border-zinc-700 rounded-lg dark:bg-zinc-800 dark:text-white" />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Maintenance Mode</label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input type="checkbox" className="w-5 h-5 rounded" />
                    <span>Enable maintenance mode</span>
                  </label>
                </div>
                <button className="w-full py-3 bg-gradient-to-r from-green-500 to-cyan-500 text-black rounded-lg font-bold hover:shadow-lg transition">
                  Save Settings
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
