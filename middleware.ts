import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/jwt';

// Routes that require authentication (but NOT /api/auth/session - that's open)
const protectedRoutes = [
  '/dashboards/buyer',
];

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Check if this is a protected route (including dynamic routes like /dashboards/buyer/[buyerId])
  const isProtectedRoute = 
    protectedRoutes.some(route => pathname.startsWith(route)) ||
    pathname.match(/^\/dashboards\/buyer\/[a-f0-9]{24}$/i); // MongoDB ObjectId format

  if (!isProtectedRoute) {
    return NextResponse.next();
  }

  // Get token from cookies
  const token = request.cookies.get('authToken')?.value;
  console.log('[MIDDLEWARE] Checking route:', pathname);
  console.log('[MIDDLEWARE] Token exists:', !!token);

  if (!token) {
    console.log('[MIDDLEWARE] No token found, redirecting to home');
    return NextResponse.redirect(new URL('/', request.url));
  }

  // Verify token
  const payload = verifyToken(token);

  if (!payload) {
    console.log('[MIDDLEWARE] Token verification failed, redirecting to home');
    return NextResponse.redirect(new URL('/', request.url));
  }

  console.log('[MIDDLEWARE] Token verified for userId:', payload.userId);

  // Add user info to request headers for use in API routes
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-user-id', payload.userId);
  requestHeaders.set('x-user-email', payload.email);

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};

// CRITICAL: Use Node.js runtime instead of Edge Runtime
// Edge Runtime doesn't support Node.js crypto module, which jsonwebtoken needs
export const runtime = 'nodejs';
