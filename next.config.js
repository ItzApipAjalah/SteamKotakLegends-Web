/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,

    // Power by header disabled for cleaner responses
    poweredByHeader: false,

    // Compress responses
    compress: true,

    typescript: {
        // Allow production builds to complete even with TypeScript errors
        ignoreBuildErrors: true,
    },

    // Image optimization for external domains
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'cdn.discordapp.com',
                pathname: '/**',
            },
        ],
        // Optimize images with smaller sizes
        deviceSizes: [640, 750, 828, 1080, 1200],
        imageSizes: [16, 32, 48, 64, 96, 128],
        formats: ['image/avif', 'image/webp'],
        minimumCacheTTL: 31536000, // 1 year cache for optimized images
    },

    // Optimize bundle
    compiler: {
        // Remove console.log in production
        removeConsole: process.env.NODE_ENV === 'production',
    },

    // Enable experimental features for better performance
    experimental: {
        // Optimize package imports
        optimizePackageImports: ['three', 'lenis', 'framer-motion', 'react-icons'],
    },

    // Headers for better caching, security, and preloading
    async headers() {
        return [
            {
                source: '/:path*',
                headers: [
                    {
                        key: 'X-DNS-Prefetch-Control',
                        value: 'on',
                    },
                    {
                        key: 'X-Content-Type-Options',
                        value: 'nosniff',
                    },
                    {
                        key: 'Referrer-Policy',
                        value: 'strict-origin-when-cross-origin',
                    },
                ],
            },
            {
                // Cache static assets for 1 year
                source: '/(.*)\\.(ico|png|jpg|jpeg|gif|webp|avif|svg|woff|woff2|ttf|eot)',
                headers: [
                    {
                        key: 'Cache-Control',
                        value: 'public, max-age=31536000, immutable',
                    },
                ],
            },
            {
                // Cache JS/CSS chunks
                source: '/_next/static/:path*',
                headers: [
                    {
                        key: 'Cache-Control',
                        value: 'public, max-age=31536000, immutable',
                    },
                ],
            },
        ];
    },
};

module.exports = nextConfig;
