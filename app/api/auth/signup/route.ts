import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Buyer from '@/models/Buyer';
import { generateToken, getAuthCookieHeader } from '@/lib/jwt';

// Sign Up
export async function POST(req: NextRequest) {
  const { method } = req;

  // Handle CORS
  if (method === 'OPTIONS') {
    return new NextResponse(null, {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });
  }

  try {
    await connectDB();

    const body = await req.json();
    const { firstName, lastName, email, phone, phonePrefix, password, confirmPassword } = body;

    console.log('[SIGNUP API] Signup attempt for:', email);

    // Validation
    if (!firstName || !lastName || !email || !phone || !password || !confirmPassword || !phonePrefix) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Email validation
    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Please provide a valid email address' },
        { status: 400 }
      );
    }

    // Phone validation (10 digits only)
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(phone)) {
      return NextResponse.json(
        { error: 'Phone number must be exactly 10 digits' },
        { status: 400 }
      );
    }

    // Phone prefix validation
    const validPrefixes = ['+234', '+1', '+44', '+91', '+86', '+81', '+33', '+49', '+39', '+34', '+61'];
    if (!validPrefixes.includes(phonePrefix)) {
      return NextResponse.json(
        { error: 'Invalid country code' },
        { status: 400 }
      );
    }

    // Name length validation
    if (firstName.length < 2 || firstName.length > 50) {
      return NextResponse.json(
        { error: 'First name must be between 2 and 50 characters' },
        { status: 400 }
      );
    }

    if (lastName.length < 2 || lastName.length > 50) {
      return NextResponse.json(
        { error: 'Last name must be between 2 and 50 characters' },
        { status: 400 }
      );
    }

    // Password validation
    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters' },
        { status: 400 }
      );
    }

    if (password !== confirmPassword) {
      return NextResponse.json(
        { error: 'Passwords do not match' },
        { status: 400 }
      );
    }

    // Check password strength
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(password)) {
      return NextResponse.json(
        {
          error:
            'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
        },
        { status: 400 }
      );
    }

    // Check if buyer already exists
    const existingBuyer = await Buyer.findOne({ email: email.toLowerCase() });
    if (existingBuyer) {
      return NextResponse.json(
        { error: 'Email already registered' },
        { status: 400 }
      );
    }

    // Create new buyer
    const buyer = new Buyer({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.toLowerCase().trim(),
      phone: phone.trim(),
      phonePrefix: phonePrefix,
      password,
      addresses: [],
      wishlists: [],
      orders: [],
    });

    await buyer.save();
    console.log('[SIGNUP API] Buyer created successfully:', email);

    // Don't return password
    const buyerResponse = buyer.toObject();
    delete (buyerResponse as any).password;

    // Generate JWT token
    const token = generateToken(buyer._id.toString(), buyer.email);
    console.log('[SIGNUP API] JWT token generated for userId:', buyer._id);

    // Create response with cookie header
    const response = NextResponse.json(
      {
        success: true,
        message: 'Account created successfully',
        buyer: buyerResponse,
      },
      { status: 201 }
    );

    // Set secure httpOnly cookie via Set-Cookie header
    const cookieHeader = getAuthCookieHeader(token);
    console.log('[SIGNUP API] Setting cookie header');
    response.headers.set('Set-Cookie', cookieHeader);

    return response;
  } catch (error: any) {
    console.error('[SIGNUP API] Error:', error);

    if (error.code === 11000) {
      return NextResponse.json(
        { error: 'Email already registered' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: error.message || 'Failed to create account' },
      { status: 500 }
    );
  }
}
