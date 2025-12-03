'use client';

import Link from 'next/link';
import { Search, ShoppingCart, Menu, Star, Package } from 'lucide-react';
import { useState, useMemo } from 'react';
import { Input } from '@/components/ui/input';

// Empty products array - products come from vendor uploads
const MOCK_PRODUCTS: any[] = [];

export default function ProductsPage() {
  const [priceRange, setPriceRange] = useState([0, 500000]);
  const [selectedCondition, setSelectedCondition] = useState('all');
  const [selectedBrand, setSelectedBrand] = useState('all');
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredProducts = useMemo(() => {
    return MOCK_PRODUCTS.filter((product) => {
      const priceMatch = product.price >= priceRange[0] && product.price <= priceRange[1];
      const conditionMatch = selectedCondition === 'all' || product.condition === selectedCondition;
      const brandMatch = selectedBrand === 'all' || product.brand === selectedBrand;
      const searchMatch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
      return priceMatch && conditionMatch && brandMatch && searchMatch;
    });
  }, [priceRange, selectedCondition, selectedBrand, searchQuery]);

  const formatPrice = (price: number) => {
    return '₦' + price.toLocaleString();
  };

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-black/95 backdrop-blur border-b border-green-500/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2 font-bold text-2xl">
              <span className="text-3xl">🛒</span>
              <span className="bg-gradient-to-r from-green-400 to-cyan-400 bg-clip-text text-transparent">OpnMart</span>
            </Link>
            <div className="flex-1 max-w-md mx-6 hidden md:flex">
              <div className="relative w-full">
                <Input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-full bg-zinc-900 border border-green-500/50 py-2 pl-4 pr-10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                <Search className="absolute right-3 top-2.5 h-5 w-5 text-green-400" />
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/cart" className="p-2 text-gray-300 hover:text-green-400 transition">
                <ShoppingCart className="h-6 w-6" />
              </Link>
              <button className="md:hidden p-2 text-gray-300 hover:text-green-400" onClick={() => setMobileFiltersOpen(true)}>
                <Menu className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Sidebar Filters */}
          <div className={`md:col-span-1 ${mobileFiltersOpen ? 'fixed inset-0 z-50 bg-black p-6 overflow-y-auto border border-green-500/30' : 'hidden md:block'}`}>
            {mobileFiltersOpen && (
              <button onClick={() => setMobileFiltersOpen(false)} className="mb-4 text-green-400 hover:text-green-300 flex items-center gap-2">
                ← Back
              </button>
            )}
            <div className="space-y-6">
              {/* Price Filter */}
              <div>
                <h3 className="font-bold text-green-400 mb-4">Price Range</h3>
                <div className="space-y-3">
                  {[
                    { min: 0, max: 50000, label: '₦0 - ₦50K' },
                    { min: 50000, max: 100000, label: '₦50K - ₦100K' },
                    { min: 100000, max: 250000, label: '₦100K - ₦250K' },
                    { min: 250000, max: 500000, label: '₦250K - ₦500K' },
                    { min: 500000, max: 2000000, label: '₦500K+' },
                  ].map((range) => (
                    <label key={range.label} className="flex items-center gap-2 cursor-pointer text-white/80 hover:text-white transition">
                      <input
                        type="radio"
                        name="price"
                        onChange={() => setPriceRange([range.min, range.max])}
                        className="w-4 h-4 rounded cursor-pointer accent-green-500"
                      />
                      <span className="text-sm">{range.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Condition Filter */}
              <div className="border-t border-green-500/30 pt-4">
                <h3 className="font-bold text-green-400 mb-4">Condition</h3>
                <div className="space-y-3">
                  {[
                    { value: 'all', label: 'All Conditions' },
                    { value: 'Brand New', label: 'Brand New' },
                    { value: 'UK Used', label: 'UK Used' },
                    { value: 'Refurbished', label: 'Refurbished' },
                    { value: 'Used', label: 'Used' },
                  ].map((cond) => (
                    <label key={cond.value} className="flex items-center gap-2 cursor-pointer text-white/80 hover:text-white transition">
                      <input
                        type="radio"
                        name="condition"
                        value={cond.value}
                        onChange={(e) => setSelectedCondition(e.target.value)}
                        checked={selectedCondition === cond.value}
                        className="w-4 h-4 rounded cursor-pointer accent-green-500"
                      />
                      <span className="text-sm">{cond.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Brand Filter */}
              <div className="border-t border-green-500/30 pt-4">
                <h3 className="font-bold text-green-400 mb-4">Brands</h3>
                <div className="space-y-3">
                  {[
                    { value: 'all', label: 'All Brands' },
                    { value: 'Samsung', label: 'Samsung' },
                    { value: 'Apple', label: 'Apple' },
                    { value: 'Dell', label: 'Dell' },
                    { value: 'Sony', label: 'Sony' },
                    { value: 'LG', label: 'LG' },
                    { value: 'Canon', label: 'Canon' },
                  ].map((brand) => (
                    <label key={brand.value} className="flex items-center gap-2 cursor-pointer text-white/80 hover:text-white transition">
                      <input
                        type="radio"
                        name="brand"
                        value={brand.value}
                        onChange={(e) => setSelectedBrand(e.target.value)}
                        checked={selectedBrand === brand.value}
                        className="w-4 h-4 rounded cursor-pointer accent-green-500"
                      />
                      <span className="text-sm">{brand.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="md:col-span-3">
            <div className="mb-6">
              <h2 className="text-3xl font-bold text-white mb-2">All Products</h2>
              <p className="text-gray-400">{filteredProducts.length} products found</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <Link
                  key={product.id}
                  href={`/products/${product.id}`}
                  className="group bg-zinc-900/50 rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl hover:shadow-green-500/20 hover:-translate-y-1 transition duration-300 border border-green-500/20 hover:border-green-500/50"
                >
                  {/* Product Image */}
                  <div className="relative bg-gradient-to-br from-zinc-800 to-black h-64 overflow-hidden flex items-center justify-center">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                    />
                    {product.discount > 0 && (
                      <div className="absolute top-3 right-3 bg-gradient-to-r from-green-500 to-cyan-500 text-black text-xs font-bold px-3 py-1 rounded-full shadow-lg shadow-green-500/50">
                        -{product.discount}%
                      </div>
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="p-5">
                    <p className="text-xs text-green-400 uppercase tracking-widest font-semibold mb-2">
                      {product.category}
                    </p>
                    <h3 className="font-bold text-white line-clamp-2 mb-3 group-hover:text-green-400 transition">
                      {product.name}
                    </h3>

                    {/* Rating */}
                    <div className="flex items-center gap-2 mb-3">
                      <div className="flex text-green-400">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${i < product.rating ? 'fill-green-400' : 'text-gray-700'}`}
                          />
                        ))}
                      </div>
                      <span className="text-xs text-gray-400">({product.reviews})</span>
                    </div>

                    {/* Condition Badge */}
                    <p className="text-xs font-semibold text-green-400 mb-3 bg-green-500/10 py-1 px-2 rounded inline-block border border-green-500/30">
                      {product.condition}
                    </p>

                    {/* Price */}
                    <div className="flex items-baseline gap-2 mb-4">
                      <span className="text-2xl font-bold text-transparent bg-gradient-to-r from-green-400 to-cyan-400 bg-clip-text">
                        {formatPrice(product.price)}
                      </span>
                      {product.oldPrice && (
                        <span className="text-sm text-gray-600 line-through">
                          {formatPrice(product.oldPrice)}
                        </span>
                      )}
                    </div>

                    {/* Add to Cart */}
                    <button className="w-full py-3 bg-gradient-to-r from-green-500 to-cyan-500 text-black rounded-xl font-semibold hover:shadow-lg hover:shadow-green-500/50 transition">
                      Add to Cart
                    </button>
                  </div>
                </Link>
              ))}
            </div>

            {filteredProducts.length === 0 && (
              <div className="text-center py-12">
                <p className="text-xl text-gray-400">No products match your filters.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
