import { connectDB } from '@/lib/db';
import { Category } from '@/models/Category';

const defaultCategories = [
  { id: 'electronics', name: 'Electronics', icon: '📱', description: 'Electronics and gadgets', displayOrder: 1 },
  { id: 'fashion', name: 'Fashion & Clothing', icon: '👕', description: 'Clothing and fashion items', displayOrder: 2 },
  { id: 'home', name: 'Home & Garden', icon: '🏡', description: 'Home and garden products', displayOrder: 3 },
  { id: 'sports', name: 'Sports & Outdoors', icon: '⚽', description: 'Sports and outdoor equipment', displayOrder: 4 },
  { id: 'books', name: 'Books & Media', icon: '📚', description: 'Books and media products', displayOrder: 5 },
  { id: 'health', name: 'Health & Beauty', icon: '💄', description: 'Health and beauty products', displayOrder: 6 },
  { id: 'toys', name: 'Toys & Games', icon: '🎮', description: 'Toys and games for all ages', displayOrder: 7 },
  { id: 'food', name: 'Food & Beverages', icon: '🍕', description: 'Food and beverage products', displayOrder: 8 },
  { id: 'automotive', name: 'Automotive', icon: '🚗', description: 'Automotive products and accessories', displayOrder: 9 },
  { id: 'appliances', name: 'Appliances', icon: '🔧', description: 'Home appliances', displayOrder: 10 },
];

export async function POST(request: Request) {
  try {
    await connectDB();

    // Check if categories already exist
    const existingCount = await Category.countDocuments({});
    
    if (existingCount === 0) {
      // Seed categories
      const result = await Category.insertMany(defaultCategories);
      return Response.json({
        success: true,
        message: `Seeded ${result.length} categories`,
        categories: result,
      });
    } else {
      return Response.json({
        success: true,
        message: 'Categories already exist',
        count: existingCount,
      });
    }
  } catch (error: any) {
    console.error('[SEED_CATEGORIES] Error:', error);
    return Response.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
