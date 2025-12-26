import type { Metadata } from 'next';
import { Space_Grotesk, Inter } from 'next/font/google';
import './globals.css';
import { PerformanceAlert, DebugPanel } from '@/components';

const spaceGrotesk = Space_Grotesk({
    subsets: ['latin'],
    weight: ['400', '500', '600', '700'],
    variable: '--font-heading',
    display: 'swap',
});

const inter = Inter({
    subsets: ['latin'],
    weight: ['300', '400', '500', '600'],
    variable: '--font-body',
    display: 'swap',
});

export const metadata: Metadata = {
    title: 'SteamKotakLegends - Inject All Game to Steam',
    description: 'SteamKotakLegends - Inject all game to Steam. Search, manage, and add games to your Steam library with ease.',
    keywords: 'Steam, game injection, library management, multiplayer, manifest download',
    authors: [{ name: 'SteamKotakLegends' }],
    openGraph: {
        title: 'SteamKotakLegends - Inject All Game to Steam',
        description: 'The ultimate tool to manage and inject games into your Steam library.',
        type: 'website',
    },
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" className={`${spaceGrotesk.variable} ${inter.variable}`}>
            <body>
                <PerformanceAlert />
                <DebugPanel />
                {children}
            </body>
        </html>
    );
}

