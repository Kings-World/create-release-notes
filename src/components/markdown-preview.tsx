import ReactMarkdown from "react-markdown";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { cn } from "@/lib/utils";
import { Separator } from "./ui/separator";
import { Button } from "./ui/button";
import { ExternalLink } from "lucide-react";
import type { PreviewData } from "@/lib/form";
import { getProjectEmoji, sections } from "@/lib/discord";
import NextImage from "next/image";

export function MarkdownPreview({ project, version, changelog }: PreviewData) {
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
                )}
            >
                <h1 className="inline-flex items-center gap-1.5">
                    {getProjectEmoji(project) && (
                        <NextImage
                            src={`https://cdn.discordapp.com/emojis/${getProjectEmoji(project)}.webp?size=44`}
                            alt=":kings_beta:"
                            draggable="false"
                            className="my-0! h-9 align-text-top"
                            width={36}
                            height={36}
                            role="img"
                        />
                    )}
                    <span>
                        {project || "Project"} v{version || "0.0.0"}
                    </span>
                </h1>
                <ReactMarkdown>
                    {changelog || "Please enter a changelog first."}
                </ReactMarkdown>
                <Separator />
                {sections.map((section, index) => (
                    <div className="mt-2 flex flex-col gap-1" key={index}>
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
