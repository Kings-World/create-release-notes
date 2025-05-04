import type { FormSchema } from "@/lib/form";
import { calculateTotalFileSize } from "@/lib/utils";
import { type Control, useWatch } from "react-hook-form";
import xbytes from "xbytes";

export function TotalBytes({ control }: { control: Control<FormSchema> }) {
    const files = useWatch({ control, name: "files" });

    return <span>{xbytes(calculateTotalFileSize(files), { iec: true })}</span>;
}
