/**
 * Database Seeding API Route
 * POST /api/seed - Initializes database with all categories, subcategories, and filters
 */

import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/services/db/mongoose';
import { Category } from '@/models/Category';
import { Subcategory } from '@/models/Subcategory';
import { Filter } from '@/models/Filter';

const ELECTRONICS_DATA = {
  id: 'electronics',
  name: 'Electronics',
  icon: '📱',
  description: 'Mobile phones, computers, accessories, and more',
};

const APPLIANCES_DATA = {
  id: 'appliances',
  name: 'Home & Appliances',
  icon: '🏠',
  description: 'AC, refrigerators, generators, kitchen & home appliances',
};

const ELECTRONICS_SUBCATEGORIES = [
  {
    id: 'mobile_phones',
    categoryId: 'electronics',
    name: 'Mobile Phones',
    icon: '📱',
    description: 'Smartphones and feature phones',
    displayOrder: 1,
  },
  {
    id: 'phone_accessories',
    categoryId: 'electronics',
    name: 'Phone Accessories',
    icon: '🔌',
    description: 'Chargers, cables, cases, and more',
    displayOrder: 2,
  },
  {
    id: 'laptops',
    categoryId: 'electronics',
    name: 'Laptops',
    icon: '💻',
    description: 'Gaming, business, and student laptops',
    displayOrder: 3,
  },
  {
    id: 'desktop_computers',
    categoryId: 'electronics',
    name: 'Desktop Computers',
    icon: '🖥️',
    description: 'CPUs and all-in-one PCs',
    displayOrder: 4,
  },
  {
    id: 'computer_accessories',
    categoryId: 'electronics',
    name: 'Computer Accessories',
    icon: '⌨️',
    description: 'Keyboards, mouse, storage, and more',
    displayOrder: 5,
  },
  {
    id: 'tablets',
    categoryId: 'electronics',
    name: 'Tablets',
    icon: '📱',
    description: 'iPads and Android tablets',
    displayOrder: 6,
  },
  {
    id: 'audio_music',
    categoryId: 'electronics',
    name: 'Audio & Music',
    icon: '🎵',
    description: 'Speakers, headphones, and audio equipment',
    displayOrder: 7,
  },
  {
    id: 'gaming',
    categoryId: 'electronics',
    name: 'Gaming',
    icon: '🎮',
    description: 'Consoles, controllers, and gaming gear',
    displayOrder: 8,
  },
  {
    id: 'cameras',
    categoryId: 'electronics',
    name: 'Cameras',
    icon: '📷',
    description: 'DSLR, mirrorless, and photography equipment',
    displayOrder: 9,
  },
  {
    id: 'networking',
    categoryId: 'electronics',
    name: 'Networking',
    icon: '📡',
    description: 'Routers, MiFi, and networking equipment',
    displayOrder: 10,
  },
  {
    id: 'smart_gadgets',
    categoryId: 'electronics',
    name: 'Smart Gadgets',
    icon: '⌚',
    description: 'Smartwatches and IoT devices',
    displayOrder: 11,
  },
  {
    id: 'office_electronics',
    categoryId: 'electronics',
    name: 'Office Electronics',
    icon: '🖨️',
    description: 'Printers, scanners, and office equipment',
    displayOrder: 12,
  },
  {
    id: 'power_energy',
    categoryId: 'electronics',
    name: 'Power & Energy',
    icon: '🔋',
    description: 'Power supplies and energy solutions',
    displayOrder: 13,
  },
];

const APPLIANCES_SUBCATEGORIES = [
  {
    id: 'ac',
    categoryId: 'appliances',
    name: 'Air Conditioners',
    icon: '❄️',
    description: 'Split, window, standing, and portable AC units',
    displayOrder: 1,
  },
  {
    id: 'refrigerators',
    categoryId: 'appliances',
    name: 'Refrigerators & Freezers',
    icon: '🧊',
    description: 'Fridges, freezers, and cooling solutions',
    displayOrder: 2,
  },
  {
    id: 'generators',
    categoryId: 'appliances',
    name: 'Generators & Power',
    icon: '⚡',
    description: 'Generators, inverters, solar, and power equipment',
    displayOrder: 3,
  },
  {
    id: 'kitchen_appliances',
    categoryId: 'appliances',
    name: 'Kitchen Appliances',
    icon: '🍳',
    description: 'Microwave, cookers, blenders, and kitchen gadgets',
    displayOrder: 4,
  },
  {
    id: 'home_appliances',
    categoryId: 'appliances',
    name: 'Home Appliances',
    icon: '🏠',
    description: 'Washing machines, dishwashers, and home gadgets',
    displayOrder: 5,
  },
];

