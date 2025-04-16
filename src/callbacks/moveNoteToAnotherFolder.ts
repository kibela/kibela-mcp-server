import type { RequestHandlerExtra } from "@modelcontextprotocol/sdk/shared/protocol.js";
import type { CallToolResult } from "@modelcontextprotocol/sdk/types.js";
import { z } from "zod";
import { kibela } from "../lib/kibela.ts";
import { moveNoteToAnotherFolderSchema } from "../lib/schemas.ts";

const schema = z.object(moveNoteToAnotherFolderSchema);

const moveNoteToAnotherFolder: (
  args: z.infer<typeof schema>,
  extra: RequestHandlerExtra
) => CallToolResult | Promise<CallToolResult> = async ({
  id,
  fromFolder,
  toFolder,
}) => {
  const data = await kibela.MoveNoteToAnotherFolder({
    input: { noteId: id, fromFolder, toFolder },
  });

  if (!data.moveNoteToAnotherFolder.note) {
    return { content: [{ type: "text", text: "Failed", isError: true }] };
  }

  return {
    content: [
      {
        type: "text",
        text: JSON.stringify({
          id: data.moveNoteToAnotherFolder.note.id,
        }),
      },
    ],
  };
};

export { moveNoteToAnotherFolder };
