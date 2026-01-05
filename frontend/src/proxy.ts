import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export default function proxy(request: NextRequest) {
    const url = request.nextUrl
    const hostname = request.headers.get('host') || ''

    // Domains
    const wayoDomain = 'wayo.co.kr'
    const gabojagoDomain = 'gabojago.wayo.co.kr'

    // Support local development testing via ?host=...
    const urlHost = url.searchParams.get('__host')
    const currentHost = (urlHost || hostname).toLowerCase()

    console.log(`[Middleware] Host: ${currentHost}, Path: ${url.pathname}`)

    // 1. Wayo Root Domain (wayo.co.kr or www.wayo.co.kr)
    const isWayoHost = currentHost === wayoDomain || currentHost === `www.${wayoDomain}` || currentHost.endsWith(`.${wayoDomain}`)
    const isGabojagoHost = currentHost.includes('gabojago')

    if (isWayoHost && !isGabojagoHost) {
        if (url.pathname === '/' || url.pathname === '') {
            console.log(`[Middleware] Rewriting to /wayo for ${currentHost}`)
            return NextResponse.rewrite(new URL('/wayo', request.url))
        }
    }

    // 2. Gabojago Subdomain (gabojago.wayo.co.kr)
    if (isGabojagoHost) {
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
