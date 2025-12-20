import type { Metadata } from 'next';
import { Space_Grotesk, Inter } from 'next/font/google';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { locales, type Locale } from '@/i18n';
import '../globals.css';
import { GlassCursor, PerformanceAlert } from '@/components';

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

type Props = {
    children: React.ReactNode;
    params: Promise<{ locale: string }>;
};

export default async function LocaleLayout({
    children,
    params,
}: Props) {
    // Await params before accessing properties (Next.js 15 requirement)
    const { locale } = await params;

    // Validate that the incoming `locale` parameter is valid
    if (!locales.includes(locale as Locale)) {
        notFound();
    }

    // Providing all messages to the client side
    const messages = await getMessages();

    return (
        <html lang={locale} className={`${spaceGrotesk.variable} ${inter.variable}`}>
            <body>
                <NextIntlClientProvider messages={messages}>
                    <GlassCursor />
                    <PerformanceAlert />
                    {children}
                </NextIntlClientProvider>
            </body>
        </html>
    );
}

export function generateStaticParams() {
    return locales.map((locale) => ({ locale }));
}
