import "server-only";

import {
    API,
    ButtonStyle,
    ComponentType,
    MessageFlags,
    SeparatorSpacingSize,
    type APIComponentInContainer,
    type APIMessageTopLevelComponent,
} from "@discordjs/core/http-only";
import { REST, type RawFile } from "@discordjs/rest";
import { nanoid } from "nanoid";

import type { FormSchema } from "./form";
import { getProjectHeader, message, sections } from "./discord";
import { env } from "./env";

const rest = new REST({ version: "10" });
const api = new API(rest);

export async function sendWebhookMessage(data: FormSchema) {
    const files =
        data.files.length > 0
            ? await Promise.all(
                  data.files.map(
                      async (file) =>
                          ({
                              name: `${nanoid(8)}${getFileExt(file.name)}`,
                              data: await file.bytes(),
                              contentType: file.type,
                          }) satisfies RawFile,
                  ),
              )
            : [];

    await api.webhooks.execute(env.WEBHOOK_ID, env.WEBHOOK_TOKEN, {
        wait: true,
        thread_id: env.WEBHOOK_THREAD_ID,
        with_components: true,
        files,
        flags: MessageFlags.IsComponentsV2,
        components: [
            {
                type: ComponentType.TextDisplay,
                content: message,
            },
            {
                type: ComponentType.Container,
                components: [
                    {
                        type: ComponentType.TextDisplay,
                        content: getProjectHeader(data.project, data.version),
                    },
                    {
                        type: ComponentType.TextDisplay,
                        content: data.changelog,
                    },
                    {
                        type: ComponentType.Separator,
                        divider: true,
                        spacing: SeparatorSpacingSize.Small,
                    },
                    ...sections.map(
                        (section) =>
                            ({
                                type: ComponentType.Section,
                                components: [
                                    {
                                        type: ComponentType.TextDisplay,
                                        content: section.content,
                                    },
                                ],
                                accessory: {
                                    type: ComponentType.Button,
                                    style: ButtonStyle.Link,
                                    label: section.button.label,
                                    url: section.button.url,
                                },
                            }) satisfies APIComponentInContainer,
                    ),
                ],
            },
            ...(files.length > 0
                ? [
                      {
                          type: ComponentType.MediaGallery,
                          items: files.map((file) => ({
                              media: {
                                  url: `attachment://${file.name}`,
                                  content_type: file.contentType,
                              },
                          })),
                      } satisfies APIMessageTopLevelComponent,
                  ]
                : []),
        ],
    });
}

function getFileExt(filename: string) {
    const index = filename.lastIndexOf(".");
    if (index <= 0) return "";
    return filename.slice(index);
}
