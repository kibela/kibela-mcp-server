import { describe, it, expect, vi, beforeEach } from "vitest";
import { moveNoteToAnotherFolder } from "../moveNoteToAnotherFolder.ts";
import { kibela } from "../../lib/kibela.ts";
import type { RequestHandlerExtra } from "@modelcontextprotocol/sdk/shared/protocol.js";
import { AttachNoteToFolderMutation } from "../../generated/graphql.ts";
import { attachNoteToFolder } from "../attachNoteToFolder.ts";

vi.mock("../../lib/kibela", () => ({
  kibela: {
    AttachNoteToFolder: vi.fn(),
  },
}));

describe("moveNoteToAnotherFolder callback", () => {
  const mockRequestHandlerExtra = {} as RequestHandlerExtra;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns note id results when query is successful", async () => {
    const mockNotes = {
      attachNoteToFolder: {
        note: {
          id: "xxx",
        },
      },
    };

    vi.mocked(kibela.AttachNoteToFolder).mockResolvedValue(
      mockNotes as AttachNoteToFolderMutation
    );

    const result = await attachNoteToFolder(
      {
        id: "xxx",
        folder: { groupId: "xxx", folderName: "Test Folder 1" },
      },
      mockRequestHandlerExtra
    );

    expect(kibela.AttachNoteToFolder).toHaveBeenCalledWith({
      input: {
        noteId: "xxx",
        folder: { groupId: "xxx", folderName: "Test Folder 1" },
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

  it("returns error when note is empty", async () => {
    const mockNotes = {
      attachNoteToFolder: {},
    };

    vi.mocked(kibela.AttachNoteToFolder).mockResolvedValue(
      mockNotes as AttachNoteToFolderMutation
    );

    const result = await attachNoteToFolder(
      {
        id: "xxx",
        folder: { groupId: "xxx", folderName: "Test Folder 1" },
      },
      mockRequestHandlerExtra
    );

    expect(kibela.AttachNoteToFolder).toHaveBeenCalledWith({
      input: {
        noteId: "xxx",
        folder: { groupId: "xxx", folderName: "Test Folder 1" },
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
