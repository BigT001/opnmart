import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/services/db/mongoose';
import Product from '@/models/Product';

export async function POST(request: NextRequest) {
  try {
    // Parse multipart form data
    const formData = await request.formData();
    
    // Extract product details from form data
    const name = formData.get('name') as string;
    const description = formData.get('description') as string;
    const category = formData.get('category') as string;
    const subcategory = formData.get('subcategory') as string;
    const brand = formData.get('brand') as string;
    const price = parseFloat(formData.get('price') as string);
    const oldPrice = formData.get('oldPrice') ? parseFloat(formData.get('oldPrice') as string) : undefined;
    const stock = parseInt(formData.get('stock') as string);
    const badge = formData.get('badge') as string || null;
    const condition = formData.get('condition') as string;
    const vendorId = formData.get('vendorId') as string;
    const image = formData.get('image') as File;
    const specificationsStr = formData.get('specifications') as string;
    let specifications: Record<string, any> = {};
    
    if (specificationsStr) {
      try {
        specifications = JSON.parse(specificationsStr);
      } catch (e) {
        console.warn('Failed to parse specifications:', e);
      }
    }

    // Validate required fields
    if (!name || !description || !category || !subcategory || !brand || !price || !stock || !vendorId || !image) {
      const missing = [];
      if (!name) missing.push('name');
      if (!description) missing.push('description');
      if (!category) missing.push('category');
      if (!subcategory) missing.push('subcategory');
      if (!brand) missing.push('brand');
      if (!price) missing.push('price');
      if (!stock) missing.push('stock');
      if (!vendorId) missing.push('vendorId');
      if (!image) missing.push('image');
      
      console.error('Missing fields:', missing);
      return NextResponse.json(
        { error: `Missing required fields: ${missing.join(', ')}` },
        { status: 400 }
      );
    }

    // Validate image file
    if (image.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'Image size must be less than 5MB' },
        { status: 400 }
      );
    }

    // Upload image to Cloudinary
    let cloudinaryUrl = '';
    let imagePublicId = '';

    try {
      const buffer = await image.arrayBuffer();
      const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
      const apiKey = process.env.CLOUDINARY_API_KEY;
      const apiSecret = process.env.CLOUDINARY_API_SECRET;

      if (!cloudName || !apiKey || !apiSecret) {
        console.error('Missing Cloudinary credentials:', { 
          cloudName: cloudName ? 'SET' : 'MISSING',
          apiKey: apiKey ? 'SET' : 'MISSING',
          apiSecret: apiSecret ? 'SET' : 'MISSING'
        });
        return NextResponse.json(
          { 
            error: 'Cloudinary credentials not configured. Please check your environment variables.',
            details: `Missing: ${!cloudName ? 'NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ' : ''}${!apiKey ? 'CLOUDINARY_API_KEY ' : ''}${!apiSecret ? 'CLOUDINARY_API_SECRET' : ''}`
          },
          { status: 500 }
        );
      }

      const uploadUrl = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;
      
      // Create form data with file and credentials
      const formDataUpload = new FormData();
      formDataUpload.append('file', new Blob([buffer], { type: image.type }), image.name);
      formDataUpload.append('api_key', apiKey);
      formDataUpload.append('folder', 'opnmart/products');
      formDataUpload.append('timestamp', Math.floor(Date.now() / 1000).toString());

      // Create signature for authenticated upload
      const crypto = require('crypto');
      const params: Record<string, string> = {
        folder: 'opnmart/products',
        timestamp: Math.floor(Date.now() / 1000).toString(),
      };

      const paramsStr = Object.keys(params)
        .sort()
        .map(key => `${key}=${params[key]}`)
        .join('&');

      const signature = crypto
        .createHash('sha256')
        .update(paramsStr + apiSecret)
        .digest('hex');

      formDataUpload.append('signature', signature);

      console.log('Uploading to Cloudinary:', { url: uploadUrl, cloudName });

      const uploadResponse = await fetch(uploadUrl, {
        method: 'POST',
        body: formDataUpload,
      });

      if (!uploadResponse.ok) {
        const errorData = await uploadResponse.json();
        console.error('Cloudinary upload error:', { 
          status: uploadResponse.status,
          statusText: uploadResponse.statusText,
          error: errorData 
        });
        return NextResponse.json(
          { 
            error: 'Cloudinary upload failed',
            details: errorData.error?.message || JSON.stringify(errorData)
          },
          { status: 500 }
        );
      }

      const uploadData = await uploadResponse.json();
      cloudinaryUrl = uploadData.secure_url;
      imagePublicId = uploadData.public_id;
      console.log('Image uploaded successfully:', { url: cloudinaryUrl, publicId: imagePublicId });
    } catch (error) {
      console.error('Image upload error:', error);
      return NextResponse.json(
        { 
          error: 'Failed to upload image',
          details: error instanceof Error ? error.message : String(error)
        },
        { status: 500 }
      );
    }

    // Connect to MongoDB
    await connectDB();

    // Create product in MongoDB
    const product = await Product.create({
      name,
      description,
      category,
      subcategory,
      brand,
      price,
      oldPrice,
      stock,
      image: cloudinaryUrl,
      imagePublicId,
      badge,
      condition,
      specifications,
      vendorId,
      rating: 4.5,
      reviews: 0,
      sold: 0,
    });

    return NextResponse.json(
      {
        message: 'Product uploaded successfully',
        product: {
          id: product._id.toString(),
          name: product.name,
          price: product.price,
          image: product.image,
          category: product.category,
          subcategory: product.subcategory,
          brand: product.brand,
          stock: product.stock,
          condition: product.condition,
          badge: product.badge,
          specifications: product.specifications,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Product upload error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to upload product. Please try again.',
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}

// GET - Fetch all products or products by vendor
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const searchParams = request.nextUrl.searchParams;
    const vendorId = searchParams.get('vendorId');
    const category = searchParams.get('category');
    const subcategory = searchParams.get('subcategory');

    let query: any = {};

    if (vendorId) {
      query.vendorId = vendorId;
    }

    if (category) {
      query.category = category;
    }

    if (subcategory) {
      query.subcategory = subcategory;
    }

    const products = await Product.find(query)
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json(
      {
        success: true,
        count: products.length,
        products: products.map(product => ({
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
          specifications: product.specifications,
          vendorId: product.vendorId,
        })),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Fetch products error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}
