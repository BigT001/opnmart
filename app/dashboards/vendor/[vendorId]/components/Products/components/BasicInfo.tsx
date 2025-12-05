'use client';

interface BasicInfoProps {
  name: string;
  description: string;
  brand: string;
  condition: string;
  category: string;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  getBrandsBySubcategory: () => string[];
  errors: Record<string, string>;
}

export default function BasicInfo({
  name,
  description,
  brand,
  condition,
  category,
  onInputChange,
  getBrandsBySubcategory,
  errors,
}: BasicInfoProps) {
  return (
    <div className="pt-6 border-t border-gray-200 dark:border-zinc-800">
      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
        <span className="bg-green-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm">2</span>
        Basic Information
      </h3>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-bold text-gray-900 dark:text-white mb-2">
            Product Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="name"
            value={name}
            onChange={onInputChange}
            placeholder="e.g., Samsung Galaxy A14 5G"
            className={`w-full px-4 py-3 border-2 rounded-xl dark:bg-zinc-900 dark:text-white transition focus:outline-none focus:ring-2 focus:ring-green-500 ${
              errors.name ? 'border-red-500' : 'border-gray-300 dark:border-zinc-700'
            }`}
          />
          {errors.name && <p className="text-red-500 text-sm mt-2">{errors.name}</p>}
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-900 dark:text-white mb-2">
            Description <span className="text-red-500">*</span>
          </label>
          <textarea
            name="description"
            value={description}
            onChange={onInputChange}
            placeholder="Write a compelling description of your product..."
            rows={4}
            className={`w-full px-4 py-3 border-2 rounded-xl dark:bg-zinc-900 dark:text-white transition focus:outline-none focus:ring-2 focus:ring-green-500 ${
              errors.description ? 'border-red-500' : 'border-gray-300 dark:border-zinc-700'
            }`}
          />
          {errors.description && <p className="text-red-500 text-sm mt-2">{errors.description}</p>}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-bold text-gray-900 dark:text-white mb-2">
              Brand {category === 'grocery' ? <span className="text-gray-500 font-normal">(Optional)</span> : <span className="text-red-500">*</span>}
            </label>
            <select
              name="brand"
              value={brand}
              onChange={onInputChange}
              className={`w-full px-4 py-3 border-2 rounded-xl dark:bg-zinc-900 dark:text-white transition focus:outline-none focus:ring-2 focus:ring-green-500 ${
                errors.brand ? 'border-red-500' : 'border-gray-300 dark:border-zinc-700'
              }`}
            >
              <option value="">Select brand{category === 'grocery' ? ' (optional)' : ''}</option>
              {category === 'grocery' && (
                <option value="None">None</option>
              )}
              {getBrandsBySubcategory().map(brand => (
                <option key={brand} value={brand}>
                  {brand}
                </option>
              ))}
            </select>
            {errors.brand && <p className="text-red-500 text-sm mt-2">{errors.brand}</p>}
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-900 dark:text-white mb-2">
              {category === 'grocery' ? 'Freshness' : 'Condition'}
            </label>
            <select
              name="condition"
              value={condition}
              onChange={onInputChange}
              className="w-full px-4 py-3 border-2 border-gray-300 dark:border-zinc-700 rounded-xl dark:bg-zinc-900 dark:text-white transition focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              {category === 'grocery' ? (
                <>
                  <option value="Fresh">🥬 Fresh</option>
                  <option value="Ripe">🍌 Ripe</option>
                  <option value="Good">✅ Good</option>
                  <option value="Fair">⚠️ Fair</option>
                </>
              ) : (
                <>
                  <option value="Brand New">✨ Brand New</option>
                  <option value="Like New">⭐ Like New</option>
                  <option value="Refurbished">🔧 Refurbished</option>
                  <option value="Used">📦 Used</option>
                </>
              )}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
