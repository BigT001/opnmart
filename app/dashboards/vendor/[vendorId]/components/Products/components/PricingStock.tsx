'use client';

interface PricingStockProps {
  price: string;
  oldPrice: string;
  stock: string;
  badge: string;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  errors: Record<string, string>;
}

export default function PricingStock({
  price,
  oldPrice,
  stock,
  badge,
  onInputChange,
  errors,
}: PricingStockProps) {
  return (
    <div className="pt-6 border-t border-gray-200 dark:border-zinc-800">
      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
        <span className="bg-green-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm">3</span>
        Pricing & Stock
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-bold text-gray-900 dark:text-white mb-2">
            Price (₦) <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            name="price"
            value={price}
            onChange={onInputChange}
            placeholder="95000"
            className={`w-full px-4 py-3 border-2 rounded-xl dark:bg-zinc-900 dark:text-white transition focus:outline-none focus:ring-2 focus:ring-green-500 ${
              errors.price ? 'border-red-500' : 'border-gray-300 dark:border-zinc-700'
            }`}
          />
          {errors.price && <p className="text-red-500 text-xs mt-2">{errors.price}</p>}
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-900 dark:text-white mb-2">
            Old Price (₦) <span className="text-gray-500 font-normal">(Optional)</span>
          </label>
          <input
            type="number"
            name="oldPrice"
            value={oldPrice}
            onChange={onInputChange}
            placeholder="110000"
            className="w-full px-4 py-3 border-2 border-gray-300 dark:border-zinc-700 rounded-xl dark:bg-zinc-900 dark:text-white transition focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-900 dark:text-white mb-2">
            Stock Quantity <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            name="stock"
            value={stock}
            onChange={onInputChange}
            placeholder="50"
            className={`w-full px-4 py-3 border-2 rounded-xl dark:bg-zinc-900 dark:text-white transition focus:outline-none focus:ring-2 focus:ring-green-500 ${
              errors.stock ? 'border-red-500' : 'border-gray-300 dark:border-zinc-700'
            }`}
          />
          {errors.stock && <p className="text-red-500 text-xs mt-2">{errors.stock}</p>}
        </div>
      </div>

      <div className="mt-4">
        <label className="block text-sm font-bold text-gray-900 dark:text-white mb-2">
          Product Badge <span className="text-gray-500 font-normal">(Optional)</span>
        </label>
        <select
          name="badge"
          value={badge}
          onChange={onInputChange}
          className="w-full px-4 py-3 border-2 border-gray-300 dark:border-zinc-700 rounded-xl dark:bg-zinc-900 dark:text-white transition focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          <option value="">No badge</option>
          <option value="🔥 Hot Deal">🔥 Hot Deal</option>
          <option value="⭐ New">⭐ New</option>
          <option value="💎 Premium">💎 Premium</option>
          <option value="🚀 Best Seller">🚀 Best Seller</option>
          <option value="📦 Limited">📦 Limited</option>
        </select>
      </div>
    </div>
  );
}
