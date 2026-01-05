import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export default function proxy(request: NextRequest) {
    const url = request.nextUrl
    const hostname = request.headers.get('host') || ''
    const currentHost = hostname.toLowerCase()

    console.log(`>>> [Proxy Trace] Host: ${currentHost}, Path: ${url.pathname}`)

    // 1. Wayo Domain Logic
    if (currentHost.includes('wayo.co.kr')) {
        // If it's NOT the gabojago subdomain
        if (!currentHost.includes('gabojago')) {
            if (url.pathname === '/' || url.pathname === '') {
                console.log(`>>> [Proxy] Redirecting wayo.co.kr root to /wayo`)
                return NextResponse.redirect(new URL('/wayo', request.url))
            }
        }
    }

    // 2. Gabojago Domain Logic (Subdomain)
    if (currentHost.includes('gabojago')) {
        if (url.pathname === '/wayo') {
            return NextResponse.redirect(new URL('/', request.url))
        }
    }

    return NextResponse.next()
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - images (public images)
         */
        '/((?!api|_next/static|_next/image|favicon.ico|images).*)',
    ],
}
