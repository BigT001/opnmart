import { NextRequest, NextResponse } from 'next/server';
import { getClearAuthCookieHeader } from '@/lib/jwt';

export async function POST(req: NextRequest) {
  try {
    // Create response and clear auth cookie
    const response = NextResponse.json(
      { success: true, message: 'Logout successful' },
      { status: 200 }
    );

    // Clear auth cookie via Set-Cookie header
    response.headers.set('Set-Cookie', getClearAuthCookieHeader());

    return response;
  } catch (error: any) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { error: 'Logout failed' },
      { status: 500 }
    );
  }
}
