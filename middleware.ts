import { NextRequest, NextResponse } from 'next/server';
import createMiddleware from 'next-intl/middleware';
import { locales, defaultLocale, type Locale } from './i18n';

// Country code to locale mapping
const countryToLocale: Record<string, Locale> = {
    // Indonesia
    'ID': 'id',
    // Japan
    'JP': 'ja',
    // English-speaking countries
    'US': 'en',
    'GB': 'en',
    'AU': 'en',
    'CA': 'en',
    'NZ': 'en',
    'SG': 'en',
};

// Create the next-intl middleware
const intlMiddleware = createMiddleware({
    locales: locales,
    defaultLocale: defaultLocale,
    localePrefix: 'always',
    // Detect locale from Accept-Language header as fallback
    localeDetection: true
});

export default async function middleware(request: NextRequest) {
    const pathname = request.nextUrl.pathname;

    // Skip for API routes and static files
    if (
        pathname.startsWith('/api/') ||
        pathname.startsWith('/_next/') ||
        pathname.includes('.')
    ) {
        return NextResponse.next();
    }

    // Check if the pathname already has a locale prefix
    const pathnameHasLocale = locales.some(
        (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
    );

    // If user is on root path without locale, detect their country
    if (pathname === '/') {
        // Try to get country from various headers (works with Vercel, Cloudflare, etc.)
        const country =
            request.headers.get('x-vercel-ip-country') ||
            request.headers.get('cf-ipcountry') ||
            request.headers.get('x-country-code') ||
            request.geo?.country ||
            null;

        if (country) {
            const detectedLocale = countryToLocale[country.toUpperCase()] || defaultLocale;

            // Redirect to the detected locale
            const url = request.nextUrl.clone();
            url.pathname = `/${detectedLocale}`;
            return NextResponse.redirect(url);
        }

        // Fallback: Check Accept-Language header
        const acceptLanguage = request.headers.get('accept-language');
        if (acceptLanguage) {
            const browserLocale = acceptLanguage.split(',')[0].split('-')[0].toLowerCase();
            if (locales.includes(browserLocale as Locale)) {
                const url = request.nextUrl.clone();
                url.pathname = `/${browserLocale}`;
                return NextResponse.redirect(url);
            }
        }
    }

    // Let next-intl handle the rest
    return intlMiddleware(request);
}

export const config = {
    matcher: ['/', '/(en|id|ja)/:path*']
};
