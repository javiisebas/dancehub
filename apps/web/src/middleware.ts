import { getToken } from 'next-auth/jwt';
import createMiddleware from 'next-intl/middleware';
import { NextRequest, NextResponse } from 'next/server';
import { routing } from './i18n/routing';

const intlMiddleware = createMiddleware(routing);

const PROTECTED_PATHS = ['/dashboard', '/profile', '/account', '/settings'];
const ADMIN_PATHS = ['/admin'];
const PUBLIC_PATHS = ['/login', '/register', '/recover', '/reset-password', '/verify-email'];

export default async function middleware(req: NextRequest) {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    const { pathname } = req.nextUrl;

    const isProtectedRoute = PROTECTED_PATHS.some((path) => pathname.includes(path));
    const isAdminRoute = ADMIN_PATHS.some((path) => pathname.includes(path));
    const isPublicRoute = PUBLIC_PATHS.some((path) => pathname.includes(path));

    if (isPublicRoute && token) {
        return NextResponse.redirect(new URL('/dashboard', req.url));
    }

    if (isAdminRoute) {
        if (!token) {
            return NextResponse.redirect(new URL('/login', req.url));
        }
        // Check if user has admin role (using string instead of enum for edge runtime compatibility)
        if (!token.user?.roles?.includes('admin')) {
            return NextResponse.redirect(new URL('/profile', req.url));
        }
    } else if (isProtectedRoute && !token) {
        return NextResponse.redirect(new URL('/login', req.url));
    }

    return intlMiddleware(req);
}

export const config = {
    matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
};
