'use client';

import { HelpCircle } from 'lucide-react';

export default function Support() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Help & Support</h2>
      <div className="bg-white dark:bg-zinc-900 rounded-lg p-6 border border-gray-200 dark:border-zinc-800">
        <div className="flex items-start gap-4">
          <HelpCircle className="h-12 w-12 text-gray-400 flex-shrink-0 mt-2" />
          <div>
            <h3 className="text-lg font-bold mb-3">Getting Help</h3>
            <div className="space-y-3 text-sm">
              <div>
                <p className="font-semibold text-gray-700 dark:text-gray-300">Contact Support</p>
                <p className="text-gray-600 dark:text-gray-400">Email: support@opnmart.com</p>
              </div>
              <div>
                <p className="font-semibold text-gray-700 dark:text-gray-300">FAQ</p>
                <p className="text-gray-600 dark:text-gray-400">Visit our knowledge base for common questions</p>
              </div>
              <div>
                <p className="font-semibold text-gray-700 dark:text-gray-300">Documentation</p>
                <p className="text-gray-600 dark:text-gray-400">Read our vendor documentation and guides</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
