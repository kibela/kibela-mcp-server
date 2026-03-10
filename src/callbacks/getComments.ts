import type { RequestHandlerExtra } from "@modelcontextprotocol/sdk/shared/protocol.js";
import type { CallToolResult } from "@modelcontextprotocol/sdk/types.js";
import { z } from "zod";
import { kibela } from "../lib/kibela.ts";
import { getCommentsSchema } from "../lib/schemas.ts";

const schema = z.object(getCommentsSchema);

const getComments: (
  args: z.infer<typeof schema>,
  extra: RequestHandlerExtra
) => CallToolResult | Promise<CallToolResult> = async ({ noteId, first }) => {
  const data = await kibela.GetComments({
    id: noteId,
    first: first ?? 16,
  });

  if (!data.note) {
    return { content: [{ type: "text", text: "Not Found", isError: true }] };
  }

  return {
    content: [
      {
        type: "text",
        text: JSON.stringify({
          comments: data.note?.comments?.edges?.map((edge) => ({
            id: edge?.node?.id,
            content: edge?.node?.content,
            anchor: edge?.node?.anchor,
            author: {
              account: edge?.node?.author.account,
              realName: edge?.node?.author.realName,
            },
            createdAt: edge?.node?.createdAt,
            updatedAt: edge?.node?.updatedAt,
            replies: edge?.node?.replies?.edges?.map((e) => ({
              id: e?.node?.id,
              content: e?.node?.content,
              anchor: e?.node?.anchor,
              author: {
                account: e?.node?.author.account,
                realName: e?.node?.author.realName,
              },
              createdAt: e?.node?.createdAt,
              updatedAt: e?.node?.updatedAt,
            })),
          })),
          inlineComments: data.note?.inlineComments?.edges?.map((edge) => ({
            id: edge?.node?.id,
            content: edge?.node?.content,
            anchor: edge?.node?.anchor,
            author: {
              account: edge?.node?.author.account,
              realName: edge?.node?.author.realName,
            },
            createdAt: edge?.node?.createdAt,
            updatedAt: edge?.node?.updatedAt,
            replies: edge?.node?.replies?.edges?.map((e) => ({
              id: e?.node?.id,
              content: e?.node?.content,
              anchor: e?.node?.anchor,
              author: {
                account: e?.node?.author.account,
                realName: e?.node?.author.realName,
              },
              createdAt: e?.node?.createdAt,
              updatedAt: e?.node?.updatedAt,
            })),
          })),
        }),
      },
    ],
  };
};

export { getComments };
