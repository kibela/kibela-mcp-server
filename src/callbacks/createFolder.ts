import type { RequestHandlerExtra } from "@modelcontextprotocol/sdk/shared/protocol.js";
import type { CallToolResult } from "@modelcontextprotocol/sdk/types.js";
import { z } from "zod";
import { kibela } from "../lib/kibela.ts";
import { createFolderSchema } from "../lib/schemas.ts";

const schema = z.object(createFolderSchema);

const createFolder: (
  args: z.infer<typeof schema>,
  extra: RequestHandlerExtra
) => CallToolResult | Promise<CallToolResult> = async ({
  groupId,
  fullName,
}) => {
  const data = await kibela.CreateFolder({
    input: { folder: { groupId, folderName: fullName } },
  });

  if (!data.createFolder.folder) {
    return { content: [{ type: "text", text: "Failed", isError: true }] };
  }

  return {
    content: [
      {
        type: "text",
        text: JSON.stringify({
          id: data.createFolder.folder.id,
        }),
      },
    ],
  };
};

export { createFolder };
