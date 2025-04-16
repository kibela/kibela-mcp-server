import { describe, it, expect, vi, beforeEach } from "vitest";
import { getFolderFromPath } from "../getFolderFromPath.ts";
import { kibela } from "../../lib/kibela.ts";
import type { RequestHandlerExtra } from "@modelcontextprotocol/sdk/shared/protocol.js";
import { GetFolderFromPathQuery } from "../../generated/graphql.ts";

vi.mock("../../lib/kibela", () => ({
  kibela: {
    GetFolderFromPath: vi.fn(),
  },
}));

describe("folder from path callback", () => {
  const mockRequestHandlerExtra = {} as RequestHandlerExtra;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns folder results when query is successful", async () => {
    const mockNotes = {
      folderFromPath: {
        name: "Test Folder 1",
        fullName: "Test Folder 1",
        fixedPath: "test",
        createdAt: null,
        updatedAt: null,
        group: {
          id: "xxx",
          name: "Test Group",
        },
        folders: {
          edges: [
            {
              node: {
                id: "xxx",
                name: "Test Folder 2",
              },
            },
          ],
        },
        notes: {
          edges: [
            {
              node: {
                id: "xxx",
                title: "Test Note 1",
              },
            },
          ],
        },
      },
    };

    vi.mocked(kibela.GetFolderFromPath).mockResolvedValue(
      mockNotes as GetFolderFromPathQuery
    );

    const result = await getFolderFromPath(
      { path: "path/to/folder" },
      mockRequestHandlerExtra
    );

    expect(kibela.GetFolderFromPath).toHaveBeenCalledWith({
      path: "path/to/folder",
      first: 16,
    });

    expect(result).toEqual({
      content: [
        {
          type: "text",
          text: JSON.stringify({
            name: "Test Folder 1",
            fullName: "Test Folder 1",
            fixedPath: "test",
            createdAt: null,
            updatedAt: null,
            group: {
              id: "xxx",
              name: "Test Group",
            },
            folders: [
              {
                id: "xxx",
                name: "Test Folder 2",
              },
            ],
            notes: [
              {
                id: "xxx",
                title: "Test Note 1",
              },
            ],
          }),
        },
      ],
    });
  });

  it("returns folder results when query is successful", async () => {
    const mockNotes = {};

    vi.mocked(kibela.GetFolderFromPath).mockResolvedValue(
      mockNotes as GetFolderFromPathQuery
    );

    const result = await getFolderFromPath(
      { path: "path/to/folder" },
      mockRequestHandlerExtra
    );

    expect(kibela.GetFolderFromPath).toHaveBeenCalledWith({
      path: "path/to/folder",
      first: 16,
    });

    expect(result).toEqual({
      content: [
        {
          type: "text",
          text: "Not Found",
          isError: true,
        },
      ],
    });
  });
});
