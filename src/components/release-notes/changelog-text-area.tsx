import type { FormSchema } from "@/lib/form-schema";
import { useWatch, type Control } from "react-hook-form";
import { calculateMaxLength } from "@/lib/discord";

export function ChangelogTextArea({
    control,
}: {
    control: Control<FormSchema>;
}) {
    const [project, version] = useWatch({
        control,
        name: ["project", "version"],
    });

    return calculateMaxLength(project, version);
}
