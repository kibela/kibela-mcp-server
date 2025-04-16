import type { RequestHandlerExtra } from "@modelcontextprotocol/sdk/shared/protocol.js";
import type { CallToolResult } from "@modelcontextprotocol/sdk/types.js";
import { z } from "zod";
import { kibela } from "../lib/kibela.ts";
import { getFolderFromPathSchema } from "../lib/schemas.ts";

const schema = z.object(getFolderFromPathSchema);

const getFolderFromPath: (
  args: z.infer<typeof schema>,
  extra: RequestHandlerExtra
) => CallToolResult | Promise<CallToolResult> = async ({ path, first }) => {
  const data = await kibela.GetFolderFromPath({ path, first: first || 16 });

  if (!data.folderFromPath) {
    return { content: [{ type: "text", text: "Not Found", isError: true }] };
  }

  return {
    content: [
      {
        type: "text",
        text: JSON.stringify({
          name: data.folderFromPath?.name,
          fullName: data.folderFromPath?.fullName,
          fixedPath: data.folderFromPath?.fixedPath,
          createdAt: data.folderFromPath?.createdAt,
          updatedAt: data.folderFromPath?.updatedAt,
          group: {
            id: data.folderFromPath?.group?.id,
            name: data.folderFromPath?.group?.name,
          },
          folders: data.folderFromPath?.folders.edges?.map((e) => ({
            id: e?.node?.id,
            name: e?.node?.name,
          })),
          notes: data.folderFromPath?.notes.edges?.map((e) => ({
            id: e?.node?.id,
            title: e?.node?.title,
          })),
        }),
      },
    ],
  };
};

export { getFolderFromPath };
