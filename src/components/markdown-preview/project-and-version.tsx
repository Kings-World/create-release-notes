import type { FormSchema } from "@/lib/form-schema";
import { type Control, useWatch } from "react-hook-form";

export function ProjectAndVersion({
    control,
}: {
    control: Control<FormSchema>;
}) {
    const [project, version] = useWatch({
        control,
        name: ["project", "version"],
    });

    return (
        <span>
            {project || "Project"} v{version || "0.0.0"}
        </span>
    );
}
