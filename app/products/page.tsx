'use client';

import { useState, useMemo, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Search, ChevronDown, X, ShoppingCart } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useProducts } from '@/app/context/ProductContext';
import { useCart } from '@/app/context/CartContext';
import Link from 'next/link';
import ProductCard from '@/components/ProductCard';

const CONDITIONS = ['Brand New', 'UK Used', 'Refurbished', 'Used'];

function ProductsPageContent() {
  const { allProducts } = useProducts();
  const { addToCart } = useCart();
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedConditions, setSelectedConditions] = useState<string[]>([]);
  const [selectedPriceRange, setSelectedPriceRange] = useState<{ min: number; max: number } | null>(
    null
  );
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [expandedFilters, setExpandedFilters] = useState({
    price: true,
    condition: true,
    specs: true,
  });
  const [selectedSpecifications, setSelectedSpecifications] = useState<Record<string, string[]>>({});

  // Read brand from URL query parameter on mount
  useEffect(() => {
    const brandParam = searchParams.get('brand');
    if (brandParam) {
      setSelectedBrand(decodeURIComponent(brandParam));
    }
  }, [searchParams]);

  // Calculate dynamic price ranges based on products
  const dynamicPriceRanges = useMemo(() => {
    const productsToAnalyze = selectedBrand 
      ? allProducts.filter(p => p.brand === selectedBrand)
      : allProducts;

    if (productsToAnalyze.length === 0) return [];

    const prices = productsToAnalyze.map(p => p.price).sort((a, b) => a - b);
    const minPrice = prices[0];
    const maxPrice = prices[prices.length - 1];
    
    // Intelligently detect scale (thousands or millions)
    const isMillionScale = maxPrice >= 1000000;
    
    let roundedMin, roundedMax, rangeSize;
    
    if (isMillionScale) {
      // For millions, round to nearest 100k
      roundedMin = Math.floor(minPrice / 100000) * 100000;
      roundedMax = Math.ceil(maxPrice / 100000) * 100000;
    } else {
      // For thousands, round to nearest 10k
      roundedMin = Math.floor(minPrice / 10000) * 10000;
      roundedMax = Math.ceil(maxPrice / 10000) * 10000;
    }
    
    const priceRange = roundedMax - roundedMin;
    rangeSize = Math.ceil(priceRange / 5);

    // Create 5 price ranges
    const ranges = [];

    for (let i = 0; i < 5; i++) {
      const min = roundedMin + (i * rangeSize);
      const max = i === 4 ? Infinity : roundedMin + ((i + 1) * rangeSize);
      
      const formatPrice = (price: number) => {
        if (price === Infinity) return '';
        
        if (isMillionScale && price >= 1000000) {
          // Format as millions with 1 decimal place
          const millions = (price / 1000000).toFixed(1);
          return `₦${millions}M`;
        } else {
          // Format as thousands with commas
          return '₦' + Math.round(price).toLocaleString();
        }
      };

      const label = i === 0
        ? `Under ${formatPrice(max)}`
        : i === 4
        ? `${formatPrice(min)} & Above`
        : `${formatPrice(min)} - ${formatPrice(max)}`;

      ranges.push({ label, min, max });
    }

    return ranges;
  }, [allProducts, selectedBrand]);

  const filteredProducts = useMemo(() => {
    let products = [...allProducts];

    if (searchQuery) {
      products = products.filter((p) =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedConditions.length > 0) {
      products = products.filter((p) => p.condition && selectedConditions.includes(p.condition));
    }

    if (selectedPriceRange) {
      products = products.filter(
        (p) => p.price >= selectedPriceRange.min && p.price <= selectedPriceRange.max
      );
    }

    if (selectedBrand) {
      products = products.filter((p) => p.brand === selectedBrand);
    }

    // Apply specification filters
    if (Object.keys(selectedSpecifications).length > 0) {
      products = products.filter(product => {
        return Object.entries(selectedSpecifications).every(([specKey, specValues]) => {
          if (specValues.length === 0) return true;
          const productValue = product.specifications?.[specKey];
          return specValues.includes(productValue);
        });
      });
    }

    return products;
  }, [allProducts, searchQuery, selectedConditions, selectedPriceRange, selectedBrand, selectedSpecifications]);

  const brands = useMemo(
    () => [...new Set(allProducts.map((p) => p.brand))].filter(Boolean) as string[],
    [allProducts]
  );

  // Extract dynamic specification filters based on selected brand
  const specificationFilters = useMemo(() => {
    const specs: Record<string, Set<string>> = {};
    
    const brandProducts = selectedBrand 
      ? filteredProducts.filter(p => p.brand === selectedBrand)
      : filteredProducts;

    brandProducts.forEach(product => {
      if (product.specifications) {
        Object.entries(product.specifications).forEach(([key, value]) => {
          // Include string values and convert other types to string
          const stringValue = String(value);
          if (stringValue && !['true', 'false'].includes(stringValue.toLowerCase())) {
            if (!specs[key]) specs[key] = new Set();
            specs[key].add(stringValue);
          }
        });
      }
    });

    // Convert sets to sorted arrays, exclude certain keys
    const excludeKeys = ['imei_confirmed', 'condition_details', 'model_number', 'warranty_months', 'color'];
    const result: Record<string, string[]> = {};
    
    Object.entries(specs).forEach(([key, values]) => {
      // Show specs with 2+ values, or all specs if brand has only 1-2 products
      if (!excludeKeys.includes(key) && (values.size > 1 || brandProducts.length <= 2)) {
        result[key] = Array.from(values).sort();
      }
    });

    return result;
  }, [selectedBrand, filteredProducts]);

  const sidebarClasses = sidebarOpen
    ? 'block md:col-span-1 bg-gray-50 dark:bg-zinc-900 rounded-lg p-6 h-fit sticky top-24'
    : 'hidden md:col-span-1 bg-gray-50 dark:bg-zinc-900 rounded-lg p-6 h-fit sticky top-24';

  return (
    <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white">
      <header className="sticky top-0 z-40 bg-white/95 dark:bg-black/95 backdrop-blur border-b border-green-500/30 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4">
            <Link href="/" className="flex items-center gap-2 font-bold text-2xl">
              <span className="text-3xl">🛒</span>
              <span className="bg-gradient-to-r from-green-400 to-cyan-400 bg-clip-text text-transparent">
                OpnMart
              </span>
            </Link>

            <div className="flex-1 max-w-md">
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-full bg-gray-100 dark:bg-zinc-900 border border-green-500/50 py-2 pl-4 pr-10"
                />
                <Search className="absolute right-3 top-2.5 h-5 w-5 text-green-400" />
              </div>
            </div>

            <Link
              href="/"
              className="px-4 py-2 rounded-lg font-semibold text-sm bg-gradient-to-r from-green-500 to-cyan-500 text-black hover:shadow-lg"
            >
              Back Home
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className={sidebarClasses}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold">Filters</h3>
              <button
                onClick={() => setSidebarOpen(false)}
                className="md:hidden p-1 hover:bg-gray-200 dark:hover:bg-zinc-800 rounded"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mb-6">
              <button
                onClick={() =>
                  setExpandedFilters({ ...expandedFilters, price: !expandedFilters.price })
                }
                className="flex items-center justify-between w-full font-semibold mb-3 text-green-400 hover:text-green-300 transition"
              >
                <span>Price Range</span>
                <ChevronDown
                  className={`h-5 w-5 transition-transform ${
                    expandedFilters.price ? 'transform rotate-180' : ''
                  }`}
                />
              </button>
              {expandedFilters.price && (
                <div className="space-y-2">
                  {dynamicPriceRanges.map((range) => (
                    <label key={range.label} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="price"
                        checked={
                          selectedPriceRange?.min === range.min &&
                          selectedPriceRange?.max === range.max
                        }
                        onChange={() => setSelectedPriceRange(range)}
                        className="w-4 h-4 rounded border-gray-300"
                      />
                      <span className="text-sm">{range.label}</span>
                    </label>
                  ))}
                  {selectedPriceRange && (
                    <button
                      onClick={() => setSelectedPriceRange(null)}
                      className="text-xs text-green-500 hover:text-green-400 mt-2 font-semibold"
                    >
                      Clear Price Filter
                    </button>
                  )}
                </div>
              )}
            </div>

            <div className="mb-6">
              <button
                onClick={() =>
                  setExpandedFilters({
                    ...expandedFilters,
                    condition: !expandedFilters.condition,
                  })
                }
                className="flex items-center justify-between w-full font-semibold mb-3 text-green-400 hover:text-green-300 transition"
              >
                <span>Condition</span>
                <ChevronDown
                  className={`h-5 w-5 transition-transform ${
                    expandedFilters.condition ? 'transform rotate-180' : ''
                  }`}
                />
              </button>
              {expandedFilters.condition && (
                <div className="space-y-2">
                  {CONDITIONS.map((condition) => (
                    <label key={condition} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedConditions.includes(condition)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedConditions([...selectedConditions, condition]);
                          } else {
                            setSelectedConditions(
                              selectedConditions.filter((c) => c !== condition)
                            );
                          }
                        }}
                        className="w-4 h-4 rounded border-gray-300"
                      />
                      <span className="text-sm">{condition}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* Dynamic Specification Filters (shown when brand is selected) */}
            {selectedBrand && (
              <>
                {Object.keys(specificationFilters).length > 0 ? (
                  <div className="mb-6">
                    <button
                      onClick={() =>
                        setExpandedFilters({
                          ...expandedFilters,
                          specs: !expandedFilters.specs,
                        })
                      }
                      className="flex items-center justify-between w-full font-semibold mb-3 text-green-400 hover:text-green-300 transition"
                    >
                      <span>Specifications</span>
                      <ChevronDown
                        className={`h-5 w-5 transition-transform ${
                          expandedFilters.specs ? 'transform rotate-180' : ''
                        }`}
                      />
                    </button>
                    {expandedFilters.specs && (
                      <div className="space-y-4">
                        {Object.entries(specificationFilters).map(([specKey, specValues]) => (
                          <div key={specKey}>
                            <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2 capitalize">
                              {specKey.replace(/_/g, ' ')}
                            </p>
                            <div className="space-y-1">
                              {specValues.map((value) => (
                                <label key={value} className="flex items-center gap-2 cursor-pointer">
                                  <input
                                    type="checkbox"
                                    checked={(selectedSpecifications[specKey] || []).includes(value)}
                                    onChange={(e) => {
                                      const current = selectedSpecifications[specKey] || [];
                                      if (e.target.checked) {
                                        setSelectedSpecifications({
                                          ...selectedSpecifications,
                                          [specKey]: [...current, value],
                                        });
                                      } else {
                                        setSelectedSpecifications({
                                          ...selectedSpecifications,
                                          [specKey]: current.filter(v => v !== value),
                                        });
                                      }
                                    }}
                                    className="w-4 h-4 rounded border-gray-300"
                                  />
                                  <span className="text-sm">{value}</span>
                                </label>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="mb-6 p-3 bg-gray-200 dark:bg-gray-800 rounded-lg text-xs text-gray-600 dark:text-gray-400">
                    <p>No additional specifications available for {selectedBrand}</p>
                  </div>
                )}
              </>
            )}

            {(selectedConditions.length > 0 ||
              selectedPriceRange ||
              Object.keys(selectedSpecifications).some(key => selectedSpecifications[key].length > 0)) && (
              <button
                onClick={() => {
                  setSelectedConditions([]);
                  setSelectedPriceRange(null);
                  setSelectedSpecifications({});
                  // Keep the brand selected
                }}
                className="w-full py-2 rounded-lg bg-green-500 text-black font-semibold hover:bg-green-600 transition text-sm"
              >
                Reset Filters
              </button>
            )}
          </div>

          <div className="md:col-span-3">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold">
                {selectedBrand ? (
                  <>
                    {selectedBrand} <span className="text-green-400">({filteredProducts.length})</span>
                  </>
                ) : searchQuery ? (
                  <>
                    Results for "{searchQuery}" <span className="text-green-400">({filteredProducts.length})</span>
                  </>
                ) : selectedConditions.length > 0 ? (
                  <>
                    {selectedConditions.join(', ')} <span className="text-green-400">({filteredProducts.length})</span>
                  </>
                ) : (
                  <>
                    Products <span className="text-green-400">({filteredProducts.length})</span>
                  </>
                )}
              </h2>
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="md:hidden px-4 py-2 rounded-lg border border-green-500/50 text-sm font-semibold hover:bg-green-500/10"
              >
                <ChevronDown className="h-5 w-5" />
              </button>
            </div>

            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product, index) => (
                  <ProductCard key={product._id || `product-${index}`} product={product} variant="compact" />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-600 dark:text-gray-400 text-lg">
                  No products found matching your criteria
                </p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedConditions([]);
                    setSelectedPriceRange(null);
                    setSelectedBrand(null);
                  }}
                  className="mt-4 px-4 py-2 rounded-lg bg-green-500 text-black font-semibold hover:bg-green-600 transition"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center h-screen"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div></div>}>
      <ProductsPageContent />
    </Suspense>
  );
}