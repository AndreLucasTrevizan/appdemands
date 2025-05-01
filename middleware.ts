import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export const config = {
  matcher: [
    '/',
    '/posts/:path*',
    '/profile',
    '/my_posts',
    '/sign_in',
    '/sign_up',
  ],
};

const notAuthRoutes = [
  '/sign_in',
  '/sign_up'
];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const signed_data = req.cookies.get("demands_signed_data");

  if (notAuthRoutes.includes(pathname) && signed_data) {
    return NextResponse.redirect(new URL('/', req.url));
  }

  if (!signed_data && !notAuthRoutes.includes(pathname)) {
    return NextResponse.redirect(new URL('/sign_in', req.url));
  }

  return NextResponse.next();
}