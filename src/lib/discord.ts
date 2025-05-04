import type { PreviewData } from "./form";

export const message =
    "<@&1294334876803137536> A new update to Kings Beta has been released!";

export const sections = [
    {
        content: "-# Found an issue? Report it here:",
        button: {
            label: "#support",
            url: "https://discord.com/channels/1294330613859356824/1294340420268195904",
        },
    },
    {
        content: "-# Got ideas to share? Send them here:",
        button: {
            label: "#suggestions",
            url: "https://discord.com/channels/1294330613859356824/1295107367037435955",
        },
    },
] as const;

export const componentMaxLength = 4_000;

export function getProjectEmoji(project?: string) {
    switch (project) {
        case "Kings Beta":
            return "1296261614630076426";
        default:
            return null;
    }
}

export function getProjectHeader(project: string, version: string) {
    const emojiId = getProjectEmoji(project);
    const emojiName = project.toLowerCase().replace(/\s+/g, "_");

    return `# ${emojiId ? `<:${emojiName}:${emojiId}> ` : ""}${project} v${version}`;
}

export function calculateHeaderLength(project?: string, version?: string) {
    return getProjectHeader(project ?? "", version ?? "0.0.0").length;
}

export function calculateSectionContentLength() {
    return sections.reduce(
        (length, section) => length + section.content.length,
        0,
    );
}

export function calculateChangelogLength({
    project,
    version,
    changelog,
}: PreviewData) {
    const header = calculateHeaderLength(project, version);
    const links = calculateSectionContentLength();

    return message.length + header + (changelog?.length ?? 0) + links;
}

export function calculateRemainingLength(previewData: PreviewData) {
    const changelogLength = calculateChangelogLength(previewData);
    return componentMaxLength - changelogLength;
}

export function calculateMaxLength(project: string, version: string) {
    const header = calculateHeaderLength(project, version);
    const links = calculateSectionContentLength();

    return componentMaxLength - message.length - header - links;
}
