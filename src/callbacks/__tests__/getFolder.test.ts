import { describe, it, expect, vi, beforeEach } from "vitest";
import { getFolder } from "../getFolder.ts";
import { kibela } from "../../lib/kibela.ts";
import type { RequestHandlerExtra } from "@modelcontextprotocol/sdk/shared/protocol.js";
import { GetFolderQuery } from "../../generated/graphql.ts";

vi.mock("../../lib/kibela", () => ({
  kibela: {
    GetFolder: vi.fn(),
  },
}));

describe("notes callback", () => {
  const mockRequestHandlerExtra = {} as RequestHandlerExtra;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns folder results when query is successful", async () => {
    const mockNotes = {
      folder: {
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

    vi.mocked(kibela.GetFolder).mockResolvedValue(mockNotes as GetFolderQuery);

    const result = await getFolder({ id: "xxx" }, mockRequestHandlerExtra);

    expect(kibela.GetFolder).toHaveBeenCalledWith({
      id: "xxx",
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

  it("returns error results when failed", async () => {
    const mockNotes = {};

    vi.mocked(kibela.GetFolder).mockResolvedValue(mockNotes as GetFolderQuery);

    const result = await getFolder({ id: "xxx" }, mockRequestHandlerExtra);

    expect(kibela.GetFolder).toHaveBeenCalledWith({
      id: "xxx",
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
