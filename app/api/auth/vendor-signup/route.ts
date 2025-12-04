import { connectDB } from '@/lib/db';
import Vendor from '@/models/Vendor';
import { generateToken } from '@/lib/jwt';
import bcryptjs from 'bcryptjs';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  try {
    const body = await request.json();

    console.log('[VENDOR_SIGNUP] Received signup request for:', body.email);

    // Validate required fields
    const requiredFields = [
      'storeName',
      'email',
      'phone',
      'password',
      'businessRegistration',
      'businessCategory',
      'bankAccount',
      'address',
    ];

    for (const field of requiredFields) {
      if (!body[field]) {
        console.log('[VENDOR_SIGNUP] Missing required field:', field);
        return Response.json(
          { success: false, message: `${field} is required` },
          { status: 400 }
        );
      }
    }

    // Validate email format
    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(body.email)) {
      console.log('[VENDOR_SIGNUP] Invalid email format:', body.email);
      return Response.json(
        { success: false, message: 'Please provide a valid email' },
        { status: 400 }
      );
    }

    // Validate password length
    if (body.password.length < 6) {
      return Response.json(
        { success: false, message: 'Password must be at least 6 characters' },
        { status: 400 }
      );
    }

    // Validate store name length
    if (body.storeName.length < 3 || body.storeName.length > 100) {
      return Response.json(
        { success: false, message: 'Store name must be between 3 and 100 characters' },
        { status: 400 }
      );
    }

    // Connect to database
    await connectDB();

    // Check if vendor already exists
    const existingVendor = await Vendor.findOne({
      $or: [{ email: body.email }, { businessRegistration: body.businessRegistration }],
    });

    if (existingVendor) {
      console.log('[VENDOR_SIGNUP] Vendor already exists:', body.email);
      return Response.json(
        { success: false, message: 'Email or business registration already registered' },
        { status: 409 }
      );
    }

    // Hash password
    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(body.password, salt);

    console.log('[VENDOR_SIGNUP] Creating new vendor:', body.email);

    // Create new vendor
    const vendor = await Vendor.create({
      storeName: body.storeName,
      email: body.email,
      phone: body.phone,
      password: hashedPassword,
      businessRegistration: body.businessRegistration,
      businessCategory: body.businessCategory,
      businessDescription: body.businessDescription || '',
      bankAccount: {
        accountName: body.bankAccount.accountName,
        accountNumber: body.bankAccount.accountNumber,
        bankName: body.bankAccount.bankName,
        bankCode: body.bankAccount.bankCode,
      },
      address: {
        street: body.address.street,
        city: body.address.city,
        state: body.address.state,
        country: body.address.country || 'Nigeria',
        zipCode: body.address.zipCode,
      },
      storeLogo: body.storeLogo || null,
      storeDescription: body.storeDescription || '',
      isVerified: false,
      isActive: true,
    });

    console.log('[VENDOR_SIGNUP] Vendor created successfully:', vendor._id);

    // Generate JWT token
    const token = generateToken(vendor._id.toString(), vendor.email);

    console.log('[VENDOR_SIGNUP] JWT token generated for vendor:', vendor._id);

    // Set httpOnly cookie
    const cookieStore = await cookies();
    cookieStore.set('authToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: '/',
    });

    console.log('[VENDOR_SIGNUP] Auth cookie set successfully');

    return Response.json(
      {
        success: true,
        message: 'Vendor signup successful',
        vendor: {
          _id: vendor._id,
          storeName: vendor.storeName,
          email: vendor.email,
          businessCategory: vendor.businessCategory,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('[VENDOR_SIGNUP] Error:', error);
    return Response.json(
      { success: false, message: 'Error creating vendor account' },
      { status: 500 }
    );
  }
}
