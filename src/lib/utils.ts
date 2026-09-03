import { parseSize } from "xbytes";

export { cn } from "cn";

// https://discord.com/developers/docs/reference#uploading-files
export const discordAttachmentSizeLimit = parseSize("10 MiB");

export function calculateTotalFileSize(files: File[]) {
    return files.reduce((total, file) => total + file.size, 0);
}
