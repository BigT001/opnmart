import jwt, { JwtPayload } from 'jsonwebtoken';
import { cookies } from 'next/headers';

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error(
    'JWT_SECRET environment variable is not set. Please add it to your .env.local file.'
  );
}

const JWT_EXPIRY = '7d';

interface JWTPayload extends JwtPayload {
  userId: string;
  email: string;
}

/**
 * Generate a JWT token
 */
export function generateToken(userId: string, email: string): string {
  return jwt.sign(
    { userId, email },
    JWT_SECRET as string,
    { expiresIn: JWT_EXPIRY }
  );
}

/**
 * Verify JWT token
 */
export function verifyToken(token: string): JWTPayload | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET as string) as JWTPayload;
    console.log('[JWT] Token verified successfully, userId:', decoded.userId);
    return decoded;
  } catch (error) {
    console.error('[JWT] Token verification failed:', error instanceof Error ? error.message : String(error));
    return null;
  }
}

/**
 * Get cookie header string for setting auth token in API responses
 */
export function getAuthCookieHeader(token: string): string {
  // In development, Secure flag causes issues. Let it be secure in production only.
  const isProduction = process.env.NODE_ENV === 'production';
  const secure = isProduction ? '; Secure' : '';
  return `authToken=${token}; HttpOnly${secure}; SameSite=Lax; Max-Age=${7 * 24 * 60 * 60}; Path=/`;
}

/**
 * Get token from cookies
 */
export async function getAuthToken(): Promise<string | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get('authToken')?.value;
  return token || null;
}

/**
 * Get cookie header string for clearing auth token
 */
export function getClearAuthCookieHeader(): string {
  const isProduction = process.env.NODE_ENV === 'production';
  const secure = isProduction ? '; Secure' : '';
  return `authToken=; HttpOnly${secure}; SameSite=Lax; Max-Age=0; Path=/`;
}

/**
 * Verify user session from cookies
 */
export async function verifySession(): Promise<JWTPayload | null> {
  const token = await getAuthToken();
  if (!token) return null;
  return verifyToken(token);
}
