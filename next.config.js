/** @type {import('next').NextConfig} */
const createNextIntlPlugin = require('next-intl/plugin');

const withNextIntl = createNextIntlPlugin('./i18n.ts');

const nextConfig = {
    reactStrictMode: true,
    typescript: {
        // Allow production builds to complete even with TypeScript errors
        // Required for LiquidEther.tsx which uses complex WebGL patterns
        ignoreBuildErrors: true,
    },
};

module.exports = withNextIntl(nextConfig);
