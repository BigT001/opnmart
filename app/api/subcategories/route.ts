/**
 * Subcategories API Routes
 * GET endpoints for fetching subcategories by category
 */

import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/services/db/mongoose';
import { Subcategory } from '@/models/Subcategory';

// GET /api/subcategories?categoryId=electronics
// Fetch subcategories for a specific category
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get('categoryId');

    await connectDB();

    let query: any = { isActive: true };

    if (categoryId) {
      query.categoryId = categoryId.toLowerCase();
    }

    const subcategories = await Subcategory.find(query).sort({ displayOrder: 1 });

    return NextResponse.json({
      success: true,
      data: subcategories,
      count: subcategories.length,
      categoryId: categoryId || 'all',
    });
  } catch (error) {
    console.error('Error fetching subcategories:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch subcategories' },
      { status: 500 }
    );
  }
}
