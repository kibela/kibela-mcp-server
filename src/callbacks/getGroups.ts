import type { RequestHandlerExtra } from "@modelcontextprotocol/sdk/shared/protocol.js";
import type { CallToolResult } from "@modelcontextprotocol/sdk/types.js";
import { z } from "zod";
import { kibela } from "../lib/kibela.ts";
import { getGroupsSchema } from "../lib/schemas.ts";

const schema = z.object(getGroupsSchema);

const getGroups: (
  args: z.infer<typeof schema>,
  extra: RequestHandlerExtra
) => CallToolResult | Promise<CallToolResult> = async ({ first }) => {
  const data = await kibela.GetGroups({ first: first || 16 });

  if (!data.groups.edges) {
    return { content: [{ type: "text", text: "Not Found", isError: true }] };
  }

  return {
    content: [
      {
        type: "text",
        text: JSON.stringify(
          data.groups.edges.map((edge) => ({
            id: edge?.node?.id,
            name: edge?.node?.name,
            isDefault: edge?.node?.isDefault,
            isArchived: edge?.node?.isArchived,
          }))
        ),
      },
    ],
  };
};

export { getGroups };
