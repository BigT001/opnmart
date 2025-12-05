'use client';

import { BarChart2 } from 'lucide-react';

export default function Reports() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Business Reports</h2>
      <div className="bg-white dark:bg-zinc-900 rounded-lg p-12 border border-gray-200 dark:border-zinc-800 text-center">
        <BarChart2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600 dark:text-gray-400 text-lg">No reports available</p>
        <p className="text-gray-500 dark:text-gray-500 text-sm">
          Your business reports will appear here once you have sales data
        </p>
      </div>
    </div>
  );
}
