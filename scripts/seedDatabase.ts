/**
 * Database Seeding Script
 * Populates MongoDB with all categories, subcategories, and filters
 */

import mongoose from 'mongoose';
import { connectDB, disconnectDB } from '@/services/db/mongoose';
import { Category } from '@/models/Category';
import { Subcategory } from '@/models/Subcategory';
import { Filter } from '@/models/Filter';
import { SUBCATEGORY_DETAILS, FILTER_OPTIONS } from '@/config/categories';
import { APPLIANCES_CATEGORIES } from '@/config/appliancesCategories';

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

// Electronics Subcategories
const ELECTRONICS_SUBCATEGORIES = [
  {
    id: 'mobile_phones',
    categoryId: 'electronics',
    name: 'Mobile Phones',
    icon: '📱',
    description: 'Smartphones and feature phones',
  },
  {
    id: 'phone_accessories',
    categoryId: 'electronics',
    name: 'Phone Accessories',
    icon: '🔌',
    description: 'Chargers, cables, cases, and more',
  },
  {
    id: 'laptops',
    categoryId: 'electronics',
    name: 'Laptops',
    icon: '💻',
    description: 'Gaming, business, and student laptops',
  },
  {
    id: 'desktop_computers',
    categoryId: 'electronics',
    name: 'Desktop Computers',
    icon: '🖥️',
    description: 'CPUs and all-in-one PCs',
  },
  {
    id: 'computer_accessories',
    categoryId: 'electronics',
    name: 'Computer Accessories',
    icon: '⌨️',
    description: 'Keyboards, mouse, storage, and more',
  },
  {
    id: 'tablets',
    categoryId: 'electronics',
    name: 'Tablets',
    icon: '📱',
    description: 'iPads and Android tablets',
  },
  {
    id: 'audio_music',
    categoryId: 'electronics',
    name: 'Audio & Music',
    icon: '🎵',
    description: 'Speakers, headphones, and audio equipment',
  },
  {
    id: 'gaming',
    categoryId: 'electronics',
    name: 'Gaming',
    icon: '🎮',
    description: 'Consoles, controllers, and gaming gear',
  },
  {
    id: 'cameras',
    categoryId: 'electronics',
    name: 'Cameras',
    icon: '📷',
    description: 'DSLR, mirrorless, and photography equipment',
  },
  {
    id: 'networking',
    categoryId: 'electronics',
    name: 'Networking',
    icon: '📡',
    description: 'Routers, MiFi, and networking equipment',
  },
  {
    id: 'smart_gadgets',
    categoryId: 'electronics',
    name: 'Smart Gadgets',
    icon: '⌚',
    description: 'Smartwatches and IoT devices',
  },
  {
    id: 'office_electronics',
    categoryId: 'electronics',
    name: 'Office Electronics',
    icon: '🖨️',
    description: 'Printers, scanners, and office equipment',
  },
  {
    id: 'power_energy',
    categoryId: 'electronics',
    name: 'Power & Energy',
    icon: '🔋',
    description: 'Power supplies and energy solutions',
  },
];

// Appliances Subcategories
const APPLIANCES_SUBCATEGORIES = [
  {
    id: 'ac',
    categoryId: 'appliances',
    name: 'Air Conditioners',
    icon: '❄️',
    description: 'Split, window, standing, and portable AC units',
  },
  {
    id: 'refrigerators',
    categoryId: 'appliances',
    name: 'Refrigerators & Freezers',
    icon: '🧊',
    description: 'Fridges, freezers, and cooling solutions',
  },
  {
    id: 'generators',
    categoryId: 'appliances',
    name: 'Generators & Power',
    icon: '⚡',
    description: 'Generators, inverters, solar, and power equipment',
  },
  {
    id: 'kitchen_appliances',
    categoryId: 'appliances',
    name: 'Kitchen Appliances',
    icon: '🍳',
    description: 'Microwave, cookers, blenders, and kitchen gadgets',
  },
  {
    id: 'home_appliances',
    categoryId: 'appliances',
    name: 'Home Appliances',
    icon: '🏠',
    description: 'Washing machines, dishwashers, and home gadgets',
  },
];

