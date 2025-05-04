import { getProjectEmoji } from "@/lib/discord";
import type { FormSchema } from "@/lib/form";
import { type Control, useWatch } from "react-hook-form";
import NextImage from "next/image";

export function ProjectEmoji({ control }: { control: Control<FormSchema> }) {
    const project = useWatch({ control, name: "project" });
    const emoji = getProjectEmoji(project);

    if (!emoji) return null;

    return (
        <NextImage
            src={`https://cdn.discordapp.com/emojis/${emoji}.webp?size=44`}
            alt={`:${project.toLowerCase().replace(/\s+/g, "_")}:`}
            draggable="false"
            className="my-0! h-9 align-text-top"
            width={36}
            height={36}
            role="img"
        />
    );
}
