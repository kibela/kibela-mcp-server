import type { RequestHandlerExtra } from "@modelcontextprotocol/sdk/shared/protocol.js";
import type { CallToolResult } from "@modelcontextprotocol/sdk/types.js";
import { z } from "zod";
import { kibela } from "../lib/kibela.ts";
import { getNoteSchema } from "../lib/schemas.ts";

const schema = z.object(getNoteSchema);

const getNote: (
  args: z.infer<typeof schema>,
  extra: RequestHandlerExtra
) => CallToolResult | Promise<CallToolResult> = async ({ id }) => {
  const data = await kibela.GetNote({
    id,
    first: 16,
  });

  if (!data.note) {
    return { content: [{ type: "text", text: "Not Found", isError: true }] };
  }

  return {
    content: [
      {
        type: "text",
        text: JSON.stringify({
          title: data.note?.title,
          content: data.note?.content,
          url: data.note?.url,
          author: {
            account: data.note?.author?.account,
            realName: data.note?.author?.realName,
          },
          folders: data.note?.folders?.edges?.map((edge) => ({
            id: edge?.node?.id,
            name: edge?.node?.name,
            fullName: edge?.node?.fullName,
            fixedPath: edge?.node?.fixedPath,
            group: {
              id: edge?.node?.group?.id,
              name: edge?.node?.group?.name,
            },
          })),
          comments: data.note?.comments?.edges?.map((edge) => ({
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
          inlineComments: data.note?.inlineComments?.edges?.map((edge) => ({
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
        }),
      },
    ],
  };
};

export { getNote };
