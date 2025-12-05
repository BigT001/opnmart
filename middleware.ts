import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/jwt';
import { connectDB } from '@/lib/db';
import Buyer from '@/models/Buyer';
import Vendor from '@/models/Vendor';

// Routes that require authentication
const protectedRoutes = [
  '/dashboards/buyer',
  '/dashboards/vendor',
  '/dashboards/user',
];

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Check if this is a protected route (including dynamic routes)
  const isProtectedRoute = 
    protectedRoutes.some(route => pathname.startsWith(route)) ||
    pathname.match(/^\/dashboards\/buyer\/[a-f0-9]{24}$/i) || // MongoDB ObjectId format
    pathname.match(/^\/dashboards\/vendor\/[a-f0-9]{24}$/i) || // MongoDB ObjectId format
    pathname.match(/^\/dashboards\/user\/[a-f0-9]{24}$/i); // MongoDB ObjectId format

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

  // Check user type based on route
  const isVendorRoute = pathname.includes('/dashboards/vendor');
  const isBuyerRoute = pathname.includes('/dashboards/buyer');
  const isUnifiedUserRoute = pathname.includes('/dashboards/user');

  if (isVendorRoute || isBuyerRoute || isUnifiedUserRoute) {
    try {
      await connectDB();

      // For vendor routes, ensure user is a vendor
      if (isVendorRoute) {
        const vendor = await Vendor.findById(payload.userId);
        if (!vendor) {
          console.log('[MIDDLEWARE] User is not a vendor, redirecting to home');
          return NextResponse.redirect(new URL('/', request.url));
        }
        console.log('[MIDDLEWARE] User is a vendor, allowing access');
      }

      // For buyer routes, ensure user is a buyer
      if (isBuyerRoute) {
        const buyer = await Buyer.findById(payload.userId);
        if (!buyer) {
          console.log('[MIDDLEWARE] User is not a buyer, redirecting to home');
          return NextResponse.redirect(new URL('/', request.url));
        }
        console.log('[MIDDLEWARE] User is a buyer, allowing access');
      }

      // For unified user routes, just verify user exists as either buyer or vendor
      if (isUnifiedUserRoute) {
        const buyer = await Buyer.findById(payload.userId);
        const vendor = await Vendor.findById(payload.userId);
        if (!buyer && !vendor) {
          console.log('[MIDDLEWARE] User is neither buyer nor vendor, redirecting to home');
          return NextResponse.redirect(new URL('/', request.url));
        }
        console.log('[MIDDLEWARE] User is valid, allowing access');
      }
    } catch (error) {
      console.error('[MIDDLEWARE] Error checking user type:', error);
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

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
