import "server-only";

import {
    ButtonStyle,
    ComponentType,
    MessageFlags,
    Routes,
    SeparatorSpacingSize,
    type APIComponentInContainer,
    type APIMessageTopLevelComponent,
    type RESTPostAPIWebhookWithTokenJSONBody,
} from "@discordjs/core/http-only";
import { makeURLSearchParams, REST, type RawFile } from "@discordjs/rest";

import type { FormSchema } from "./form";
import { getProjectHeader, message, sections } from "./discord";
import { env } from "./env";

const rest = new REST({ version: "10" });

export async function sendWebhookMessage(data: FormSchema) {
    const files =
        data.files.length > 0
            ? await Promise.all(
                  data.files.map(
                      async (file) =>
                          ({
                              name: file.name,
                              data: await file.bytes(),
                              contentType: file.type,
                          }) satisfies RawFile,
                  ),
              )
            : [];

    return rest.post(Routes.webhook(env.WEBHOOK_ID, env.WEBHOOK_TOKEN), {
        query: makeURLSearchParams({
            wait: true,
            thread_id: env.WEBHOOK_THREAD_ID,
            with_components: true,
        }),
        auth: false,
        files,
        body: {
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
                            content: getProjectHeader(
                                data.project,
                                data.version,
                            ),
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
        } satisfies RESTPostAPIWebhookWithTokenJSONBody,
    });

    // return api.webhooks.execute(env.WEBHOOK_ID, env.WEBHOOK_TOKEN, {
    //     flags: MessageFlags.IsComponentsV2,
    //     with_components: true,
    //     components: [
    //         {
    //             type: ComponentType.TextDisplay,
    //             content: message,
    //         },
    //         {
    //             type: ComponentType.Container,
    //             components: [
    //                 {
    //                     type: ComponentType.TextDisplay,
    //                     content: getProjectHeader(data.project, data.version),
    //                 },
    //                 {
    //                     type: ComponentType.TextDisplay,
    //                     content: data.changelog,
    //                 },
    //                 {
    //                     type: ComponentType.Separator,
    //                     divider: true,
    //                     spacing: SeparatorSpacingSize.Small,
    //                 },
    //                 ...sections.map(
    //                     (section) =>
    //                         ({
    //                             type: ComponentType.Section,
    //                             components: [
    //                                 {
    //                                     type: ComponentType.TextDisplay,
    //                                     content: section.content,
    //                                 },
    //                             ],
    //                             accessory: {
    //                                 type: ComponentType.Button,
    //                                 style: ButtonStyle.Link,
    //                                 label: section.button.label,
    //                                 url: section.button.url,
    //                             },
    //                         }) satisfies APIComponentInContainer,
    //                 ),
    //             ],
    //         },
    //     ],
    // });
}
