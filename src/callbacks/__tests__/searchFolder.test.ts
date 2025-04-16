import { describe, it, expect, vi, beforeEach } from "vitest";
import { kibela } from "../../lib/kibela.ts";
import type { RequestHandlerExtra } from "@modelcontextprotocol/sdk/shared/protocol.js";
import { searchFolder } from "../searchFolder.ts";

vi.mock("../../lib/kibela", () => ({
  kibela: {
    SearchFolder: vi.fn(),
  },
}));

describe("search callback", () => {
  const mockRequestHandlerExtra = {} as RequestHandlerExtra;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns search results when query is successful", async () => {
    const mockSearchResults = {
      searchFolder: {
        edges: [
          {
            node: {
              name: "Test Folder 1",
              fixedPath: "test",
              group: {
                name: "Test Group 1",
                isPrivate: false,
              },
            },
          },
          {
            node: {
              name: "Test Folder 2",
              fixedPath: "test",
              group: {
                name: "Test Group 1",
                isPrivate: false,
              },
            },
          },
        ],
      },
    };

    vi.mocked(kibela.SearchFolder).mockResolvedValue(mockSearchResults);

    const result = await searchFolder(
      { query: "test" },
      mockRequestHandlerExtra
    );

    expect(kibela.SearchFolder).toHaveBeenCalledWith({
      query: "test",
      first: 16,
    });

    expect(result).toEqual({
      content: [
        {
          type: "text",
          text: JSON.stringify([
            {
              name: "Test Folder 1",
              fixedPath: "test",
              group: {
                name: "Test Group 1",
                isPrivate: false,
              },
            },
            {
              name: "Test Folder 2",
              fixedPath: "test",
              group: {
                name: "Test Group 1",
                isPrivate: false,
              },
            },
          ]),
        },
      ],
    });
  });

  it('returns "Not Found" error when search has no results', async () => {
    const mockEmptyResults = {
      searchFolder: {
        edges: null,
      },
    };

    vi.mocked(kibela.SearchFolder).mockResolvedValue(mockEmptyResults);

    const result = await searchFolder(
      { query: "nonexistent" },
      mockRequestHandlerExtra
    );

    expect(kibela.SearchFolder).toHaveBeenCalledWith({
      query: "nonexistent",
      first: 16,
    });

    expect(result).toEqual({
      content: [{ type: "text", text: "Not Found", isError: true }],
    });
  });

  it('returns "Not Found" error when search edges are empty', async () => {
    const mockEmptyEdges = {
      searchFolder: {
        edges: [],
      },
    };

    vi.mocked(kibela.SearchFolder).mockResolvedValue(mockEmptyEdges);

    const result = await searchFolder(
      { query: "nonexistent" },
      mockRequestHandlerExtra
    );

    expect(kibela.SearchFolder).toHaveBeenCalledWith({
      query: "nonexistent",
      first: 16,
    });

    expect(result).toEqual({
      content: [{ type: "text", text: "[]" }],
    });
  });
});
