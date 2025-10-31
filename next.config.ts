import type { NextConfig } from "next";

import "@/lib/env";

const nextConfig: NextConfig = {
    poweredByHeader: false,
    output: "standalone",
    devIndicators: false,
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "cdn.discordapp.com",
            },
        ],
    },
    cacheComponents: true,
    experimental: {
        turbopackFileSystemCacheForDev: true,
    },
};

export default nextConfig;
