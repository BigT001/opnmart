'use client';

import { useState } from 'react';
import {
  Package,
  ShoppingCart,
  DollarSign,
  TrendingUp,
  Users,
  Bell,
} from 'lucide-react';

interface Vendor {
  storeName?: string;
  businessCategory?: string;
  email?: string;
  phone?: string;
  totalProducts?: number;
  totalOrders?: number;
  totalRevenue?: number;
  storeRating?: number;
}

interface OverviewProps {
  vendor?: Vendor;
  vendorId?: string;
}

export default function Overview({ vendor, vendorId }: OverviewProps) {
  const [overviewTab, setOverviewTab] = useState('sales');

  const vendorStats = {
    totalProducts: vendor?.totalProducts || 0,
    totalOrders: vendor?.totalOrders || 0,
    totalRevenue: vendor?.totalRevenue || 0,
    storeRating: vendor?.storeRating || 0,
  };

  return (
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

      {/* Overview Sub-Tabs Navigation */}
      <div className="bg-white dark:bg-zinc-900 rounded-t-lg border border-b-0 border-gray-200 dark:border-zinc-800">
        <div className="flex overflow-x-auto gap-0">
          {[
            { id: 'sales', label: 'Sales Summary', icon: DollarSign },
            { id: 'performance', label: 'Product Performance', icon: TrendingUp },
            { id: 'traffic', label: 'Traffic Insights', icon: Users },
            { id: 'orders', label: 'Recent Orders', icon: ShoppingCart },
            { id: 'stock', label: 'Low Stock Alerts', icon: Package },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setOverviewTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 border-b-2 whitespace-nowrap transition ${
                  overviewTab === tab.id
                    ? 'border-green-500 text-green-600 dark:text-green-400'
                    : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-300'
                }`}
              >
                <Icon className="h-4 w-4" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Overview Tab Content */}
      <div className="bg-white dark:bg-zinc-900 rounded-b-lg border border-t-0 border-gray-200 dark:border-zinc-800 p-6">
        {/* Sales Summary Tab */}
        {overviewTab === 'sales' && (
          <div className="space-y-4">
            <h3 className="text-lg font-bold mb-4">Sales Summary</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gray-50 dark:bg-zinc-800 p-4 rounded-lg">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Today's Revenue</p>
                <p className="text-2xl font-bold">₦0.00</p>
                <p className="text-xs text-green-600 dark:text-green-400 mt-1">+0% vs yesterday</p>
              </div>
              <div className="bg-gray-50 dark:bg-zinc-800 p-4 rounded-lg">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">This Month</p>
                <p className="text-2xl font-bold">₦0.00</p>
                <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">0 orders</p>
              </div>
              <div className="bg-gray-50 dark:bg-zinc-800 p-4 rounded-lg">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Conversion Rate</p>
                <p className="text-2xl font-bold">0%</p>
                <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">0/0 visitors</p>
              </div>
            </div>
          </div>
        )}

        {/* Product Performance Tab */}
        {overviewTab === 'performance' && (
          <div className="space-y-4">
            <h3 className="text-lg font-bold mb-4">Product Performance</h3>
            <div className="text-center py-8">
              <Package className="h-12 w-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
              <p className="text-gray-600 dark:text-gray-400">No products to display</p>
              <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">Add products to track their performance</p>
            </div>
          </div>
        )}

        {/* Traffic Insights Tab */}
        {overviewTab === 'traffic' && (
          <div className="space-y-4">
            <h3 className="text-lg font-bold mb-4">Traffic Insights</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gray-50 dark:bg-zinc-800 p-4 rounded-lg">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Today's Visitors</p>
                <p className="text-2xl font-bold">0</p>
                <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">Last 24 hours</p>
              </div>
              <div className="bg-gray-50 dark:bg-zinc-800 p-4 rounded-lg">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">This Month</p>
                <p className="text-2xl font-bold">0</p>
                <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">Total visitors</p>
              </div>
              <div className="bg-gray-50 dark:bg-zinc-800 p-4 rounded-lg">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Avg. Session</p>
                <p className="text-2xl font-bold">0s</p>
                <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">Average duration</p>
              </div>
            </div>
          </div>
        )}

        {/* Recent Orders Tab */}
        {overviewTab === 'orders' && (
          <div className="space-y-4">
            <h3 className="text-lg font-bold mb-4">Recent Orders</h3>
            <div className="text-center py-8">
              <ShoppingCart className="h-12 w-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
              <p className="text-gray-600 dark:text-gray-400">No orders yet</p>
              <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">Your orders will appear here</p>
            </div>
          </div>
        )}

        {/* Low Stock Alerts Tab */}
        {overviewTab === 'stock' && (
          <div className="space-y-4">
            <h3 className="text-lg font-bold mb-4">Low Stock Alerts</h3>
            <div className="text-center py-8">
              <Bell className="h-12 w-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
              <p className="text-gray-600 dark:text-gray-400">No low stock items</p>
              <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">All your products have sufficient inventory</p>
            </div>
          </div>
        )}
      </div>

      {/* Store Information */}
      <div className="bg-white dark:bg-zinc-900 rounded-lg p-6 border border-gray-200 dark:border-zinc-800 mt-6">
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
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
  );
}
