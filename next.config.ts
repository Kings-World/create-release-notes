import type { NextConfig } from "next";
import { discordAttachmentSizeLimit } from "@/lib/utils";

import "@/lib/env";

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