// Filter data for Electronics
const ELECTRONICS_FILTERS = [
  {
    id: 'brand',
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
    ],
  },
  {
    id: 'condition',
    name: 'Condition',
    type: 'checkbox',
    options: [
      { value: 'brand_new', label: 'Brand New' },
      { value: 'uk_used', label: 'UK Used' },
      { value: 'refurbished', label: 'Refurbished' },
      { value: 'used', label: 'Used' },
    ],
  },
  {
    id: 'price_range',
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
  },
  {
    id: 'warranty',
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
  },
  {
    id: 'color',
    name: 'Color',
    type: 'checkbox',
    options: [
      { value: 'black', label: 'Black' },
      { value: 'silver', label: 'Silver' },
      { value: 'gold', label: 'Gold' },
      { value: 'white', label: 'White' },
      { value: 'blue', label: 'Blue' },
      { value: 'red', label: 'Red' },
    ],
  },
];

// Filter data for Appliances
const APPLIANCES_FILTERS = [
  {
    id: 'brand',
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
  },
  {
    id: 'condition',
    name: 'Condition',
    type: 'checkbox',
    options: [
      { value: 'brand_new', label: 'Brand New' },
      { value: 'used', label: 'Used' },
      { value: 'refurbished', label: 'Refurbished' },
    ],
  },
  {
    id: 'price_range',
    name: 'Price Range',
    type: 'range',
    options: [
      { value: '0-50000', label: '₦0 - ₦50,000' },
      { value: '50000-150000', label: '₦50,000 - ₦150,000' },
      { value: '150000-500000', label: '₦150,000 - ₦500,000' },
      { value: '500000-1000000', label: '₦500,000 - ₦1,000,000' },
      { value: '1000000+', label: '₦1,000,000+' },
    ],
  },
  {
    id: 'warranty',
    name: 'Warranty',
    type: 'checkbox',
    options: [
      { value: '1_year', label: '1 Year' },
      { value: '2_years', label: '2 Years' },
      { value: '3_years', label: '3 Years' },
      { value: '5_years', label: '5 Years' },
    ],
  },
];

/**
 * Seed the database with initial data
 */
async function seedDatabase() {
  try {
    console.log('🌱 Starting database seeding...\n');

    // Connect to database
    await connectDB();
    console.log('✅ Connected to MongoDB\n');

    // Clear existing data (optional - remove if you want to preserve data)
    console.log('🧹 Clearing existing data...');
    await Category.deleteMany({});
    await Subcategory.deleteMany({});
    await Filter.deleteMany({});
    console.log('✅ Cleared existing data\n');

    // Seed Categories
    console.log('📂 Seeding categories...');
    const categories = await Category.insertMany([ELECTRONICS_DATA, APPLIANCES_DATA]);
    console.log(`✅ Created ${categories.length} categories\n`);

    // Seed Subcategories
    console.log('📁 Seeding subcategories...');
    const subcategories = await Subcategory.insertMany([
      ...ELECTRONICS_SUBCATEGORIES,
      ...APPLIANCES_SUBCATEGORIES,
    ]);
    console.log(`✅ Created ${subcategories.length} subcategories\n`);

    // Seed Filters (Global)
    console.log('🔍 Seeding filters...');
    const filters = await Filter.insertMany([
      ...ELECTRONICS_FILTERS.map((f) => ({ ...f, categoryId: 'electronics' })),
      ...APPLIANCES_FILTERS.map((f) => ({ ...f, categoryId: 'appliances' })),
    ]);
    console.log(`✅ Created ${filters.length} filters\n`);

    // Display summary
    console.log('📊 Database Seeding Summary:');
    console.log('━'.repeat(50));
    console.log(`✅ Categories: ${categories.length}`);
    console.log(`✅ Subcategories: ${subcategories.length}`);
    console.log(`✅ Filters: ${filters.length}`);
    console.log('━'.repeat(50));

    // Display category breakdown
    console.log('\n📈 Category Breakdown:');
    console.log(`  📱 Electronics: 13 subcategories`);
    console.log(`  🏠 Appliances: 5 subcategories`);

    console.log('\n✨ Database seeding completed successfully!\n');

    await disconnectDB();
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

// Run seeding if this is the main module
if (require.main === module) {
  seedDatabase();
}

export default seedDatabase;
