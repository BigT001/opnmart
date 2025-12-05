import { connectDB } from '@/lib/db';
import Vendor from '@/models/Vendor';
import { generateToken, verifyToken } from '@/lib/jwt';
import bcryptjs from 'bcryptjs';
import { cookies } from 'next/headers';
import Buyer from '@/models/Buyer';

export async function POST(request: Request) {
  try {
    const body = await request.json();

    console.log('[VENDOR_SIGNUP] Received signup request for:', body.email, 'Type:', body.vendorType);

    // Connect to database early
    await connectDB();

    // Check if user is already logged in
    const cookieStore = await cookies();
    const authToken = cookieStore.get('authToken')?.value;
    let loggedInUserId: string | null = null;

    if (authToken) {
      const payload = verifyToken(authToken);
      if (payload) {
        loggedInUserId = payload.userId;
        console.log('[VENDOR_SIGNUP] User already logged in, userId:', loggedInUserId);

        // If logged in, check if already a vendor
        const existingVendor = await Vendor.findById(loggedInUserId);
        if (existingVendor) {
          console.log('[VENDOR_SIGNUP] User is already a vendor');
          return Response.json(
            { success: false, message: 'You are already registered as a vendor' },
            { status: 400 }
          );
        }
      }
    }

    // Validate vendor type
    if (!body.vendorType || !['individual', 'business'].includes(body.vendorType)) {
      return Response.json(
        { success: false, message: 'Invalid vendor type' },
        { status: 400 }
      );
    }

    // Common required fields for both types
    const commonRequiredFields = ['email', 'phone', 'password'];
    for (const field of commonRequiredFields) {
      if (!body[field]) {
        console.log('[VENDOR_SIGNUP] Missing required field:', field);
        return Response.json(
          { success: false, message: `${field} is required` },
          { status: 400 }
        );
      }
    }

    // Validate that at least one category is selected
    const categories = body.businessCategories || body.businessCategory;
    if (!categories || (Array.isArray(categories) ? categories.length === 0 : !categories)) {
      return Response.json(
        { success: false, message: 'At least one business category is required' },
        { status: 400 }
      );
    }

    // Individual vendor specific validation
    if (body.vendorType === 'individual') {
      if (!body.fullName) {
        return Response.json(
          { success: false, message: 'Full name is required' },
          { status: 400 }
        );
      }
      if (!body.ninNumber) {
        return Response.json(
          { success: false, message: 'NIN number is required' },
          { status: 400 }
        );
      }
      if (!body.storeName) {
        return Response.json(
          { success: false, message: 'Store name is required' },
          { status: 400 }
        );
      }
    }

    // Business vendor specific validation
    if (body.vendorType === 'business') {
      const businessRequiredFields = ['businessLegalName', 'tradingName', 'cacNumber', 'tinNumber', 'businessEmail', 'businessPhone'];
      for (const field of businessRequiredFields) {
        if (!body[field]) {
          console.log('[VENDOR_SIGNUP] Missing business required field:', field);
          return Response.json(
            { success: false, message: `${field} is required` },
            { status: 400 }
          );
        }
      }
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.email)) {
      console.log('[VENDOR_SIGNUP] Invalid email format:', body.email);
      return Response.json(
        { success: false, message: 'Please provide a valid email' },
        { status: 400 }
      );
    }

    // Validate password length
    if (body.password.length < 8) {
      return Response.json(
        { success: false, message: 'Password must be at least 8 characters' },
        { status: 400 }
      );
    }

    // Check if vendor already exists by email (for new vendors)
    if (!loggedInUserId) {
      const existingVendor = await Vendor.findOne({ email: body.email });
      if (existingVendor) {
        console.log('[VENDOR_SIGNUP] Vendor already exists:', body.email);
        return Response.json(
          { success: false, message: 'Email already registered as vendor' },
          { status: 409 }
        );
      }
    }

    // Check if CAC number exists (for business vendors)
    if (body.vendorType === 'business' && body.cacNumber) {
      const cacExists = await Vendor.findOne({ businessRegistration: body.cacNumber });
      if (cacExists) {
        return Response.json(
          { success: false, message: 'CAC number already registered' },
          { status: 409 }
        );
      }
    }

    // Hash password only if creating new vendor (not updating existing buyer)
    let hashedPassword = body.password;
    if (!loggedInUserId || !(await Buyer.findById(loggedInUserId))) {
      // New vendor account - hash password
      const salt = await bcryptjs.genSalt(10);
      hashedPassword = await bcryptjs.hash(body.password, salt);
    } else {
      // Converting buyer to vendor - keep their existing password
      const buyer = await Buyer.findById(loggedInUserId);
      hashedPassword = buyer.password;
    }

    console.log('[VENDOR_SIGNUP] Creating vendor with ID:', loggedInUserId || 'new');

    // Create vendor object based on type
    const vendorData: any = {
      _id: loggedInUserId || undefined, // Use existing buyer ID if logged in
      vendorType: body.vendorType,
      email: body.email,
      phone: body.phone,
      password: hashedPassword,
      businessCategory: body.businessCategory || (Array.isArray(body.businessCategories) ? body.businessCategories[0] : ''),
      businessCategories: body.businessCategories || (body.businessCategory ? [body.businessCategory] : []),
      storeDescription: body.storeDescription || '',
      isVerified: false,
      isActive: true,
    };

    // Individual vendor fields
    if (body.vendorType === 'individual') {
      vendorData.storeName = body.storeName;
      vendorData.fullName = body.fullName;
      vendorData.ninNumber = body.ninNumber;
      vendorData.idType = body.idType || '';
      vendorData.businessAddress = body.businessAddress || '';
      vendorData.state = body.state || '';
      vendorData.city = body.city || '';
      vendorData.pickupAddress = body.pickupAddress || '';
      vendorData.address = {
        street: body.businessAddress || '',
        city: body.city || '',
        state: body.state || '',
        country: 'Nigeria',
      };
    }

    // Business vendor fields
    if (body.vendorType === 'business') {
      vendorData.businessLegalName = body.businessLegalName;
      vendorData.tradingName = body.tradingName;
      vendorData.businessEmail = body.businessEmail;
      vendorData.businessPhone = body.businessPhone;
      vendorData.businessRegistration = body.cacNumber;
      vendorData.tinNumber = body.tinNumber;
      vendorData.businessWebsite = body.businessWebsite || '';
      vendorData.yearsInOperation = body.yearsInOperation || 0;
      vendorData.headOfficeAddress = body.headOfficeAddress || '';
      vendorData.warehouseAddress = body.warehouseAddress || '';
      vendorData.repFullName = body.repFullName || '';
      vendorData.repEmail = body.repEmail || '';
      vendorData.repPhone = body.repPhone || '';
      vendorData.repPosition = body.repPosition || '';
      vendorData.bankName = body.bankName || '';
      vendorData.accountNumber = body.accountNumber || '';
      vendorData.bvn = body.bvn || '';
      vendorData.address = {
        street: body.headOfficeAddress || '',
        city: body.city || '',
        state: body.state || '',
        country: 'Nigeria',
      };
    }

    // Create or update vendor
    let vendor;
    if (loggedInUserId) {
      // User already logged in - update their vendor profile
      vendor = await Vendor.findByIdAndUpdate(
        loggedInUserId,
        vendorData,
        { upsert: true, new: true }
      ) as any;
      console.log('[VENDOR_SIGNUP] Vendor profile updated for user:', loggedInUserId);
    } else {
      // New vendor account - create new
      vendor = await Vendor.create(vendorData) as any;
      console.log('[VENDOR_SIGNUP] New vendor created:', vendor._id);
    }

    console.log('[VENDOR_SIGNUP] Vendor ready:', vendor._id);

    // Generate JWT token
    const token = generateToken(vendor._id.toString(), vendor.email);

    console.log('[VENDOR_SIGNUP] JWT token generated for vendor:', vendor._id);

    // Set httpOnly cookie (using the cookieStore from earlier in the function)
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
          email: vendor.email,
          vendorType: vendor.vendorType,
          storeName: vendor.storeName || vendor.tradingName,
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
