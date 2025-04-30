import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { parseSize } from "xbytes";

// https://discord.com/developers/docs/reference#uploading-files
export const discordAttachmentSizeLimit = parseSize("10 MiB");

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function calculateTotalFileSize(files: File[]) {
    return files.reduce((total, file) => total + file.size, 0);
}
