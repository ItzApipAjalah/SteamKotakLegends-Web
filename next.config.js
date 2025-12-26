/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
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
    },

    // Optimize bundle
    compiler: {
        // Remove console.log in production
        removeConsole: process.env.NODE_ENV === 'production',
    },

    // Enable experimental features for better performance
    experimental: {
        // Optimize package imports
        optimizePackageImports: ['three', 'lenis'],
    },

    // Headers for better caching and preloading
    async headers() {
        return [
            {
                source: '/:path*',
                headers: [
                    {
                        key: 'X-DNS-Prefetch-Control',
                        value: 'on',
                    },
                ],
            },
        ];
    },
};

module.exports = nextConfig;
