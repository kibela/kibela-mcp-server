import type { RequestHandlerExtra } from "@modelcontextprotocol/sdk/shared/protocol.js";
import type { CallToolResult } from "@modelcontextprotocol/sdk/types.js";
import { z } from "zod";
import { kibela } from "../lib/kibela.ts";
import { getFolderSchema } from "../lib/schemas.ts";

const schema = z.object(getFolderSchema);

const getFolder: (
  args: z.infer<typeof schema>,
  extra: RequestHandlerExtra
) => CallToolResult | Promise<CallToolResult> = async ({ id, first }) => {
  const data = await kibela.GetFolder({ id, first: first || 16 });

  if (!data.folder) {
    return { content: [{ type: "text", text: "Not Found", isError: true }] };
  }

  return {
    content: [
      {
        type: "text",
        text: JSON.stringify({
          name: data.folder?.name,
          fullName: data.folder?.fullName,
          fixedPath: data.folder?.fixedPath,
          createdAt: data.folder?.createdAt,
          updatedAt: data.folder?.updatedAt,
          group: {
            id: data.folder?.group?.id,
            name: data.folder?.group?.name,
          },
          folders: data.folder?.folders.edges?.map((e) => ({
            id: e?.node?.id,
            name: e?.node?.name,
          })),
          notes: data.folder?.notes.edges?.map((e) => ({
            id: e?.node?.id,
            title: e?.node?.title,
          })),
        }),
      },
    ],
  };
};

export { getFolder };
