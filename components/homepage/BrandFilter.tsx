'use client';

import { useRouter } from 'next/navigation';

interface BrandFilterProps {
  brands: string[];
  selectedBrand: string | null;
  onBrandSelect: (brand: string | null) => void;
}

const BRAND_EMOJI_MAP: Record<string, string> = {
  'Samsung': '📱',
  'Apple': '🍎',
  'Google': '🔵',
  'Dell': '💻',
  'ASUS': '⚙️',
  'Canon': '📷',
  'Sony': '🎬',
  'LG': '❄️',
  'Elepaq': '⚡',
  'Honda': '🏍️',
  'Bose': '🎵',
  'JBL': '🔊',
  'Marshall': '🎸',
  'Anker': '🔋',
  'Audio-Technica': '🎤',
  'Shure': '🎙️',
  'Tecno': '📲',
  'Infinix': '⚡',
  'Itel': '🔌',
  'Nokia': '📞',
  'Huawei': '🌐',
  'OPPO': '🎨',
  'Xiaomi': '🔴',
  'Vivo': '🎭',
  'Freeyond': '✨',
  'Gionee': '💎',
  'HMD': '🏠',
  'Umidigi': '🌟',
};

export default function BrandFilter({
  brands,
  selectedBrand,
  onBrandSelect,
}: BrandFilterProps) {
  const router = useRouter();

  if (brands.length === 0) {
    return null;
  }

  const handleBrandClick = (brand: string) => {
    onBrandSelect(selectedBrand === brand ? null : brand);
    // Navigate to products page with brand filter
    router.push(`/products?brand=${encodeURIComponent(brand)}`);
  };

  return (
    <div className="mb-8">
      <div className="flex gap-3 flex-wrap">
        {brands.map((brand) => {
          const brandEmoji = BRAND_EMOJI_MAP[brand] || '✨';

          return (
            <button
              key={brand}
              onClick={() => handleBrandClick(brand)}
              className={`w-16 h-16 sm:w-20 sm:h-20 rounded-xl flex flex-col items-center justify-center gap-1 transition-all duration-300 font-semibold text-xs sm:text-sm cursor-pointer ${
                selectedBrand === brand
                  ? 'bg-gradient-to-br from-green-500 to-cyan-500 text-black shadow-lg shadow-green-500/50 scale-105'
                  : 'bg-gray-100 dark:bg-zinc-800 text-black dark:text-gray-300 hover:bg-green-500/20 dark:hover:bg-green-500/20 border border-gray-200 dark:border-zinc-700 hover:scale-105'
              }`}
              title={brand}
            >
              <span className="text-xl sm:text-2xl">{brandEmoji}</span>
              <span className="line-clamp-1">{brand}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

