import type { RequestHandlerExtra } from "@modelcontextprotocol/sdk/shared/protocol.js";
import type { CallToolResult } from "@modelcontextprotocol/sdk/types.js";
import { z } from "zod";
import { kibela } from "../lib/kibela.ts";
import { updateNoteContentSchema } from "../lib/schemas.ts";

const schema = z.object(updateNoteContentSchema);

const updateNoteContent: (
  args: z.infer<typeof schema>,
  extra: RequestHandlerExtra
) => CallToolResult | Promise<CallToolResult> = async ({
  id,
  newContent,
  baseContent,
}) => {
  const data = await kibela.UpdateNoteContent({
    input: { id, newContent, baseContent, touch: true },
  });

  if (!data.updateNoteContent.note) {
    return { content: [{ type: "text", text: "Failed", isError: true }] };
  }

  return {
    content: [
      {
        type: "text",
        text: JSON.stringify({
          id: data.updateNoteContent.note.id,
        }),
      },
    ],
  };
};

export { updateNoteContent };
