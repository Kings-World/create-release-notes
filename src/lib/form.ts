import { z } from "zod";
import semver from "semver";
import { componentMaxLength } from "./discord";

export const changelogPresetValue =
    "## Features\n- \n\n## Bug Fixes\n- \n\n## Other Changes\n- ";

export const formSchema = z.object({
    project: z.string().min(1, "Please select a project"),
    version: z
        .string()
        .min(1, "Please enter a version")
        .refine((value) => semver.valid(value), {
            message: "The version must be valid semver",
        }),
    changelog: z
        .string()
        .min(1, "Please enter a changelog")
        .max(
            componentMaxLength,
            `The changelog must be less than ${componentMaxLength} characters`,
        )
        .refine((value) => value !== changelogPresetValue, {
            message: "Please enter changes in the changelog",
        }),
    secretKey: z.string().min(1, "Please enter the secret key"),
    files: z.array(z.custom<File>()).max(10, "You can only upload 10 files"),
});

export type FormSchema = z.infer<typeof formSchema>;
export type PreviewData = Partial<Omit<FormSchema, "secretKey" | "files">>;
