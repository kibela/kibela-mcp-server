import type { RequestHandlerExtra } from "@modelcontextprotocol/sdk/shared/protocol.js";
import type { CallToolResult } from "@modelcontextprotocol/sdk/types.js";
import { z } from "zod";
import { kibela } from "../lib/kibela.ts";
import { getFoldersSchema } from "../lib/schemas.ts";

const schema = z.object(getFoldersSchema);

const getFolders: (
  args: z.infer<typeof schema>,
  extra: RequestHandlerExtra
) => CallToolResult | Promise<CallToolResult> = async ({ first }) => {
  const data = await kibela.GetFolders({ first: first || 16 });

  if (!data.folders.edges) {
    return { content: [{ type: "text", text: "Not Found", isError: true }] };
  }

  return {
    content: [
      {
        type: "text",
        text: JSON.stringify(
          data.folders.edges.map((edge) => ({
            id: edge?.node?.id,
            name: edge?.node?.name,
          }))
        ),
      },
    ],
  };
};

export { getFolders };
