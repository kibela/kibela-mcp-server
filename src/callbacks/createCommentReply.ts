import type { RequestHandlerExtra } from "@modelcontextprotocol/sdk/shared/protocol.js";
import type { CallToolResult } from "@modelcontextprotocol/sdk/types.js";
import { z } from "zod";
import { kibela } from "../lib/kibela.ts";
import { createCommentReplySchema } from "../lib/schemas.ts";

const schema = z.object(createCommentReplySchema);

const createCommentReply: (
  args: z.infer<typeof schema>,
  extra: RequestHandlerExtra
) => CallToolResult | Promise<CallToolResult> = async ({
  content,
  commentId,
}) => {
  const data = await kibela.CreateCommentReply({
    input: { content, commentId },
  });

  if (!data.createCommentReply.reply) {
    return { content: [{ type: "text", text: "Failed", isError: true }] };
  }

  return {
    content: [
      {
        type: "text",
        text: JSON.stringify({
          id: data.createCommentReply.reply.id,
        }),
      },
    ],
  };
};

export { createCommentReply };
