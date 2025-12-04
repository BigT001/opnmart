import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/jwt';
import { connectDB } from '@/lib/db';
import Buyer from '@/models/Buyer';

export async function GET(req: NextRequest) {
  try {
    // Get the authToken from cookies
    const token = req.cookies.get('authToken')?.value;
    console.log('[SESSION API] Received request, checking cookie...');
    console.log('[SESSION API] Token exists:', !!token);
    
    if (!token) {
      console.log('[SESSION API] No token found in cookies');
      console.log('[SESSION API] All cookies:', req.cookies.getAll());
      return NextResponse.json(
        { buyer: null },
        { status: 200 }
      );
    }

    console.log('[SESSION API] Token found, verifying...');
    // Verify the token
    const payload = verifyToken(token);

    if (!payload) {
      console.log('[SESSION API] Token verification failed');
      return NextResponse.json(
        { buyer: null },
        { status: 200 }
      );
    }

    console.log('[SESSION API] Token verified, userId:', payload.userId);
    
    // Get fresh buyer data from database
    await connectDB();
    const buyer = await Buyer.findById(payload.userId);

    if (!buyer) {
      console.log('[SESSION API] Buyer not found in database for userId:', payload.userId);
      return NextResponse.json(
        { buyer: null },
        { status: 200 }
      );
    }

    console.log('[SESSION API] Buyer found:', buyer.email);
    const buyerResponse = buyer.toObject();
    delete (buyerResponse as any).password;

    return NextResponse.json(
      { buyer: buyerResponse },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('[SESSION API] Error:', error);
    return NextResponse.json(
      { buyer: null },
      { status: 200 }
    );
  }
}
