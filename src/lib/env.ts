import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
    /*
     * Server-side Environment variables, not available on the client.
     * Will throw if you access these variables on the client.
     */
    server: {
        WEBHOOK_ID: z.string().regex(/^\d{17,20}$/),
        WEBHOOK_TOKEN: z.string().regex(/^[\w-]{68}$/),
        WEBHOOK_THREAD_ID: z
            .string()
            .regex(/^\d{17,20}$/)
            .optional(),
        SECRET_KEY: z.string(),
    },

    /*
     * Environment variables available on the client (and server).
     *
     * 💡 You'll get type errors if these are not prefixed with NEXT_PUBLIC_.
     */
    client: {},

    /*
     * Due to how Next.js bundles environment variables on Edge and Client,
     * we need to manually destructure them to make sure all are included in bundle.
     *
     * 💡 You'll get type errors if not all variables from `server` & `client` are included here.
     */
    runtimeEnv: {
        WEBHOOK_ID: process.env.WEBHOOK_ID,
        WEBHOOK_TOKEN: process.env.WEBHOOK_TOKEN,
        WEBHOOK_THREAD_ID: process.env.WEBHOOK_THREAD_ID,
        SECRET_KEY: process.env.SECRET_KEY,
    },
});
