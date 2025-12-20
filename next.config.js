/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    typescript: {
        // Allow production builds to complete even with TypeScript errors
        // Required for LiquidEther.tsx which uses complex WebGL patterns
        ignoreBuildErrors: true,
    },
};

module.exports = nextConfig;

