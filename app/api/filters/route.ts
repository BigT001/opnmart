/**
 * Filters API Routes
 * GET endpoints for fetching filters by category/subcategory
 */

import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/services/db/mongoose';
import { Filter } from '@/models/Filter';

// GET /api/filters?categoryId=electronics&subcategoryId=mobile_phones
// Fetch filters for a specific category/subcategory
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get('categoryId');
    const subcategoryId = searchParams.get('subcategoryId');

    await connectDB();

    let query: any = { isActive: true };

    if (categoryId) {
      query.categoryId = categoryId.toLowerCase();
    }

    if (subcategoryId) {
      query.$or = [
        { subcategoryId: subcategoryId.toLowerCase() },
        { categoryId: categoryId?.toLowerCase() },
      ];
    }

    const filters = await Filter.find(query).sort({ displayOrder: 1 });

    return NextResponse.json({
      success: true,
      data: filters,
      count: filters.length,
      categoryId: categoryId || 'all',
      subcategoryId: subcategoryId || 'all',
    });
  } catch (error) {
    console.error('Error fetching filters:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch filters' },
      { status: 500 }
    );
  }
}
