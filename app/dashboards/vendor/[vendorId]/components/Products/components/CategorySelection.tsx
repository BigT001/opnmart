'use client';

interface CategorySelectionProps {
  category: string;
  subcategory: string;
  onCategoryChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onSubcategoryChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  categories: Record<string, string[]>;
  subcategoryMap: Record<string, string>;
  errors: Record<string, string>;
}

export default function CategorySelection({
  category,
  subcategory,
  onCategoryChange,
  onSubcategoryChange,
  categories,
  subcategoryMap,
  errors,
}: CategorySelectionProps) {
  return (
    <div className="bg-gradient-to-br from-green-50 to-cyan-50 dark:from-green-950/20 dark:to-cyan-950/20 rounded-2xl p-6 border-2 border-green-200 dark:border-green-800">
      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
        <span className="bg-green-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm">1</span>
        Select Product Category & Type
      </h3>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-bold text-gray-900 dark:text-white mb-2">
            Main Category <span className="text-red-500">*</span>
          </label>
          <select
            name="category"
            value={category}
            onChange={onCategoryChange}
            className="w-full px-4 py-3 border-2 border-green-300 dark:border-green-700 rounded-xl dark:bg-zinc-900 dark:text-white transition focus:outline-none focus:ring-2 focus:ring-green-500 font-semibold"
          >
            <option value="electronics">🖥️ Electronics</option>
            <option value="appliances">🔌 Appliances</option>
            <option value="furniture">🪑 Furniture</option>
            <option value="grocery">🛒 Grocery Store</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-900 dark:text-white mb-2">
            Product Type <span className="text-red-500">*</span>
          </label>
          <select
            name="subcategory"
            value={subcategory}
            onChange={onSubcategoryChange}
            className={`w-full px-4 py-3 border-2 rounded-xl dark:bg-zinc-900 dark:text-white transition focus:outline-none focus:ring-2 focus:ring-green-500 font-semibold ${
              errors.subcategory ? 'border-red-500' : 'border-green-300 dark:border-green-700'
            }`}
          >
            <option value="">🔍 Choose product type...</option>
            {categories[category as keyof typeof categories].map(sub => (
              <option key={sub} value={sub}>
                {subcategoryMap[sub] || sub}
              </option>
            ))}
          </select>
          {errors.subcategory && <p className="text-red-500 text-sm mt-2 font-semibold">{errors.subcategory}</p>}
        </div>
      </div>
    </div>
  );
}
