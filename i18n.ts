import { notFound } from 'next/navigation';
import { getRequestConfig } from 'next-intl/server';

// Can be imported from a shared config
export const locales = ['en', 'id', 'ja'] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'en';

export const localeNames: Record<Locale, string> = {
    en: 'English',
    id: 'Indonesia',
    ja: '日本語',
};

export default getRequestConfig(async ({ requestLocale }) => {
    // This typically corresponds to the `[locale]` segment
    let locale = await requestLocale;

    // Ensure that the incoming locale is valid
    if (!locale || !locales.includes(locale as Locale)) {
        locale = defaultLocale;
    }

    return {
        locale,
        messages: (await import(`./messages/${locale}.json`)).default
    };
});
