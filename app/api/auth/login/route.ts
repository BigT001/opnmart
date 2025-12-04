import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Buyer from '@/models/Buyer';

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const body = await req.json();
    const { email, password } = body;

    // Validation
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
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

    // Find buyer and select password
    const buyer = await Buyer.findOne({ email: email.toLowerCase() }).select('+password');

    if (!buyer) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Compare password
    const isPasswordValid = await buyer.comparePassword(password);

    if (!isPasswordValid) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Don't return password
    const buyerResponse = buyer.toObject();
    delete (buyerResponse as any).password;

    return NextResponse.json(
      {
        success: true,
        message: 'Login successful',
        buyer: buyerResponse,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Login error:', error);

    return NextResponse.json(
      { error: error.message || 'Login failed' },
      { status: 500 }
    );
  }
}