const FILTERS_DATA = [
  {
    id: 'brand_electronics',
    categoryId: 'electronics',
    name: 'Brand',
    type: 'checkbox',
    options: [
      { value: 'samsung', label: 'Samsung' },
      { value: 'apple', label: 'Apple' },
      { value: 'lg', label: 'LG' },
      { value: 'hp', label: 'HP' },
      { value: 'dell', label: 'Dell' },
      { value: 'lenovo', label: 'Lenovo' },
      { value: 'asus', label: 'ASUS' },
      { value: 'sony', label: 'Sony' },
      { value: 'nikon', label: 'Nikon' },
      { value: 'canon', label: 'Canon' },
    ],
    displayOrder: 1,
  },
  {
    id: 'condition_electronics',
    categoryId: 'electronics',
    name: 'Condition',
    type: 'checkbox',
    options: [
      { value: 'brand_new', label: 'Brand New' },
      { value: 'uk_used', label: 'UK Used' },
      { value: 'refurbished', label: 'Refurbished' },
      { value: 'used', label: 'Used' },
    ],
    displayOrder: 2,
  },
  {
    id: 'price_range_electronics',
    categoryId: 'electronics',
    name: 'Price Range',
    type: 'range',
    options: [
      { value: '0-10000', label: '₦0 - ₦10,000' },
      { value: '10000-50000', label: '₦10,000 - ₦50,000' },
      { value: '50000-100000', label: '₦50,000 - ₦100,000' },
      { value: '100000-500000', label: '₦100,000 - ₦500,000' },
      { value: '500000-1000000', label: '₦500,000 - ₦1,000,000' },
      { value: '1000000+', label: '₦1,000,000+' },
    ],
    displayOrder: 3,
  },
  {
    id: 'warranty_electronics',
    categoryId: 'electronics',
    name: 'Warranty',
    type: 'checkbox',
    options: [
      { value: 'no_warranty', label: 'No Warranty' },
      { value: '3_months', label: '3 Months' },
      { value: '6_months', label: '6 Months' },
      { value: '1_year', label: '1 Year' },
      { value: '2_years', label: '2 Years' },
      { value: '3_years', label: '3 Years' },
    ],
    displayOrder: 4,
  },
  {
    id: 'brand_appliances',
    categoryId: 'appliances',
    name: 'Brand',
    type: 'checkbox',
    options: [
      { value: 'lg', label: 'LG' },
      { value: 'samsung', label: 'Samsung' },
      { value: 'hisense', label: 'Hisense' },
      { value: 'scanfrost', label: 'Scanfrost' },
      { value: 'haier', label: 'Haier Thermocool' },
      { value: 'panasonic', label: 'Panasonic' },
      { value: 'midea', label: 'Midea' },
    ],
    displayOrder: 1,
  },
  {
    id: 'condition_appliances',
    categoryId: 'appliances',
    name: 'Condition',
    type: 'checkbox',
    options: [
      { value: 'brand_new', label: 'Brand New' },
      { value: 'used', label: 'Used' },
      { value: 'refurbished', label: 'Refurbished' },
    ],
    displayOrder: 2,
  },
  {
    id: 'price_range_appliances',
    categoryId: 'appliances',
    name: 'Price Range',
    type: 'range',
    options: [
      { value: '0-50000', label: '₦0 - ₦50,000' },
      { value: '50000-150000', label: '₦50,000 - ₦150,000' },
      { value: '150000-500000', label: '₦150,000 - ₦500,000' },
      { value: '500000-1000000', label: '₦500,000 - ₦1,000,000' },
      { value: '1000000+', label: '₦1,000,000+' },
    ],
    displayOrder: 3,
  },
];

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    // Check if data already seeded
    const existingCategories = await Category.countDocuments();
    if (existingCategories > 0) {
      return NextResponse.json({
        success: false,
        message: 'Database already seeded. Delete existing data to reseed.',
        currentCount: {
          categories: existingCategories,
          subcategories: await Subcategory.countDocuments(),
          filters: await Filter.countDocuments(),
        },
      });
    }

    // Seed categories
    const categories = await Category.insertMany([
      { ...ELECTRONICS_DATA, displayOrder: 1 },
      { ...APPLIANCES_DATA, displayOrder: 2 },
    ]);

    // Seed subcategories
    const subcategories = await Subcategory.insertMany([
      ...ELECTRONICS_SUBCATEGORIES,
      ...APPLIANCES_SUBCATEGORIES,
    ]);

    // Seed filters
    const filters = await Filter.insertMany(FILTERS_DATA);

    return NextResponse.json({
      success: true,
      message: 'Database seeded successfully!',
      data: {
        categories: {
          count: categories.length,
          items: categories.map((c) => c.id),
        },
        subcategories: {
          count: subcategories.length,
          byCategory: {
            electronics: subcategories.filter((s) => s.categoryId === 'electronics').length,
            appliances: subcategories.filter((s) => s.categoryId === 'appliances').length,
          },
        },
        filters: {
          count: filters.length,
          byCategory: {
            electronics: filters.filter((f) => f.categoryId === 'electronics').length,
            appliances: filters.filter((f) => f.categoryId === 'appliances').length,
          },
        },
      },
    });
  } catch (error) {
    console.error('Error seeding database:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to seed database',
      },
      { status: 500 }
    );
  }
}

// GET endpoint to check seed status
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const categoriesCount = await Category.countDocuments();
    const subcategoriesCount = await Subcategory.countDocuments();
    const filtersCount = await Filter.countDocuments();

    return NextResponse.json({
      success: true,
      seeded: categoriesCount > 0,
      counts: {
        categories: categoriesCount,
        subcategories: subcategoriesCount,
        filters: filtersCount,
      },
    });
  } catch (error) {
    console.error('Error checking seed status:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to check seed status' },
      { status: 500 }
    );
  }
}
