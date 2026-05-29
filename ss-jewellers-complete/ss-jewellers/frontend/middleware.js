import { NextResponse } from 'next/server';

// Routes that require authentication
const PROTECTED_ROUTES = [
  '/profile',
  '/checkout',
  '/wishlist',
];

// Routes only for non-authenticated users
const AUTH_ROUTES = ['/login', '/forgot-password', '/reset-password'];

// Admin-only routes
const ADMIN_ROUTES = ['/admin'];

export function middleware(request) {
  const { pathname } = request.nextUrl;

  // Read auth token from cookie (set during login)
  const token = request.cookies.get('ss_access_token')?.value;
  const role  = request.cookies.get('ss_user_role')?.value;

  const isProtected = PROTECTED_ROUTES.some((r) => pathname.startsWith(r));
  const isAuthRoute  = AUTH_ROUTES.some((r) => pathname.startsWith(r));
  const isAdmin      = ADMIN_ROUTES.some((r) => pathname.startsWith(r));

  // Redirect unauthenticated users away from protected routes
  if (isProtected && !token) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Redirect authenticated users away from auth pages
  if (isAuthRoute && token) {
    return NextResponse.redirect(new URL('/profile', request.url));
  }

  // Redirect non-admins away from admin routes
  if (isAdmin && role !== 'admin') {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  // Only run middleware on these paths (skip static files, api routes, etc.)
  matcher: [
    '/profile/:path*',
    '/checkout/:path*',
    '/admin/:path*',
    '/login',
    '/forgot-password',
    '/reset-password',
  ],
};
