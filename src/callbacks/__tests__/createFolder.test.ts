import { describe, it, expect, vi, beforeEach } from "vitest";
import { createFolder } from "../createFolder.ts";
import { kibela } from "../../lib/kibela.ts";
import type { RequestHandlerExtra } from "@modelcontextprotocol/sdk/shared/protocol.js";
import { CreateFolderMutation } from "../../generated/graphql.ts";

vi.mock("../../lib/kibela", () => ({
  kibela: {
    CreateFolder: vi.fn(),
  },
}));

describe("createFolder callback", () => {
  const mockRequestHandlerExtra = {} as RequestHandlerExtra;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns folder id results when query is successful", async () => {
    const mockFolders = {
      createFolder: {
        folder: {
          id: "xxx",
        },
      },
    };

    vi.mocked(kibela.CreateFolder).mockResolvedValue(
      mockFolders as CreateFolderMutation
    );

    const result = await createFolder(
      {
        groupId: "xxx",
        fullName: "Test Title",
      },
      mockRequestHandlerExtra
    );

    expect(kibela.CreateFolder).toHaveBeenCalledWith({
      input: {
        folder: {
          groupId: "xxx",
          folderName: "Test Title",
        },
      },
    });

    expect(result).toEqual({
      content: [
        {
          type: "text",
          text: JSON.stringify({
            id: "xxx",
          }),
        },
      ],
    });
  });

  it("returns error id failed", async () => {
    const mockFolders = {
      createFolder: {},
    };

    vi.mocked(kibela.CreateFolder).mockResolvedValue(
      mockFolders as CreateFolderMutation
    );

    const result = await createFolder(
      {
        groupId: "xxx",
        fullName: "Test Title",
      },
      mockRequestHandlerExtra
    );

    expect(kibela.CreateFolder).toHaveBeenCalledWith({
      input: {
        folder: {
          groupId: "xxx",
          folderName: "Test Title",
        },
      },
    });

    expect(result).toEqual({
      content: [
        {
          type: "text",
          text: "Failed",
          isError: true,
        },
      ],
    });
  });
});
