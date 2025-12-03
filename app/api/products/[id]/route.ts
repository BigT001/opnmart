import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/services/db/mongoose';
import Product from '@/models/Product';

// DELETE a product
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    const { id } = params;

    // Find and delete the product
    const product = await Product.findByIdAndDelete(id);

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    // TODO: Delete image from Cloudinary if needed
    // if (product.imagePublicId) {
    //   await deleteFromCloudinary(product.imagePublicId);
    // }

    return NextResponse.json(
      { message: 'Product deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Delete product error:', error);
    return NextResponse.json(
      { error: 'Failed to delete product' },
      { status: 500 }
    );
  }
}

// GET a single product
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    const { id } = params;

    const product = await Product.findById(id).lean();

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        product: {
          id: product._id.toString(),
          name: product.name,
          description: product.description,
          price: product.price,
          oldPrice: product.oldPrice,
          image: product.image,
          category: product.category,
          subcategory: product.subcategory,
          brand: product.brand,
          stock: product.stock,
          rating: product.rating,
          reviews: product.reviews,
          badge: product.badge,
          condition: product.condition,
          vendorId: product.vendorId,
          createdAt: product.createdAt,
          updatedAt: product.updatedAt,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Fetch product error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch product' },
      { status: 500 }
    );
  }
}

// UPDATE a product
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    const { id } = params;
    const updates = await request.json();

    const product = await Product.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    }).lean();

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        message: 'Product updated successfully',
        product: {
          id: product._id.toString(),
          name: product.name,
          description: product.description,
          price: product.price,
          oldPrice: product.oldPrice,
          image: product.image,
          category: product.category,
          subcategory: product.subcategory,
          brand: product.brand,
          stock: product.stock,
          rating: product.rating,
          reviews: product.reviews,
          badge: product.badge,
          condition: product.condition,
          vendorId: product.vendorId,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Update product error:', error);
    return NextResponse.json(
      { error: 'Failed to update product' },
      { status: 500 }
    );
  }
}
