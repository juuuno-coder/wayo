import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const url = request.nextUrl;
    const hostname = request.headers.get('host') || '';

    // Define domains
    // In development, we can simulate subdomains using localhost, e.g., 'gabojago.localhost:3000'
    // But usually developers use 'localhost:3000' for main and maybe a different port or /tenant path.
    // For production clarity:
    // wayo.co.kr -> Main
    // gabojago.wayo.co.kr -> Tenant (Gabojago)

    const isGabojago = hostname.includes('gabojago');

    // 1. Admin Routing
    if (url.pathname.startsWith('/admin')) {
        if (isGabojago) {
            // Rewrite to the existing Gabojago Admin
            // Assuming current /admin is Gabojago's
            return NextResponse.next();
        } else {
            // Rewrite to Wayo Admin
            // We will create app/wayo-admin and rewrite /admin to /wayo-admin internally
            return NextResponse.rewrite(new URL('/wayo-admin', request.url));
        }
    }

    // 2. Editor Access Control (Example: Pro feature check could go here)
    // For now, we just allow access.

    return NextResponse.next();
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ],
};
