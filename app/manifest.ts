import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: 'SteamKotakLegends',
        short_name: 'KotakLegends',
        description: 'Inject all your games to Steam with ease. Search, manage, and add games to your Steam library.',
        start_url: '/',
        display: 'standalone',
        background_color: '#050208',
        theme_color: '#8b5cf6',
        orientation: 'portrait',
        icons: [
            {
                src: '/icon-192.png',
                sizes: '192x192',
                type: 'image/png',
            },
            {
                src: '/icon-512.png',
                sizes: '512x512',
                type: 'image/png',
            },
            {
                src: '/icon-512.png',
                sizes: '512x512',
                type: 'image/png',
                purpose: 'maskable',
            },
        ],
    };
}
