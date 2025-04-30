"use server";

import { calculateMaxLength } from "@/lib/discord";
import { env } from "@/lib/env";
import { formSchema, type FormSchema } from "@/lib/form";
import { sendWebhookMessage } from "@/lib/webhook";
import { fromZodError } from "zod-validation-error";

const refinedFormSchema = formSchema
    .refine(
        (data) => data.changelog.length <= calculateMaxLength(data),
        (data) => ({
            message: `The changelog must be less than ${calculateMaxLength(data)} characters`,
        }),
    )
    .refine((data) => data.secretKey === env.SECRET_KEY, {
        message: "Invalid secret key",
    });

export async function submitReleaseNotes(data: FormSchema) {
    const parsed = refinedFormSchema.safeParse(data);
    if (!parsed.success) {
        throw fromZodError(parsed.error);
    }

    await sendWebhookMessage(data);

    return { success: true };
}
