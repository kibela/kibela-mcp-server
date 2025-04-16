import { describe, it, expect, vi, beforeEach } from "vitest";
import { createNote } from "../createNote.ts";
import { kibela } from "../../lib/kibela.ts";
import type { RequestHandlerExtra } from "@modelcontextprotocol/sdk/shared/protocol.js";
import { CreateNoteMutation } from "../../generated/graphql.ts";

vi.mock("../../lib/kibela", () => ({
  kibela: {
    CreateNote: vi.fn(),
  },
}));

describe("createNote callback", () => {
  const mockRequestHandlerExtra = {} as RequestHandlerExtra;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns notes results when query is successful", async () => {
    const mockNotes = {
      createNote: {
        note: {
          id: "xxx",
          url: "https://example.com",
        },
      },
    };

    vi.mocked(kibela.CreateNote).mockResolvedValue(
      mockNotes as CreateNoteMutation
    );

    const result = await createNote(
      {
        title: "Test Title",
        content: "Test",
        draft: false,
        groupIds: ["xxx"],
        folders: [{ groupId: "xxx", folderName: "Test Folder" }],
      },
      mockRequestHandlerExtra
    );

    expect(kibela.CreateNote).toHaveBeenCalledWith({
      input: {
        title: "Test Title",
        content: "Test",
        draft: false,
        coediting: true,
        groupIds: ["xxx"],
        folders: [{ groupId: "xxx", folderName: "Test Folder" }],
      },
    });

    expect(result).toEqual({
      content: [
        {
          type: "text",
          text: JSON.stringify({
            id: "xxx",
            url: "https://example.com",
          }),
        },
      ],
    });
  });

  it("returns error results when result is empty", async () => {
    const mockNotes = {
      createNote: {},
    };

    vi.mocked(kibela.CreateNote).mockResolvedValue(
      mockNotes as CreateNoteMutation
    );

    const result = await createNote(
      {
        title: "Test Title",
        content: "Test",
        draft: false,
        groupIds: ["xxx"],
        folders: [{ groupId: "xxx", folderName: "Test Folder" }],
      },
      mockRequestHandlerExtra
    );

    expect(kibela.CreateNote).toHaveBeenCalledWith({
      input: {
        title: "Test Title",
        content: "Test",
        draft: false,
        coediting: true,
        groupIds: ["xxx"],
        folders: [{ groupId: "xxx", folderName: "Test Folder" }],
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
