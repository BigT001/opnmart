'use client';

import { DollarSign } from 'lucide-react';

export default function Revenue() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Revenue & Payments</h2>
      <div className="bg-white dark:bg-zinc-900 rounded-lg p-12 border border-gray-200 dark:border-zinc-800 text-center">
        <DollarSign className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600 dark:text-gray-400 text-lg">No revenue data</p>
        <p className="text-gray-500 dark:text-gray-500 text-sm">
          Your revenue and payment history will appear here
        </p>
      </div>
    </div>
  );
}
