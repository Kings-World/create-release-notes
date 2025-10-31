import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { cn } from "@/lib/utils";
import { Separator } from "./ui/separator";
import { Button } from "./ui/button";
import { ExternalLink } from "lucide-react";
import type { FormSchema } from "@/lib/form-schema";
import { sections } from "@/lib/discord";
import { ProjectAndVersion } from "./markdown-preview/project-and-version";
import { ProjectEmoji } from "./markdown-preview/project-emoji";
import { Markdown } from "./markdown-preview/markdown";
import type { Control } from "react-hook-form";

export function MarkdownPreview({
    control,
}: Readonly<{ control: Control<FormSchema> }>) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Changelog Preview</CardTitle>
            </CardHeader>
            <CardContent
                className={cn(
                    "prose dark:prose-invert prose-sm prose-neutral max-w-none",
                    "prose-h1:mb-2",
                    "prose-h2:mb-2 prose-h2:first-of-type:mt-0 prose-h2:mt-4",
                    "overflow-hidden wrap-break-word",
                )}
            >
                <h1 className="inline-flex items-center gap-1.5">
                    <ProjectEmoji control={control} />
                    <ProjectAndVersion control={control} />
                </h1>
                <Markdown control={control} />
                <Separator />
                {sections.map((section, index) => (
                    <div
                        className="mt-2 flex flex-col gap-1"
                        key={`section-${index + 1}`}
                    >
                        <div className="flex justify-between gap-3">
                            <span className="font-xs flex flex-col justify-center gap-1">
                                {section.content.replace(/^-# /, "")}
                            </span>
                            <Button variant="secondary" size="sm">
                                {section.button.label}
                                <ExternalLink />
                            </Button>
                        </div>
                    </div>
                ))}
            </CardContent>
        </Card>
    );
}
