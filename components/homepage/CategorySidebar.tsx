'use client';

interface Subcategory {
  id: string;
  name: string;
  icon: string;
  count?: number;
}

interface CategorySidebarProps {
  categoryName: string;
  subcategories: Subcategory[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
  expandedMenu: boolean;
  onExpandMenu: () => void;
}

export default function CategorySidebar({
  categoryName,
  subcategories,
  activeTab,
  onTabChange,
  expandedMenu,
  onExpandMenu,
}: CategorySidebarProps) {
  return (
    <div className="lg:col-span-1">
      <div className="sticky top-20 max-h-[calc(100vh-88px)] overflow-y-auto scrollbar-hide bg-white/50 dark:bg-zinc-900/30 backdrop-blur-sm rounded-xl border border-gray-200 dark:border-zinc-800 p-4">
        {/* Header with label */}
        <div className="flex items-center gap-2 mb-4 pb-4 border-b border-gray-200 dark:border-zinc-800">
          <div className="w-1 h-4 bg-gradient-to-b from-green-500 to-cyan-500 rounded-full"></div>
          <p className="text-sm font-bold text-gray-600 dark:text-gray-400 uppercase tracking-widest">
            {categoryName}
          </p>
        </div>
        
        {/* Vertical Tabs Container */}
        <div className="flex flex-col gap-2">
          {/* All Category Button */}
          <button
            onClick={() => onTabChange('all')}
            className={`px-4 py-3 rounded-lg text-sm font-semibold transition-all duration-300 flex items-center gap-2 text-left ${
              activeTab === 'all'
                ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-black shadow-md shadow-green-500/30'
                : 'bg-gray-100 dark:bg-zinc-800/50 text-black dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-zinc-700/50'
            }`}
          >
            <span className="text-lg flex-shrink-0">✨</span>
            <span className="flex-1">All Products</span>
          </button>

          {/* Subcategory Buttons - Limited to 5 items */}
          {subcategories.slice(0, expandedMenu ? undefined : 5).map((sub) => (
            <button
              key={sub.id}
              onClick={() => onTabChange(sub.id)}
              className={`px-3 py-2 rounded-lg text-xs font-semibold transition-all duration-300 flex items-center gap-2 text-left ${
                activeTab === sub.id
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-black shadow-md shadow-cyan-500/30'
                  : 'bg-gray-100 dark:bg-zinc-800/50 text-black dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-zinc-700/50'
              }`}
            >
              <span className="text-base flex-shrink-0">{sub.icon}</span>
              <div className="flex-1 text-left flex items-center justify-between gap-2">
                <div>{sub.name}</div>
                <div className={`text-xs font-normal whitespace-nowrap ${
                  activeTab === sub.id ? 'text-black/60' : 'text-gray-500 dark:text-gray-500'
                }`}>
                  {sub.count}
                </div>
              </div>
            </button>
          ))}

          {/* See More Button - Show if more than 5 items */}
          {subcategories.length > 5 && (
            <button
              onClick={onExpandMenu}
              className="px-4 py-3 rounded-lg text-sm font-semibold transition-all duration-300 flex items-center justify-center gap-2 bg-gradient-to-r from-green-500/20 to-cyan-500/20 text-green-600 dark:text-green-400 hover:from-green-500/40 hover:to-cyan-500/40 border border-green-500/30 dark:border-green-500/50"
            >
              <span>{expandedMenu ? '↑ See Less' : '↓ See More'}</span>
              <span className="text-lg">{expandedMenu ? '⬆' : '⬇'}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
