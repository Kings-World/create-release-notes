"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
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
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { CloudUpload, Loader2, X } from "lucide-react";
import { MarkdownPreview } from "./markdown-preview";
import {
    changelogPresetValue,
    formSchema,
    type FormSchema,
    type PreviewData,
} from "@/lib/form";
import { calculateMaxLength, calculateRemainingLength } from "@/lib/discord";
import { submitReleaseNotes } from "@/actions/create-release";
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
import {
    calculateTotalFileSize,
    discordAttachmentSizeLimit,
} from "@/lib/utils";
import xbytes from "xbytes";

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

    const [previewData, setPreviewData] = useState<PreviewData>({
        project: form.formState.defaultValues?.project,
        version: form.formState.defaultValues?.version,
        changelog: form.formState.defaultValues?.changelog,
    });

    useEffect(() => {
        // update preview when form values change
        const subscription = form.watch(({ secretKey, ...preview }) => {
            setPreviewData(preview);
            void secretKey; // we don't need the secret key in the preview
        });
        return () => subscription.unsubscribe();
    }, [form, form.watch]);

    async function onSubmit(data: FormSchema) {
        const output = toast.promise(() => submitReleaseNotes(data), {
            success: (out) => {
                console.log("out", out);
                return "Release notes published successfully!";
            },
            error: (out) => out.message || "Failed to publish release notes",
            loading: "Publishing release notes...",
        });

        await output.unwrap().catch(() => null);
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
                                    <Textarea
                                        placeholder="Enter the changelog details..."
                                        className="min-h-[200px] font-mono"
                                        disabled={form.formState.isSubmitting}
                                        maxLength={calculateMaxLength(
                                            previewData,
                                        )}
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

                                            "image/webp,image/png,image/jpeg,image/jpg,image/gif,video/mp4,video",
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
                                <span>
                                    {calculateRemainingLength(
                                        previewData,
                                    ).toLocaleString()}
                                </span>
                            </p>
                            <p>
                                <span className="font-semibold">
                                    Total Bytes:
                                </span>{" "}
                                <span>
                                    {xbytes(
                                        calculateTotalFileSize(
                                            form.getValues().files,
                                        ),
                                        { iec: true },
                                    )}
                                </span>
                            </p>
                        </div>
                    </div>
                </form>
            </Form>

            <MarkdownPreview {...previewData} />
        </div>
    );
}
