import type { FormSchema } from "@/lib/form";
import { useWatch, type Control } from "react-hook-form";
import { Textarea } from "../ui/textarea";
import { calculateMaxLength } from "@/lib/discord";

export function ChangelogTextArea({
    control,
    ...props
}: React.ComponentProps<"textarea"> & { control: Control<FormSchema> }) {
    const [project, version] = useWatch({
        control,
        name: ["project", "version"],
    });

    return (
        <Textarea {...props} maxLength={calculateMaxLength(project, version)} />
    );
}
