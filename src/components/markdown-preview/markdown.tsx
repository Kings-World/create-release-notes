import type { FormSchema } from "@/lib/form-schema";
import { type Control, useWatch } from "react-hook-form";
import ReactMarkdown from "react-markdown";

export function Markdown({
    control,
}: Readonly<{ control: Control<FormSchema> }>) {
    const changelog = useWatch({ control, name: "changelog" });

    return (
        <ReactMarkdown>
            {changelog || "Please enter a changelog first."}
        </ReactMarkdown>
    );
}
