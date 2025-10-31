import { calculateRemainingLength } from "@/lib/discord";
import type { FormSchema } from "@/lib/form-schema";
import { type Control, useWatch } from "react-hook-form";

export function RemainingCharacters({
    control,
}: Readonly<{
    control: Control<FormSchema>;
}>) {
    const [project, version, changelog] = useWatch({
        control,
        name: ["project", "version", "changelog"],
    });

    return (
        <span>
            {calculateRemainingLength({
                project,
                version,
                changelog,
            }).toLocaleString()}
        </span>
    );
}
