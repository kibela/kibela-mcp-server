import { describe, it, expect, vi, beforeEach } from "vitest";
import { moveNoteToAnotherFolder } from "../moveNoteToAnotherFolder.ts";
import { kibela } from "../../lib/kibela.ts";
import type { RequestHandlerExtra } from "@modelcontextprotocol/sdk/shared/protocol.js";
import { MoveNoteToAnotherFolderMutation } from "../../generated/graphql.ts";

vi.mock("../../lib/kibela", () => ({
  kibela: {
    MoveNoteToAnotherFolder: vi.fn(),
  },
}));

describe("moveNoteToAnotherFolder callback", () => {
  const mockRequestHandlerExtra = {} as RequestHandlerExtra;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns note id results when query is successful", async () => {
    const mockNotes = {
      moveNoteToAnotherFolder: {
        note: {
          id: "xxx",
          url: "https://example.com",
        },
      },
    };

    vi.mocked(kibela.MoveNoteToAnotherFolder).mockResolvedValue(
      mockNotes as MoveNoteToAnotherFolderMutation
    );

    const result = await moveNoteToAnotherFolder(
      {
        id: "xxx",
        fromFolder: { groupId: "xxx", folderName: "Test Folder 1" },
        toFolder: { groupId: "yyy", folderName: "Test Folder 2" },
      },
      mockRequestHandlerExtra
    );

    expect(kibela.MoveNoteToAnotherFolder).toHaveBeenCalledWith({
      input: {
        noteId: "xxx",
        fromFolder: { groupId: "xxx", folderName: "Test Folder 1" },
        toFolder: { groupId: "yyy", folderName: "Test Folder 2" },
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

  it("returns note id results when query is successful", async () => {
    const mockNotes = {
      moveNoteToAnotherFolder: {},
    };

    vi.mocked(kibela.MoveNoteToAnotherFolder).mockResolvedValue(
      mockNotes as MoveNoteToAnotherFolderMutation
    );

    const result = await moveNoteToAnotherFolder(
      {
        id: "xxx",
        fromFolder: { groupId: "xxx", folderName: "Test Folder 1" },
        toFolder: { groupId: "yyy", folderName: "Test Folder 2" },
      },
      mockRequestHandlerExtra
    );

    expect(kibela.MoveNoteToAnotherFolder).toHaveBeenCalledWith({
      input: {
        noteId: "xxx",
        fromFolder: { groupId: "xxx", folderName: "Test Folder 1" },
        toFolder: { groupId: "yyy", folderName: "Test Folder 2" },
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
