import type { NextConfig } from "next";
import { discordAttachmentSizeLimit } from "@/lib/utils";
import { setupDevPlatform } from "@cloudflare/next-on-pages/next-dev";

import "@/lib/env";

if (process.env.NODE_ENV === "development") {
    await setupDevPlatform();
}

const nextConfig: NextConfig = {
    poweredByHeader: false,
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "cdn.discordapp.com",
            },
        ],
    },
    experimental: {
        serverActions: {
            bodySizeLimit: discordAttachmentSizeLimit,
        },
    },
};

export default nextConfig;
