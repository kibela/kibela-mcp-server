import type { RequestHandlerExtra } from "@modelcontextprotocol/sdk/shared/protocol.js";
import type { CallToolResult } from "@modelcontextprotocol/sdk/types.js";
import { z } from "zod";
import { kibela } from "../lib/kibela.ts";
import { getNoteFromPathSchema } from "../lib/schemas.ts";

const schema = z.object(getNoteFromPathSchema);

const getNoteFromPath: (
  args: z.infer<typeof schema>,
  extra: RequestHandlerExtra
) => CallToolResult | Promise<CallToolResult> = async ({ path }) => {
  const data = await kibela.GetNoteFromPath({
    path,
    first: 16,
  });

  if (!data.noteFromPath) {
    return { content: [{ type: "text", text: "Not Found", isError: true }] };
  }

  return {
    content: [
      {
        type: "text",
        text: JSON.stringify({
          id: data.noteFromPath?.id,
          title: data.noteFromPath?.title,
          content: data.noteFromPath?.content,
          url: data.noteFromPath?.url,
          author: {
            account: data.noteFromPath?.author?.account,
            realName: data.noteFromPath?.author?.realName,
          },
          folders: data.noteFromPath?.folders?.edges?.map((edge) => ({
            id: edge?.node?.id,
            name: edge?.node?.name,
            fullName: edge?.node?.fullName,
            fixedPath: edge?.node?.fixedPath,
            group: {
              id: edge?.node?.group?.id,
              name: edge?.node?.group?.name,
            },
          })),
          comments: data.noteFromPath?.comments?.edges?.map((edge) => ({
            id: edge?.node?.id,
            content: edge?.node?.content,
            anchor: edge?.node?.anchor,
            author: {
              account: edge?.node?.author.account,
              realName: edge?.node?.author.realName,
            },
            replies: edge?.node?.replies?.edges?.map((e) => ({
              id: e?.node?.id,
              content: e?.node?.content,
              anchor: e?.node?.anchor,
              author: {
                account: e?.node?.author.account,
                realName: e?.node?.author.realName,
              },
            })),
          })),
          inlineComments: data.noteFromPath?.inlineComments?.edges?.map(
            (edge) => ({
              id: edge?.node?.id,
              content: edge?.node?.content,
              anchor: edge?.node?.anchor,
              author: {
                account: edge?.node?.author.account,
                realName: edge?.node?.author.realName,
              },
              replies: edge?.node?.replies?.edges?.map((e) => ({
                id: e?.node?.id,
                content: e?.node?.content,
                anchor: e?.node?.anchor,
                author: {
                  account: e?.node?.author.account,
                  realName: e?.node?.author.realName,
                },
              })),
            })
          ),
        }),
      },
    ],
  };
};

export { getNoteFromPath };
