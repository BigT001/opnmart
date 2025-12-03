/**
 * Categories API Routes
 * GET endpoints for fetching categories, subcategories, and filters
 */

import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/services/db/mongoose';
import { Category } from '@/models/Category';
import { Subcategory } from '@/models/Subcategory';
import { Filter } from '@/models/Filter';

// GET /api/categories
// Fetch all main categories
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const categories = await Category.find({ isActive: true }).sort({ displayOrder: 1 });

    return NextResponse.json({
      success: true,
      data: categories,
      count: categories.length,
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch categories' },
      { status: 500 }
    );
  }
}
