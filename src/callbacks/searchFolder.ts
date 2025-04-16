import type { RequestHandlerExtra } from "@modelcontextprotocol/sdk/shared/protocol.js";
import type { CallToolResult } from "@modelcontextprotocol/sdk/types.js";
import { z } from "zod";
import { kibela } from "../lib/kibela.ts";
import { searchFolderSchema } from "../lib/schemas.ts";

const schema = z.object(searchFolderSchema);

const searchFolder: (
  args: z.infer<typeof schema>,
  extra: RequestHandlerExtra
) => CallToolResult | Promise<CallToolResult> = async (params) => {
  const { query } = params;
  const data = await kibela.SearchFolder({ query, first: 16 });

  if (!data.searchFolder.edges) {
    return { content: [{ type: "text", text: "Not Found", isError: true }] };
  }

  return {
    content: [
      {
        type: "text",
        text: JSON.stringify(
          data.searchFolder.edges.map((edge) => ({
            name: edge?.node?.name,
            fixedPath: edge?.node?.fixedPath,
            group: {
              name: edge?.node?.group.name,
              isPrivate: edge?.node?.group.isPrivate,
            },
          }))
        ),
      },
    ],
  };
};

export { searchFolder };
