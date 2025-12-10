'use client';

interface Category {
  id: string;
  name: string;
  icon: string;
  neon: string;
  subcategories: any[];
}

interface CategoryTabsProps {
  categories: Category[];
  activeCategory: string;
  onCategoryChange: (categoryId: string) => void;
}

export default function CategoryTabs({ categories, activeCategory, onCategoryChange }: CategoryTabsProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-3 md:gap-4 mb-8 sm:mb-12">
      {categories.map((category) => (
        <button
          key={category.id}
          onClick={() => onCategoryChange(category.id)}
          className={`relative group px-2 sm:px-3 lg:px-4 py-2 sm:py-2.5 lg:py-3 rounded-lg sm:rounded-xl lg:rounded-2xl font-bold text-xs sm:text-sm lg:text-base transition-all duration-500 transform overflow-hidden ${
            activeCategory === category.id
              ? `bg-gradient-to-br ${category.neon} text-black shadow-lg sm:shadow-2xl shadow-green-500/50 scale-100 sm:scale-105`
              : 'bg-gradient-to-br from-gray-100 to-gray-50 dark:from-zinc-800 dark:to-zinc-900 text-black dark:text-white border-2 border-gray-200 dark:border-zinc-700 hover:border-green-500 dark:hover:border-green-500 hover:shadow-lg'
          }`}
        >
          {/* Background animation for active state */}
          {activeCategory === category.id && (
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse" />
          )}
          
          <div className="relative z-10 flex items-center gap-1 sm:gap-1.5 flex-1">
            <span className="text-xl sm:text-2xl lg:text-3xl group-hover:scale-125 transition duration-300 flex-shrink-0">{category.icon}</span>
            <div className="text-left min-w-0">
              <div className="text-xs sm:text-sm lg:text-base font-bold leading-tight">{category.name}</div>
              <div className={`text-[9px] sm:text-xs ${activeCategory === category.id ? 'text-black/70' : 'text-gray-600 dark:text-gray-400'}`}>
                {category.subcategories.length} sub
              </div>
            </div>
            <span className="text-sm sm:text-base lg:text-lg group-hover:translate-x-1 transition duration-300 flex-shrink-0">→</span>
          </div>
        </button>
      ))}
    </div>
  );
}
