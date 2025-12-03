'use client';

import { useState } from 'react';
import { SUBCATEGORIES, SUBCATEGORY_DETAILS, FILTER_OPTIONS } from '@/config/categories';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

// Icon mapping (using simple emoji for now, replace with lucide-react icons)
const ICON_MAP: Record<string, string> = {
  smartphone: '📱',
  zap: '⚡',
  laptop: '💻',
  monitor: '🖥️',
  keyboard: '⌨️',
  tablet: '📱',
  music: '🎵',
  gamepad2: '🎮',
  camera: '📷',
  wifi: '📡',
  'zap-off': '💡',
  briefcase: '💼',
  'battery-charging-2': '🔋',
};

export default function CategoriesPage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const categories = Object.entries(SUBCATEGORY_DETAILS).filter(([, details]) => {
    if (!searchQuery) return true;
    return details.name.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-3">
            Electronics Marketplace
          </h1>
          <p className="text-lg text-slate-600">
            Browse our complete selection of electronics, gadgets, and devices from Computer Village's finest merchants
          </p>
        </div>

        {/* Search */}
        <div className="mb-8">
          <div className="relative">
            <Input
              type="search"
              placeholder="Search categories... (e.g., 'laptop', 'phone', 'gaming')"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-6 py-3 text-lg"
            />
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="p-6 bg-white">
            <div className="text-3xl font-bold text-blue-600">10</div>
            <div className="text-sm text-slate-600">Main Categories</div>
          </Card>
          <Card className="p-6 bg-white">
            <div className="text-3xl font-bold text-green-600">50+</div>
            <div className="text-sm text-slate-600">Subcategories</div>
          </Card>
          <Card className="p-6 bg-white">
            <div className="text-3xl font-bold text-purple-600">200+</div>
            <div className="text-sm text-slate-600">Product Types</div>
          </Card>
          <Card className="p-6 bg-white">
            <div className="text-3xl font-bold text-orange-600">100+</div>
            <div className="text-sm text-slate-600">Brands</div>
          </Card>
        </div>

        {/* Categories Grid */}
        <div className="space-y-8">
          {categories.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-xl text-slate-600">No categories found matching "{searchQuery}"</p>
            </div>
          ) : (
            categories.map(([key, details]) => (
              <div key={key} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition">
                {/* Category Header */}
                <div className="bg-gradient-to-r from-slate-900 to-slate-700 p-6 text-white">
                  <div className="flex items-center gap-4">
                    <div className="text-4xl">{ICON_MAP[details.icon] || '📦'}</div>
                    <div className="flex-1">
                      <h2 className="text-2xl md:text-3xl font-bold">{details.name}</h2>
                      <p className="text-slate-200 text-sm md:text-base">{details.description}</p>
                    </div>
                  </div>
                </div>

                {/* Category Content */}
                <div className="p-6">
                  {/* Types/Items */}
                  {details.types && (
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900 mb-4">Available Options:</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {details.types.map((type: any) => (
                          <div
                            key={type.id}
                            className="border border-slate-200 rounded-lg p-4 hover:bg-slate-50 transition"
                          >
                            <h4 className="font-semibold text-slate-900 mb-2">{type.name}</h4>

                            {/* Brands */}
                            {type.brands && (
                              <div className="text-sm text-slate-600">
                                <p className="font-medium mb-1">Popular Brands:</p>
                                <div className="flex flex-wrap gap-1">
                                  {type.brands.slice(0, 5).map((brand: string) => (
                                    <span
                                      key={brand}
                                      className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs"
                                    >
                                      {brand}
                                    </span>
                                  ))}
                                  {type.brands.length > 5 && (
                                    <span className="text-slate-500 text-xs">
                                      +{type.brands.length - 5} more
                                    </span>
                                  )}
                                </div>
                              </div>
                            )}

                            {/* Items */}
                            {type.items && (
                              <div className="text-sm text-slate-600">
                                <p className="font-medium mb-1">Products:</p>
                                <ul className="space-y-1">
                                  {type.items.slice(0, 3).map((item: string) => (
                                    <li key={item} className="text-xs">
                                      • {item}
                                    </li>
                                  ))}
                                  {type.items.length > 3 && (
                                    <li className="text-xs text-slate-500">
                                      +{type.items.length - 3} more products
                                    </li>
                                  )}
                                </ul>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Filters */}
                  {details.filters && (
                    <div className="mt-6 pt-6 border-t border-slate-200">
                      <h3 className="text-lg font-semibold text-slate-900 mb-3">Available Filters:</h3>
                      <div className="flex flex-wrap gap-2">
                        {details.filters.map((filter: string) => (
                          <span key={filter} className="bg-slate-100 text-slate-700 px-3 py-1 rounded-full text-sm">
                            {filter.replace(/_/g, ' ')}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* CTA */}
                  <div className="mt-6">
                    <Button className="w-full">Browse {details.name}</Button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Filter Reference Section */}
        <div className="mt-16 bg-white rounded-xl shadow-md p-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Global Filters Available</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Condition */}
            <div>
              <h3 className="font-semibold text-slate-900 mb-3">Condition</h3>
              <ul className="space-y-2 text-slate-600">
                {FILTER_OPTIONS.condition.map((option) => (
                  <li key={option.value} className="text-sm">
                    • {option.label}
                  </li>
                ))}
              </ul>
            </div>

            {/* Warranty */}
            <div>
              <h3 className="font-semibold text-slate-900 mb-3">Warranty</h3>
              <ul className="space-y-2 text-slate-600">
                {FILTER_OPTIONS.warranty.map((option) => (
                  <li key={option.value} className="text-sm">
                    • {option.label}
                  </li>
                ))}
              </ul>
            </div>

            {/* Price Ranges */}
            <div>
              <h3 className="font-semibold text-slate-900 mb-3">Price Ranges</h3>
              <ul className="space-y-2 text-slate-600">
                {FILTER_OPTIONS.priceRanges.map((range, i) => (
                  <li key={i} className="text-sm">
                    • {range.label}
                  </li>
                ))}
              </ul>
            </div>

            {/* Delivery */}
            <div>
              <h3 className="font-semibold text-slate-900 mb-3">Delivery Options</h3>
              <ul className="space-y-2 text-slate-600">
                {FILTER_OPTIONS.deliveryOptions.map((option) => (
                  <li key={option} className="text-sm">
                    • {option}
                  </li>
                ))}
              </ul>
            </div>

            {/* Storage */}
            <div>
              <h3 className="font-semibold text-slate-900 mb-3">Storage Options</h3>
              <ul className="space-y-2 text-slate-600">
                {FILTER_OPTIONS.storageOptions.map((option) => (
                  <li key={option} className="text-sm">
                    • {option}
                  </li>
                ))}
              </ul>
            </div>

            {/* RAM */}
            <div>
              <h3 className="font-semibold text-slate-900 mb-3">RAM Options</h3>
              <ul className="space-y-2 text-slate-600">
                {FILTER_OPTIONS.ramOptions.map((option) => (
                  <li key={option} className="text-sm">
                    • {option}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
