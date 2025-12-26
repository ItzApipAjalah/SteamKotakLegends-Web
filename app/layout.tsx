import type { Metadata, Viewport } from 'next';
import { Space_Grotesk, Inter } from 'next/font/google';
import './globals.css';
import { PerformanceAlert, DebugPanel } from '@/components';

const spaceGrotesk = Space_Grotesk({
    subsets: ['latin'],
    weight: ['400', '500', '600', '700'],
    variable: '--font-heading',
    display: 'swap',
    preload: true,
});

const inter = Inter({
    subsets: ['latin'],
    weight: ['300', '400', '500', '600'],
    variable: '--font-body',
    display: 'swap',
    preload: true,
});

export const viewport: Viewport = {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
    themeColor: [
        { media: '(prefers-color-scheme: light)', color: '#8b5cf6' },
        { media: '(prefers-color-scheme: dark)', color: '#050208' },
    ],
};

const siteUrl = 'https://steam.kotaklegend.my.id';
const siteName = 'SteamKotakLegends';
const siteDescription = 'Inject all your games to Steam with ease. Search, manage, and add games to your Steam library. The ultimate Steam companion tool.';

export const metadata: Metadata = {
    // Basic
    title: {
        default: 'SteamKotakLegends - Inject All Game to Steam',
        template: '%s | SteamKotakLegends',
    },
    description: siteDescription,
    keywords: [
        'Steam',
        'game injection',
        'Steam library',
        'game manager',
        'Steam tools',
        'multiplayer',
        'manifest download',
        'KotakLegends',
        'Steam companion',
        'game downloader',
    ],
    authors: [
        { name: 'AMWP', url: 'https://github.com/ItzApipAjalah' },
        { name: 'KizuTOD' },
    ],
    creator: 'SteamKotakLegends Team',
    publisher: 'SteamKotakLegends',

    // Icons
    icons: {
        icon: [
            { url: '/favicon.ico', sizes: 'any' },
            { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
            { url: '/icon-512.png', sizes: '512x512', type: 'image/png' },
        ],
        apple: [
            { url: '/apple-icon.png', sizes: '180x180', type: 'image/png' },
        ],
        shortcut: '/favicon.ico',
    },

    // Manifest
    manifest: '/manifest.webmanifest',

    // Open Graph
    openGraph: {
        type: 'website',
        locale: 'id_ID',
        alternateLocale: 'en_US',
        url: siteUrl,
        siteName: siteName,
        title: 'SteamKotakLegends - Inject All Game to Steam',
        description: siteDescription,
        images: [
            {
                url: `${siteUrl}/og-image.png`,
                width: 1280,
                height: 427,
                alt: 'SteamKotakLegends - Inject All Game to Steam',
                type: 'image/png',
            },
        ],
    },

    // Twitter
    twitter: {
        card: 'summary_large_image',
        title: 'SteamKotakLegends - Inject All Game to Steam',
        description: siteDescription,
        images: [`${siteUrl}/og-image.png`],
        creator: '@SteamKotakLegends',
    },

    // Robots
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            'max-video-preview': -1,
            'max-image-preview': 'large',
            'max-snippet': -1,
        },
    },

    // Verification (add your IDs when you have them)
    // verification: {
    //     google: 'your-google-verification-code',
    //     yandex: 'your-yandex-verification-code',
    // },

    // Category
    category: 'technology',

    // Other
    applicationName: siteName,
    referrer: 'origin-when-cross-origin',
    formatDetection: {
        email: false,
        address: false,
        telephone: false,
    },
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="id" className={`${spaceGrotesk.variable} ${inter.variable}`}>
            <head>
                {/* Preconnect to critical origins */}
                <link rel="preconnect" href="https://cdn.discordapp.com" crossOrigin="anonymous" />
                <link rel="dns-prefetch" href="https://cdn.discordapp.com" />
                <link rel="preconnect" href="https://api.github.com" crossOrigin="anonymous" />
                <link rel="dns-prefetch" href="https://api.github.com" />

                {/* Canonical URL */}
                <link rel="canonical" href={siteUrl} />
            </head>
            <body>
                <PerformanceAlert />
                <DebugPanel />
                {children}
            </body>
        </html>
    );
}
