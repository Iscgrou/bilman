import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from './lib/auth';
import { UserRole } from './lib/roles';

const protectedPaths = [
  { path: '/accounting', roles: [UserRole.Admin, UserRole.Operator] },
  { path: '/representatives', roles: [UserRole.Admin, UserRole.Operator] },
  // Add more protected paths and roles as needed
];

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;

  const url = request.nextUrl.clone();

  // Allow public paths
  if (url.pathname.startsWith('/login') || url.pathname.startsWith('/api/auth')) {
    return NextResponse.next();
  }

  if (!token || !verifyToken(token)) {
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }

  // Extract user role from token payload (assuming verifyToken returns decoded token)
  const decodedToken = verifyToken(token);
  const userRole = typeof decodedToken === 'object' && decodedToken !== null && 'role' in decodedToken
    ? (decodedToken.role as UserRole)
    : null;

  for (const protectedPath of protectedPaths) {
    if (url.pathname.startsWith(protectedPath.path)) {
      if (!userRole || !protectedPath.roles.includes(userRole)) {
        url.pathname = '/unauthorized';
        return NextResponse.redirect(url);
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/', '/representatives/:path*', '/invoices/:path*', '/accounting/:path*', '/settings/:path*'],
};
