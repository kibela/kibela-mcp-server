import type { RequestHandlerExtra } from "@modelcontextprotocol/sdk/shared/protocol.js";
import type { CallToolResult } from "@modelcontextprotocol/sdk/types.js";
import { z } from "zod";
import { kibela } from "../lib/kibela.ts";
import { getFeedSectionsSchema } from "../lib/schemas.ts";

const schema = z.object(getFeedSectionsSchema);

const getFeedSections: (
  args: z.infer<typeof schema>,
  extra: RequestHandlerExtra
) => CallToolResult | Promise<CallToolResult> = async ({ kind, groupId }) => {
  const data = await kibela.GetFeedSections({
    kind,
    groupId,
    first: 16,
  });

  if (!data.feedSections.edges) {
    return { content: [{ type: "text", text: "Not Found", isError: true }] };
  }

  return {
    content: [
      {
        type: "text",
        text: JSON.stringify(data.feedSections.edges),
      },
    ],
  };
};

export { getFeedSections };
