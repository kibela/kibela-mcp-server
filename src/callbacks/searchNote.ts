import type { RequestHandlerExtra } from "@modelcontextprotocol/sdk/shared/protocol.js";
import type { CallToolResult } from "@modelcontextprotocol/sdk/types.js";
import { z } from "zod";
import { kibela } from "../lib/kibela.ts";
import { searchNoteSchema } from "../lib/schemas.ts";

const schema = z.object(searchNoteSchema);

const searchNote: (
  args: z.infer<typeof schema>,
  extra: RequestHandlerExtra
) => CallToolResult | Promise<CallToolResult> = async ({
  query,
  resources,
  updated,
  groupIds,
  folderIds,
  likerIds,
  isArchived,
  sortBy,
}) => {
  const data = await kibela.SearchNote({
    query,
    resources,
    updated,
    groupIds,
    folderIds,
    likerIds,
    isArchived,
    sortBy,
    first: 16,
  });

  if (!data.search.edges) {
    return { content: [{ type: "text", text: "Not Found", isError: true }] };
  }

  return {
    content: [
      {
        type: "text",
        text: JSON.stringify(
          data.search.edges.map((edge) => ({
            id: edge?.node?.document.id,
            title: edge?.node?.title,
            url: edge?.node?.url,
            contentSummaryHtml: edge?.node?.contentSummaryHtml,
            path: edge?.node?.path,
            author: {
              account: edge?.node?.author.account,
              realName: edge?.node?.author.realName,
            },
          }))
        ),
      },
    ],
  };
};

export { searchNote };
