'use client';

import { Package, Plus, Layers, Settings } from 'lucide-react';

interface TabNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  productCount: number;
}

export default function TabNav({ activeTab, onTabChange, productCount }: TabNavProps) {
  const tabs = [
    { id: 'all', label: 'All Products', icon: Package },
    { id: 'new', label: 'Add New Product', icon: Plus },
    { id: 'variants', label: 'Manage Variants', icon: Layers },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="flex flex-wrap gap-2 mb-6 border-b border-gray-200 dark:border-zinc-800">
      {tabs.map(tab => {
        const Icon = tab.icon;
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex items-center gap-2 px-4 py-3 font-semibold transition border-b-2 ${
              activeTab === tab.id
                ? 'border-green-500 text-green-600 dark:text-green-400'
                : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300'
            }`}
          >
            <Icon className="h-4 w-4" />
            {tab.label}
            {tab.id === 'all' && productCount > 0 && (
              <span className="ml-2 px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs rounded-full font-bold">
                {productCount}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
