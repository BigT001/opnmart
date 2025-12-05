'use client';

import { useState } from 'react';
import { Edit2, DollarSign } from 'lucide-react';

interface Vendor {
  storeName?: string;
  email?: string;
  phone?: string;
  businessCategory?: string;
  bankAccount?: {
    accountName?: string;
    accountNumber?: string;
    bankName?: string;
    bankCode?: string;
  };
}

interface SettingsProps {
  vendor?: Vendor;
}

export default function Settings({ vendor }: SettingsProps) {
  const [bankInfo, setBankInfo] = useState({
    accountName: vendor?.bankAccount?.accountName || '',
    accountNumber: vendor?.bankAccount?.accountNumber || '',
    bankName: vendor?.bankAccount?.bankName || '',
    bankCode: vendor?.bankAccount?.bankCode || '',
  });

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Store Settings</h2>

      {/* Store Information Section */}
      <div className="bg-white dark:bg-zinc-900 rounded-lg p-6 border border-gray-200 dark:border-zinc-800">
        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
          <Edit2 className="h-5 w-5 text-green-500" />
          Store Information
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-semibold mb-2">Store Name</label>
            <input
              type="text"
              value={vendor?.storeName || ''}
              disabled
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-zinc-700 bg-gray-100 dark:bg-zinc-800 cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Email</label>
            <input
              type="email"
              value={vendor?.email || ''}
              disabled
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-zinc-700 bg-gray-100 dark:bg-zinc-800 cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Phone</label>
            <input
              type="tel"
              value={vendor?.phone || ''}
              disabled
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-zinc-700 bg-gray-100 dark:bg-zinc-800 cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Business Category</label>
            <input
              type="text"
              value={vendor?.businessCategory || ''}
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
        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
          <DollarSign className="h-5 w-5 text-green-500" />
          Bank Account
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-semibold mb-2">Account Name</label>
            <input
              type="text"
              value={bankInfo.accountName}
              disabled
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-zinc-700 bg-gray-100 dark:bg-zinc-800 cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Account Number</label>
            <input
              type="text"
              value={bankInfo.accountNumber}
              disabled
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-zinc-700 bg-gray-100 dark:bg-zinc-800 cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Bank Name</label>
            <input
              type="text"
              value={bankInfo.bankName}
              disabled
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-zinc-700 bg-gray-100 dark:bg-zinc-800 cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Bank Code</label>
            <input
              type="text"
              value={bankInfo.bankCode}
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
        <h3 className="text-lg font-bold text-red-600 dark:text-red-400 mb-4">Danger Zone</h3>
        <p className="text-red-700 dark:text-red-300 mb-4">
          Closing your store will make it unavailable to customers.
        </p>
        <button className="px-6 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white transition">
          Close Store
        </button>
      </div>
    </div>
  );
}
