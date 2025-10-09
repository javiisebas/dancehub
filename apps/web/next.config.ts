import { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

/** @type {import('next').NextConfig} */
const nextConfig: NextConfig = {
    images: {
        domains: ['lh3.googleusercontent.com'],
    },
    transpilePackages: ['iconoir-react', '@repo/ui', '@repo/shared'],
    experimental: {
        optimizePackageImports: ['sonner'],
        reactCompiler: true,
    },
};

export default withNextIntl(nextConfig);
