import { calculateMaxLength } from "@/lib/discord";
import { env } from "@/lib/env";
import { formSchema } from "@/lib/form";
import { sendWebhookMessage } from "@/lib/webhook";
import { NextResponse, type NextRequest } from "next/server";
import { fromZodError } from "zod-validation-error";

const refinedFormSchema = formSchema
    .refine(
        (data) =>
            data.changelog.length <=
            calculateMaxLength(data.project, data.version),
        (data) => ({
            message: `The changelog must be less than ${calculateMaxLength(data.project, data.version)} characters`,
        }),
    )
    .refine((data) => data.secretKey === env.SECRET_KEY, {
        message: "Invalid secret key",
    });

export async function POST(request: NextRequest) {
    const formData = await request.formData();
    const parsed = refinedFormSchema.safeParse({
        project: formData.get("project"),
        version: formData.get("version"),
        changelog: formData.get("changelog"),
        secretKey: formData.get("secretKey"),
        files: formData.getAll("files"),
    });

    if (!parsed.success) {
        return NextResponse.json(
            {
                success: false,
                message: fromZodError(parsed.error).toString(),
            },
            { status: 400 },
        );
    }

    await sendWebhookMessage(parsed.data);

    return NextResponse.json({ success: true });
}
