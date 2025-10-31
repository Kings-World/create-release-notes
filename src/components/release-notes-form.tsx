"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { MarkdownPreview } from "./markdown-preview";
import {
    changelogPresetValue,
    formSchema,
    type FormSchema,
} from "@/lib/form-schema";
import {
    FieldSet,
    FieldGroup,
    Field,
    FieldLabel,
    FieldContent,
    FieldDescription,
    FieldError,
} from "./ui/field";
import { Input } from "./ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "./ui/select";
import {
    InputGroup,
    InputGroupAddon,
    InputGroupText,
    InputGroupTextarea,
} from "./ui/input-group";
import { discordAttachmentSizeLimit } from "@/lib/utils";
import { toast } from "sonner";
import { CloudUpload, X } from "lucide-react";
import { Button } from "./ui/button";
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
import { Controller, useForm } from "react-hook-form";
import { Spinner } from "./ui/spinner";
import { RemainingCharacters } from "./release-notes/remaining-characters";
import { TotalBytes } from "./release-notes/total-bytes";
import { sendWebhookMessage } from "@/lib/webhook";
import { ChangelogTextArea } from "./release-notes/changelog-text-area";

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

    function onSubmit(data: FormSchema) {
        toast.promise(() => sendWebhookMessage(data), {
            loading: "Publishing...",
            success: () => {
                form.reset();
                return "Published successfully!";
            },
            error: (e) => `Failed to publish release notes: ${e.message}`,
        });
    }

    return (
        <div className="grid min-w-full grid-cols-1 gap-6 pt-8 md:grid-cols-2">
            <form onSubmit={form.handleSubmit(onSubmit)}>
                <FieldSet>
                    <FieldGroup>
                        <Controller
                            control={form.control}
                            name="project"
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldContent>
                                        <FieldLabel htmlFor={field.name}>
                                            Project
                                        </FieldLabel>
                                        <Select
                                            {...field}
                                            onValueChange={field.onChange}
                                        >
                                            <SelectTrigger
                                                className="w-full"
                                                id={field.name}
                                                aria-invalid={
                                                    fieldState.invalid
                                                }
                                            >
                                                <SelectValue placeholder="Select a project" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Kings Beta">
                                                    Kings Beta
                                                </SelectItem>
                                                <SelectItem value="Kings Utility">
                                                    Kings Utility
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FieldDescription>
                                            Select the project for this release.
                                        </FieldDescription>
                                        {fieldState.invalid && (
                                            <FieldError
                                                errors={[fieldState.error]}
                                            />
                                        )}
                                    </FieldContent>
                                </Field>
                            )}
                        />

                        <Controller
                            control={form.control}
                            name="version"
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldContent>
                                        <FieldLabel htmlFor={field.name}>
                                            Version
                                        </FieldLabel>
                                        <Input
                                            {...field}
                                            id={field.name}
                                            placeholder="e.g. 1.0.0"
                                            aria-invalid={fieldState.invalid}
                                        />
                                        <FieldDescription>
                                            Specify the version number for this
                                            release.
                                        </FieldDescription>
                                        {fieldState.invalid && (
                                            <FieldError
                                                errors={[fieldState.error]}
                                            />
                                        )}
                                    </FieldContent>
                                </Field>
                            )}
                        />

                        <Controller
                            control={form.control}
                            name="changelog"
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldContent>
                                        <FieldLabel htmlFor="changelog">
                                            Changelog
                                        </FieldLabel>
                                        <InputGroup>
                                            <InputGroupTextarea
                                                {...field}
                                                id="changelog"
                                                placeholder="Enter changelog details here"
                                                aria-invalid={
                                                    fieldState.invalid
                                                }
                                                maxLength={ChangelogTextArea({
                                                    control: form.control,
                                                })}
                                            />
                                            <InputGroupAddon align="block-end">
                                                <InputGroupText className="gap-1 text-xs">
                                                    <RemainingCharacters
                                                        control={form.control}
                                                    />
                                                    <span>characters left</span>
                                                </InputGroupText>
                                            </InputGroupAddon>
                                        </InputGroup>
                                        <FieldDescription>
                                            Describe what&apos;s new in this
                                            release. Markdown formatting is
                                            supported.
                                        </FieldDescription>
                                        {fieldState.invalid && (
                                            <FieldError
                                                errors={[fieldState.error]}
                                            />
                                        )}
                                    </FieldContent>
                                </Field>
                            )}
                        />

                        <Controller
                            control={form.control}
                            name="files"
                            render={({ field, fieldState }) => (
                                <Field>
                                    <FieldContent>
                                        <FieldLabel className="w-full items-center justify-between">
                                            Attachments{" "}
                                            {field.value.length > 0 && (
                                                <span className="text-muted-foreground text-xs">
                                                    <TotalBytes
                                                        control={form.control}
                                                    />{" "}
                                                    bytes
                                                </span>
                                            )}
                                        </FieldLabel>
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
                                                {field.value.map(
                                                    (file, index) => (
                                                        <FileUploadItem
                                                            key={`file-${index + 1}`}
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
                                                    ),
                                                )}
                                            </FileUploadList>
                                        </FileUpload>
                                        <FieldDescription>
                                            Upload up to 10 files (images,
                                            videos, etc.) to include in the
                                            release notes.
                                        </FieldDescription>
                                        {fieldState.invalid && (
                                            <FieldError
                                                errors={[fieldState.error]}
                                            />
                                        )}
                                    </FieldContent>
                                </Field>
                            )}
                        />
                    </FieldGroup>
                    <FieldGroup>
                        <Field orientation="horizontal">
                            <Controller
                                control={form.control}
                                name="secretKey"
                                render={({ field, fieldState }) => (
                                    <Input
                                        {...field}
                                        name={field.name}
                                        placeholder="Enter secret key"
                                        aria-invalid={fieldState.invalid}
                                        type="password"
                                    />
                                )}
                            />
                            <Button
                                type="submit"
                                disabled={form.formState.isSubmitting}
                            >
                                {form.formState.isSubmitting ? (
                                    <>
                                        <Spinner />
                                        Publishing...
                                    </>
                                ) : (
                                    <>Publish Release Notes</>
                                )}
                            </Button>
                        </Field>
                    </FieldGroup>
                </FieldSet>
            </form>

            <MarkdownPreview control={form.control} />
        </div>
    );
}
