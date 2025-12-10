/**
 * Homepage Categories Configuration
 * Centralized category structure for the marketplace homepage
 * Easy to scale and maintain as new categories are added
 */

export interface SubcategoryItem {
  id: string;
  name: string;
  icon: string;
  count?: number;
}

export interface CategoryItem {
  id: string;
  name: string;
  icon: string;
  neon: string;
  subcategories: SubcategoryItem[];
}

export const HOMEPAGE_CATEGORIES: CategoryItem[] = [
  {
    id: 'electronics',
    name: 'Electronics',
    icon: '📱',
    neon: 'from-cyan-400 to-green-400',
    subcategories: [
      { id: 'mobile_phones', name: 'Mobile Phones', icon: '📱' },
      { id: 'televisions', name: 'Televisions (TVs)', icon: '📺' },
      { id: 'laptops', name: 'Laptops', icon: '💻' },
      { id: 'tablets', name: 'Tablets', icon: '📱' },
      { id: 'cameras', name: 'Cameras', icon: '📷' },
      { id: 'headphones', name: 'Headphones', icon: '🎧' },
      { id: 'speakers', name: 'Speakers', icon: '🔊' },
      { id: 'microphones', name: 'Microphones', icon: '🎤' },
      { id: 'power_banks', name: 'Power Banks', icon: '🔋' },
    ],
  },
  {
    id: 'appliances',
    name: 'Appliances',
    icon: '🏠',
    neon: 'from-blue-400 to-cyan-400',
    subcategories: [
      { id: 'refrigerators', name: 'Refrigerators & Freezers', icon: '🧊' },
      { id: 'ac', name: 'Air Conditioners', icon: '❄️' },
      { id: 'generators', name: 'Generators & Power', icon: '⚡' },
      { id: 'washing_machines', name: 'Washing Machines', icon: '🌊' },
      { id: 'cookers_ovens', name: 'Cookers & Ovens', icon: '🔥' },
      { id: 'cleaning_appliances', name: 'Cleaning Appliances', icon: '🧹' },
      { id: 'fans_cooling', name: 'Fans & Cooling', icon: '🌀' },
      { id: 'inverter_solar', name: 'Inverter & Solar', icon: '☀️' },
      { id: 'kitchen_appliances', name: 'Kitchen Appliances', icon: '🍽️' },
      { id: 'home_appliances', name: 'Home Appliances', icon: '🏠' },
    ],
  },
  {
    id: 'furniture',
    name: 'Furniture',
    icon: '🛋️',
    neon: 'from-orange-400 to-red-400',
    subcategories: [
      { id: 'sofas', name: 'Sofas & Chairs', icon: '🛋️' },
      { id: 'beds', name: 'Beds & Mattresses', icon: '🛏️' },
      { id: 'tables', name: 'Tables & Desks', icon: '📦' },
      { id: 'storage', name: 'Storage & Shelves', icon: '🗄️' },
      { id: 'lighting', name: 'Lighting', icon: '💡' },
    ],
  },
  {
    id: 'grocery',
    name: 'Grocery Store',
    icon: '🛒',
    neon: 'from-yellow-400 to-orange-400',
    subcategories: [
      { id: 'fresh_produce', name: 'Fresh Produce', icon: '🥬' },
      { id: 'dairy', name: 'Dairy & Eggs', icon: '🥛' },
      { id: 'beverages', name: 'Beverages', icon: '🥤' },
      { id: 'snacks', name: 'Snacks & Treats', icon: '🍪' },
      { id: 'spices', name: 'Spices & Seasonings', icon: '🌶️' },
    ],
  },
  {
    id: 'fashion',
    name: 'Fashion',
    icon: '👗',
    neon: 'from-pink-400 to-purple-400',
    subcategories: [
      { id: 'mens_clothing', name: "Men's Clothing", icon: '👔' },
      { id: 'womens_clothing', name: "Women's Clothing", icon: '👗' },
      { id: 'kids_clothing', name: "Kids' Clothing", icon: '👶' },
      { id: 'footwear', name: 'Footwear', icon: '👟' },
      { id: 'bags', name: 'Bags & Accessories', icon: '👜' },
      { id: 'watches', name: 'Watches', icon: '⌚' },
      { id: 'jewelry', name: 'Jewelry', icon: '💍' },
      { id: 'mens_traditional', name: 'Traditional Wear', icon: '👘' },
      { id: 'swimwear', name: 'Swimwear', icon: '🩱' },
    ],
  },
];
