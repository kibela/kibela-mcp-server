import { describe, it, expect, vi, beforeEach } from "vitest";
import { getFolders } from "../getFolders.ts";
import { kibela } from "../../lib/kibela.ts";
import type { RequestHandlerExtra } from "@modelcontextprotocol/sdk/shared/protocol.js";
import { GetFoldersQuery } from "../../generated/graphql.ts";

vi.mock("../../lib/kibela", () => ({
  kibela: {
    GetFolders: vi.fn(),
  },
}));

describe("folders callback", () => {
  const mockRequestHandlerExtra = {} as RequestHandlerExtra;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns folders results when query is successful", async () => {
    const mockFolders = {
      folders: {
        edges: [
          {
            node: {
              id: "xxx",
              name: "Test Folder 1",
            },
          },
          {
            node: {
              id: "xxx",
              name: "Test Folder 2",
            },
          },
        ],
      },
    };

    vi.mocked(kibela.GetFolders).mockResolvedValue(
      mockFolders as GetFoldersQuery
    );

    const result = await getFolders({}, mockRequestHandlerExtra);

    expect(kibela.GetFolders).toHaveBeenCalledWith({
      first: 16,
    });

    expect(result).toEqual({
      content: [
        {
          type: "text",
          text: JSON.stringify([
            {
              id: "xxx",
              name: "Test Folder 1",
            },
            {
              id: "xxx",
              name: "Test Folder 2",
            },
          ]),
        },
      ],
    });
  });

  it('returns "Not Found" error when no folders', async () => {
    const mockEmptyResults = {
      folders: {
        edges: null,
      },
    };

    vi.mocked(kibela.GetFolders).mockResolvedValue(mockEmptyResults);

    const result = await getFolders({}, mockRequestHandlerExtra);

    expect(kibela.GetFolders).toHaveBeenCalledWith({
      first: 16,
    });

    expect(result).toEqual({
      content: [{ type: "text", text: "Not Found", isError: true }],
    });
  });

  it('returns "Not Found" error when folders edges are empty', async () => {
    const mockEmptyEdges = {
      folders: {
        edges: [],
      },
    };

    vi.mocked(kibela.GetFolders).mockResolvedValue(mockEmptyEdges);

    const result = await getFolders({}, mockRequestHandlerExtra);

    expect(kibela.GetFolders).toHaveBeenCalledWith({
      first: 16,
    });

    expect(result).toEqual({
      content: [{ type: "text", text: "[]" }],
    });
  });
});
