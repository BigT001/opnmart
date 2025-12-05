import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/jwt';
import { connectDB } from '@/lib/db';
import Buyer from '@/models/Buyer';
import Vendor from '@/models/Vendor';

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
        { buyer: null, vendor: null },
        { status: 200 }
      );
    }

    console.log('[SESSION API] Token found, verifying...');
    // Verify the token
    const payload = verifyToken(token);

    if (!payload) {
      console.log('[SESSION API] Token verification failed');
      return NextResponse.json(
        { buyer: null, vendor: null },
        { status: 200 }
      );
    }

    console.log('[SESSION API] Token verified, userId:', payload.userId);
    
    // Get fresh buyer and vendor data from database
    await connectDB();
    const buyer = await Buyer.findById(payload.userId);
    const vendor = await Vendor.findById(payload.userId);

    if (!buyer && !vendor) {
      console.log('[SESSION API] User not found in database for userId:', payload.userId);
      return NextResponse.json(
        { buyer: null, vendor: null },
        { status: 200 }
      );
    }

    // Return both buyer and vendor if user has both profiles
    let buyerResponse = null;
    let vendorResponse = null;

    if (buyer) {
      console.log('[SESSION API] Buyer found:', buyer.email);
      buyerResponse = buyer.toObject();
      delete (buyerResponse as any).password;
    }

    if (vendor) {
      console.log('[SESSION API] Vendor found:', vendor.email);
      vendorResponse = vendor.toObject();
      delete (vendorResponse as any).password;
    }

    return NextResponse.json(
      { buyer: buyerResponse, vendor: vendorResponse },
      { status: 200 }
    );

    return NextResponse.json(
      { buyer: null, vendor: null },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('[SESSION API] Error:', error);
    return NextResponse.json(
      { buyer: null, vendor: null },
      { status: 200 }
    );
  }
}
