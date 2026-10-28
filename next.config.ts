import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    devIndicators: false,
    experimental: { cpus: 2 },
    // /whats-new was live briefly before the changelog replaced it
    async redirects() {
        return [
            ...(process.env.NEXT_PUBLIC_OPENSTOCK_WIDGETS_ONLY === 'true'
                ? [{ source: '/', destination: '/dashboard', permanent: false }]
                : []),
            { source: '/whats-new', destination: '/changelog', permanent: true },
        ];
    },
    turbopack: {
        root: process.cwd(),
    },
    // No remote images: every next/image src is a local file. Allowing a public upload host here (i.ibb.co was)
    // lets anyone feed files to the image optimizer on self-hosted servers.
    eslint: {
        ignoreDuringBuilds: true,
    },
    typescript: {
        ignoreBuildErrors: true,
    }
};

export default nextConfig;
