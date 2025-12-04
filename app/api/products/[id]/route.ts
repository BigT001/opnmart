import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/services/db/mongoose';
import Product from '@/models/Product';

// DELETE a product
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await connectDB();

    console.log(`[Product API] Deleting product with ID: ${id}`);

    // Find and delete the product
    const product = await Product.findByIdAndDelete(id);

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    console.log(`[Product API] Product deleted: ${product.name}`);

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
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await connectDB();
    
    console.log(`[Product API] Fetching product with ID: ${id}`);

    const product = await Product.findById(id).lean();
    
    console.log(`[Product API] Query result:`, product ? `Found - ${product.name}` : 'Not found');

    if (!product) {
      console.log(`[Product API] Product not found for ID: ${id}`);
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
          images: product.images || [],
          category: product.category,
          subcategory: product.subcategory,
          brand: product.brand,
          stock: product.stock,
          rating: product.rating,
          reviews: product.reviews,
          badge: product.badge,
          condition: product.condition,
          specifications: product.specifications,
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
      { error: 'Failed to fetch product', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}

// UPDATE a product
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await connectDB();

    console.log(`[Product API] Updating product with ID: ${id}`);

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

    console.log(`[Product API] Product updated: ${product.name}`);

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
