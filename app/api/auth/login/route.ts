import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Buyer from '@/models/Buyer';
import { generateToken, getAuthCookieHeader } from '@/lib/jwt';

export async function POST(req: NextRequest) {
  try {
    console.log('='.repeat(60));
    console.log('[LOGIN API] ========== LOGIN REQUEST STARTED ==========');
    console.log('='.repeat(60));
    
    await connectDB();

    const body = await req.json();
    const { email, password } = body;

    console.log('[LOGIN API] Login attempt for:', email);

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
      console.log('[LOGIN API] Buyer not found for:', email);
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Compare password
    const isPasswordValid = await buyer.comparePassword(password);

    if (!isPasswordValid) {
      console.log('[LOGIN API] Invalid password for:', email);
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    console.log('[LOGIN API] Login successful for:', email);
    
    // Don't return password
    const buyerResponse = buyer.toObject();
    delete (buyerResponse as any).password;

    // Generate JWT token
    const token = generateToken(buyer._id.toString(), buyer.email);
    console.log('[LOGIN API] JWT token generated for userId:', buyer._id);
    console.log('[LOGIN API] Token value (first 50 chars):', token.substring(0, 50));

    // Create response with cookie header
    const response = NextResponse.json(
      {
        success: true,
        message: 'Login successful',
        buyer: buyerResponse,
      },
      { status: 200 }
    );

    // Set secure httpOnly cookie via Set-Cookie header
    const cookieHeader = getAuthCookieHeader(token);
    console.log('[LOGIN API] Cookie header:', cookieHeader.substring(0, 80));
    response.headers.set('Set-Cookie', cookieHeader);
    console.log('[LOGIN API] Response headers Set-Cookie:', response.headers.get('Set-Cookie')?.substring(0, 50));

    console.log('='.repeat(60));
    console.log('[LOGIN API] ========== RESPONSE SENT SUCCESSFULLY ==========');
    console.log('='.repeat(60));

    return response;
  } catch (error: any) {
    console.error('[LOGIN API] Error:', error);

    return NextResponse.json(
      { error: error.message || 'Login failed' },
      { status: 500 }
    );
  }
}
