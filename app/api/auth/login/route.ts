import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    console.log('[API] Calling backend login for:', body.email);

    const response = await fetch('http://localhost:3001/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: body.email,
        password: body.password,
      }),
    });

    const data = await response.json();
    
    if (!response.ok) {
      console.error('[API] Backend login failed:', data);
      return NextResponse.json(
        { error: data.message || 'Login failed' },
        { status: response.status }
      );
    }

    console.log('[API] Backend login successful for:', body.email);
    
    return NextResponse.json(
      {
        success: true,
        access_token: data.access_token,
        user: data.user,
        message: 'Login successful',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('[API] Login error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}
