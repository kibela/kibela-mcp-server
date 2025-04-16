import type { RequestHandlerExtra } from "@modelcontextprotocol/sdk/shared/protocol.js";
import type { CallToolResult } from "@modelcontextprotocol/sdk/types.js";
import { z } from "zod";
import { kibela } from "../lib/kibela.ts";
import { createNoteSchema } from "../lib/schemas.ts";

const schema = z.object(createNoteSchema);

const createNote: (
  args: z.infer<typeof schema>,
  extra: RequestHandlerExtra
) => CallToolResult | Promise<CallToolResult> = async ({
  title,
  content,
  draft,
  groupIds,
  folders,
}) => {
  const data = await kibela.CreateNote({
    input: { title, content, draft, coediting: true, groupIds, folders },
  });

  if (!data.createNote.note) {
    return { content: [{ type: "text", text: "Failed", isError: true }] };
  }

  return {
    content: [
      {
        type: "text",
        text: JSON.stringify({
          id: data.createNote.note.id,
          url: data.createNote.note.url,
        }),
      },
    ],
  };
};

export { createNote };
