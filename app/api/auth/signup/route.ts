import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    console.log('[API] ===== SIGNUP REQUEST =====');
    console.log('[API] Received signup request');
    console.log('[API] Body keys:', Object.keys(body));
    console.log('[API] Body values:', { 
      email: body.email,
      password: body.password ? '***' : 'MISSING',
      firstName: body.firstName,
      lastName: body.lastName,
      phone: body.phone,
      phonePrefix: body.phonePrefix,
      confirmPassword: body.confirmPassword ? '***' : 'N/A'
    });
    
    // Validate required fields
    if (!body.email || !body.password || !body.firstName || !body.lastName || !body.phone) {
      console.error('[API] ❌ Validation failed. Missing required fields:', { 
        email: !!body.email ? '✅' : '❌ MISSING',
        password: !!body.password ? '✅' : '❌ MISSING',
        firstName: !!body.firstName ? '✅' : '❌ MISSING',
        lastName: !!body.lastName ? '✅' : '❌ MISSING',
        phone: !!body.phone ? '✅' : '❌ MISSING',
        phonePrefix: !!body.phonePrefix ? '✅' : '⚠️ OPTIONAL'
      });
      return NextResponse.json(
        { error: 'Missing required fields: email, password, firstName, lastName, phone' },
        { status: 400 }
      );
    }
    
    // Format the data for backend
    const fullPhone = `${body.phonePrefix || '+234'}${body.phone}`;
    const signupData = {
      email: body.email,
      password: body.password,
      name: `${body.firstName} ${body.lastName}`,
      phone: fullPhone,
      role: 'buyer',
    };

    console.log('[API] ✅ Validation passed. Calling backend signup...');
    console.log('[API] Sending to backend:', { 
      email: signupData.email, 
      name: signupData.name,
      phone: signupData.phone 
    });

    console.log('[API] Making fetch call to backend...');
    let response;
    try {
      response = await fetch('http://localhost:3001/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(signupData),
      });
      console.log('[API] Fetch completed. Status:', response.status);
    } catch (fetchError) {
      console.error('[API] ❌ Fetch error (network issue):', fetchError);
      return NextResponse.json(
        { error: `Network error: ${fetchError instanceof Error ? fetchError.message : 'Unknown error'}` },
        { status: 503 }
      );
    }

    let data;
    try {
      data = await response.json();
      console.log('[API] Parsed response JSON successfully');
    } catch (parseError) {
      console.error('[API] ❌ Failed to parse response JSON:', parseError);
      const text = await response.text();
      console.error('[API] Response text:', text);
      return NextResponse.json(
        { error: 'Invalid response from backend' },
        { status: 502 }
      );
    }
    
    if (!response.ok) {
      console.error('[API] ❌ Backend returned error:', response.status, data);
      return NextResponse.json(
        { error: data.message || 'Signup failed' },
        { status: response.status }
      );
    }

    console.log('[API] ✅ Backend signup successful for:', signupData.email);
    
    // Store token and user info in response headers for client to handle
    return NextResponse.json(
      {
        success: true,
        access_token: data.access_token,
        user: data.user,
        message: 'Signup successful',
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('[API] ❌ Signup error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Internal server error';
    console.error('[API] Error details:', errorMessage);
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
