import type { Metadata, Viewport } from 'next';
import { Space_Grotesk, Inter } from 'next/font/google';
import './globals.css';
import { PerformanceAlert, DebugPanel, DevToolsBlocker } from '@/components';
import ContextMenuProvider from '@/components/ContextMenuProvider';

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
        // Core brand keywords
        'Steam', 'SteamKotakLegends', 'Steam Kotak Legends', 'Kotak Legends',
        'Steam tools', 'Steam utility', 'Steam helper', 'Steam toolkit',

        // Game injection keywords
        'game injection', 'inject game to Steam', 'add game to Steam library',
        'Steam game injection', 'inject cracked games Steam', 'Steam inject tool',
        'add non-Steam games', 'Steam library injection', 'game injector',

        // Library management
        'Steam library manager', 'game manager', 'Steam companion', 'Steam organizer',
        'game collection manager', 'Steam library organizer', 'library tool',

        // Manifest & Depot
        'manifest download', 'Steam manifest', 'depot download', 'Steam depot',
        'manifest downloader', 'depot downloader', 'SteamDB manifest',
        'download game manifest', 'Steam CDN', 'Steam content download',

        // Multiplayer & Online
        'multiplayer fix', 'online fix', 'Steam online fix', 'LAN fix',
        'play multiplayer cracked games', 'online multiplayer pirated games',
        'crack multiplayer', 'multiplayer crack', 'Steam online crack',
        'SmartSteamEmu', 'SSE', 'Goldberg', 'Steam emu',

        // AppID & Spoofer
        'AppID spoofer', 'Steam AppID', 'game spoofer', 'AppID changer',
        'Steam ID spoofer', 'fake Steam AppID', 'spoof game ID',

        // Download & Free games
        'game downloader', 'Steam game download', 'free games', 'free PC games',
        'download free games', 'game download tool', 'Steam download manager',
        'free game download 2024', 'free game download 2025',

        // Unlock & Crack
        'Steam unlocker', 'DLC unlocker', 'Steam DLC', 'unlock all DLC',
        'DLC unlocker tool', 'Steam DLC downloader', 'free DLC',
        'Steam emulator', 'Steam crack alternative', 'crack Steam games',
        'CreamAPI', 'Cream API', 'DLC unlock', 'unlock Steam DLC',

        // Gaming general
        'PC games', 'gaming tools', 'gaming utility', 'PC gaming',
        'Steam alternative', 'game library', 'game collection',
        'pirated games Steam', 'cracked games Steam', 'repack games',
        'FitGirl repack', 'DODI repack', 'game repack',

        // Specific sites/alternatives
        'cs.rin.ru', 'steamunlocked alternative', 'fitgirl alternative',
        'game piracy', 'piracy tools', 'Steam piracy',

        // Indonesian keywords (important for local SEO)
        'download game gratis', 'game PC gratis', 'Steam gratis',
        'inject game Steam', 'cara inject game Steam', 'tutorial inject Steam',
        'game bajakan Steam', 'Steam bajakan', 'crack game Steam',
        'download manifest Steam', 'game multiplayer gratis',
        'main game bajakan online', 'multiplayer game bajakan',
        'download game PC gratis 2024', 'download game PC gratis 2025',
        'game gratis terbaru', 'game PC terbaru gratis',
        'cara main game bajakan multiplayer', 'tutorial Steam bajakan',
        'DLC gratis Steam', 'unlock DLC gratis', 'game full DLC gratis',
        'download game ringan', 'game PC ringan gratis',

        // Brand & Author
        'KotakLegends', 'Kotak Legends', 'AMWP', 'KizuTOD',
        'kotaklegend', 'kotak legend', 'SteamKotak',

        // Long-tail keywords
        'how to add games to Steam', 'Steam library tool',
        'Steam game injector', 'Steam manifest downloader',
        'play cracked games on Steam', 'online multiplayer fix',
        'how to play pirated games on Steam', 'add cracked games to Steam library',
        'Steam achievements for cracked games', 'Steam overlay for cracked games',
        'how to unlock all DLC Steam', 'how to get free DLC Steam',
        'best Steam tools 2024', 'best Steam tools 2025',
        'Steam game manager free', 'Steam library manager free download',

        // Technical keywords
        'Steam API', 'Steamworks', 'Steam SDK', 'Steam integration',
        'Steam overlay', 'Steam achievements', 'Steam cloud save',
        'Steam workshop', 'Steam mods', 'mod manager Steam',

        // Game-specific (popular games)
        'GTA V Steam inject', 'Red Dead Redemption 2 Steam', 'Cyberpunk 2077 Steam',
        'Elden Ring Steam inject', 'Hogwarts Legacy Steam', 'Baldurs Gate 3 Steam',
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
                {/* Google Search Console Verification */}
                <meta name="google-site-verification" content="51091D40RACwDnOAxluD4D85HG7rZWzw3z-jEw1j5vA" />

                {/* Additional Image Meta Tags for Google */}
                <meta property="og:image:secure_url" content={`${siteUrl}/og-image.png`} />
                <meta name="thumbnail" content={`${siteUrl}/og-image.png`} />
                <link rel="image_src" href={`${siteUrl}/og-image.png`} />

                {/* Preconnect to critical origins */}
                <link rel="preconnect" href="https://cdn.discordapp.com" crossOrigin="anonymous" />
                <link rel="dns-prefetch" href="https://cdn.discordapp.com" />
                <link rel="preconnect" href="https://api.github.com" crossOrigin="anonymous" />
                <link rel="dns-prefetch" href="https://api.github.com" />

                {/* Canonical URL */}
                <link rel="canonical" href={siteUrl} />
            </head>
            <body>
                <ContextMenuProvider>
                    <DevToolsBlocker />
                    <PerformanceAlert />
                    <DebugPanel />
                    {children}
                </ContextMenuProvider>

                {/* Structured Data - JSON-LD */}
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify({
                            "@context": "https://schema.org",
                            "@type": "SoftwareApplication",
                            "name": "SteamKotakLegends",
                            "applicationCategory": "GameApplication",
                            "operatingSystem": "Windows",
                            "offers": {
                                "@type": "Offer",
                                "price": "0",
                                "priceCurrency": "USD"
                            },
                            "description": siteDescription,
                            "url": siteUrl,
                            "image": `${siteUrl}/og-image.png`,
                            "author": {
                                "@type": "Organization",
                                "name": "SteamKotakLegends Team",
                                "url": "https://github.com/ItzApipAjalah"
                            },
                            "aggregateRating": {
                                "@type": "AggregateRating",
                                "ratingValue": "5",
                                "ratingCount": "100"
                            }
                        })
                    }}
                />

                {/* WebSite Schema for Sitelinks Search Box */}
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify({
                            "@context": "https://schema.org",
                            "@type": "WebSite",
                            "name": "SteamKotakLegends",
                            "url": siteUrl,
                            "description": siteDescription,
                            "publisher": {
                                "@type": "Organization",
                                "name": "SteamKotakLegends Team",
                                "logo": {
                                    "@type": "ImageObject",
                                    "url": `${siteUrl}/icon-512.png`
                                }
                            }
                        })
                    }}
                />
            </body>
        </html>
    );
}
