import type { RequestHandlerExtra } from "@modelcontextprotocol/sdk/shared/protocol.js";
import type { CallToolResult } from "@modelcontextprotocol/sdk/types.js";
import { z } from "zod";
import { kibela } from "../lib/kibela.ts";
import { createCommentSchema } from "../lib/schemas.ts";

const schema = z.object(createCommentSchema);

const createComment: (
  args: z.infer<typeof schema>,
  extra: RequestHandlerExtra
) => CallToolResult | Promise<CallToolResult> = async ({ content, noteId }) => {
  const data = await kibela.CreateComment({
    input: { content, commentableId: noteId },
  });

  if (!data.createComment.comment) {
    return { content: [{ type: "text", text: "Failed", isError: true }] };
  }

  return {
    content: [
      {
        type: "text",
        text: JSON.stringify({
          id: data.createComment.comment.id,
        }),
      },
    ],
  };
};

export { createComment };
