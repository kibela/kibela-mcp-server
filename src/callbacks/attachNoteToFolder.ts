import type { RequestHandlerExtra } from "@modelcontextprotocol/sdk/shared/protocol.js";
import type { CallToolResult } from "@modelcontextprotocol/sdk/types.js";
import { z } from "zod";
import { kibela } from "../lib/kibela.ts";
import { attachNoteToFolderSchema } from "../lib/schemas.ts";

const schema = z.object(attachNoteToFolderSchema);

const attachNoteToFolder: (
  args: z.infer<typeof schema>,
  extra: RequestHandlerExtra
) => CallToolResult | Promise<CallToolResult> = async ({ id, folder }) => {
  const data = await kibela.AttachNoteToFolder({
    input: { noteId: id, folder },
  });

  if (!data.attachNoteToFolder.note) {
    return { content: [{ type: "text", text: "Failed", isError: true }] };
  }

  return {
    content: [
      {
        type: "text",
        text: JSON.stringify({
          id: data.attachNoteToFolder.note.id,
        }),
      },
    ],
  };
};

export { attachNoteToFolder };
