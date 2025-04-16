import type { RequestHandlerExtra } from "@modelcontextprotocol/sdk/shared/protocol.js";
import type { CallToolResult } from "@modelcontextprotocol/sdk/types.js";
import { z } from "zod";
import { kibela } from "../lib/kibela.ts";
import { getNotesSchema } from "../lib/schemas.ts";

const schema = z.object(getNotesSchema);

const getNotes: (
  args: z.infer<typeof schema>,
  extra: RequestHandlerExtra
) => CallToolResult | Promise<CallToolResult> = async ({
  folderId,
  first,
  last,
}) => {
  const data = await kibela.GetNotes({ folderId, first: first || 16, last });

  if (!data.notes.edges) {
    return { content: [{ type: "text", text: "Not Found", isError: true }] };
  }

  return {
    content: [
      {
        type: "text",
        text: JSON.stringify(
          data.notes.edges.map((edge) => ({
            id: edge?.node?.id,
            title: edge?.node?.title,
          }))
        ),
      },
    ],
  };
};

export { getNotes };
