"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "./ui/form";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "./ui/select";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { CloudUpload, Loader2, X } from "lucide-react";
import { MarkdownPreview } from "./markdown-preview";
import { changelogPresetValue, formSchema, type FormSchema } from "@/lib/form";
import {
    FileUpload,
    FileUploadDropzone,
    FileUploadItem,
    FileUploadItemDelete,
    FileUploadItemMetadata,
    FileUploadItemPreview,
    FileUploadList,
    FileUploadTrigger,
} from "./ui/file-upload";
import { discordAttachmentSizeLimit } from "@/lib/utils";
import { z } from "zod";
import { fromZodError } from "zod-validation-error";
import { ChangelogTextArea } from "./release-notes/changelog-text-area";
import { RemainingCharacters } from "./release-notes/remaining-characters";
import { TotalBytes } from "./release-notes/total-bytes";

const apiResultSchema = z.union([
    z.object({ success: z.literal(true) }),
    z.object({ success: z.literal(false), message: z.string() }),
]);

export function ReleaseNotesForm() {
    const form = useForm<FormSchema>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            project: "Kings Beta",
            version: "",
            changelog: changelogPresetValue,
            secretKey: "",
            files: [],
        },
    });

    async function onSubmit(data: FormSchema) {
        const id = toast.loading("Publishing release notes...");

        const formData = new FormData();
        for (const [key, value] of Object.entries(data)) {
            if (typeof value === "string") {
                formData.append(key, value);
            } else {
                for (const file of value) {
                    formData.append(key, file, file.name);
                }
            }
        }

        const res = await fetch("/api/release-notes", {
            method: "POST",
            body: formData,
        });

        const result = await res.json();
        const parsed = apiResultSchema.safeParse(result);
        if (!parsed.success) {
            toast.error(fromZodError(parsed.error).toString(), { id });
            return;
        }

        if (!parsed.data.success) {
            toast.error(parsed.data.message, { id });
            return;
        }

        toast.success("Release notes published successfully!", { id });
        form.reset();
    }

    return (
        <div className="grid min-w-full grid-cols-1 gap-6 pt-12 md:grid-cols-2">
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-6"
                >
                    <FormField
                        control={form.control}
                        name="project"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="after:text-destructive after:-ml-0.5 after:content-['*']">
                                    Project
                                </FormLabel>
                                <Select
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                    disabled={form.formState.isSubmitting}
                                >
                                    <FormControl>
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Select a project" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="Kings Beta">
                                            Kings Beta
                                        </SelectItem>
                                        <SelectItem value="Kings Utility">
                                            Kings Utility
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormDescription>
                                    Select the project for this release
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="version"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="after:text-destructive after:-ml-0.5 after:content-['*']">
                                    Version
                                </FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="e.g. 1.0.0"
                                        disabled={form.formState.isSubmitting}
                                        {...field}
                                    />
                                </FormControl>
                                <FormDescription>
                                    Enter the semantic version (e.g. 1.2.3)
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="changelog"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="after:text-destructive after:-ml-0.5 after:content-['*']">
                                    Changelog
                                </FormLabel>
                                <FormControl>
                                    <ChangelogTextArea
                                        placeholder="Enter the changelog details..."
                                        className="min-h-[200px] font-mono"
                                        disabled={form.formState.isSubmitting}
                                        control={form.control}
                                        {...field}
                                    />
                                </FormControl>
                                <FormDescription>
                                    Describe what&apos;s new in this release.
                                    Markdown formatting is supported.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="secretKey"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="after:text-destructive after:-ml-0.5 after:content-['*']">
                                    Secret Key
                                </FormLabel>
                                <FormControl>
                                    <Input
                                        type="password"
                                        placeholder="Enter secret key"
                                        disabled={form.formState.isSubmitting}
                                        {...field}
                                    />
                                </FormControl>
                                <FormDescription>
                                    Enter the secret key to authenticate your
                                    submission.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="files"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Media</FormLabel>
                                <FormControl>
                                    <FileUpload
                                        value={field.value}
                                        onValueChange={field.onChange}
                                        maxFiles={10}
                                        maxSize={discordAttachmentSizeLimit}
                                        accept={[
                                            // jpeg/jpg
                                            "image/jpeg,image/jpg",
                                            // png
                                            "image/png",
                                            // gif/gifv
                                            "image/gif,image/gifv",
                                            // webp
                                            "image/webp",

                                            // mp4
                                            "video/mp4",
                                        ].join(",")}
                                        onFileReject={(file, message) => {
                                            toast.warning(message, {
                                                description: `"${file.name}" has been rejected`,
                                            });
                                        }}
                                        multiple
                                    >
                                        <FileUploadDropzone className="flex-row flex-wrap border-dotted text-center">
                                            <CloudUpload className="size-4" />
                                            Drag and drop or
                                            <FileUploadTrigger asChild>
                                                <Button
                                                    variant="link"
                                                    size="sm"
                                                    className="p-0"
                                                >
                                                    choose files
                                                </Button>
                                            </FileUploadTrigger>
                                            to upload
                                        </FileUploadDropzone>
                                        <FileUploadList>
                                            {field.value.map((file, index) => (
                                                <FileUploadItem
                                                    key={index}
                                                    value={file}
                                                    className="grid grid-cols-[auto_1fr_auto]"
                                                >
                                                    <FileUploadItemPreview />
                                                    <FileUploadItemMetadata />
                                                    <FileUploadItemDelete
                                                        asChild
                                                    >
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="size-7"
                                                        >
                                                            <X />
                                                            <span className="sr-only">
                                                                Delete
                                                            </span>
                                                        </Button>
                                                    </FileUploadItemDelete>
                                                </FileUploadItem>
                                            ))}
                                        </FileUploadList>
                                    </FileUpload>
                                </FormControl>
                                <FormDescription>
                                    Upload up to 10 files (images, videos, etc.)
                                    to include in the release notes.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <div className="flex items-center justify-between gap-4">
                        <Button
                            type="submit"
                            disabled={form.formState.isSubmitting}
                        >
                            {form.formState.isSubmitting && (
                                <Loader2 className="animate-spin" />
                            )}
                            {form.formState.isSubmitting
                                ? "Publishing..."
                                : "Publish Release Notes"}
                        </Button>

                        <div className="text-right text-sm">
                            <p>
                                <span className="font-semibold">
                                    Remaining Characters:
                                </span>{" "}
                                <RemainingCharacters control={form.control} />
                            </p>
                            <p>
                                <span className="font-semibold">
                                    Total Bytes:
                                </span>{" "}
                                <TotalBytes control={form.control} />
                            </p>
                        </div>
                    </div>
                </form>
            </Form>

            <MarkdownPreview control={form.control} />
        </div>
    );
}
