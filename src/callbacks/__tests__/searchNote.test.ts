import { describe, it, expect, vi, beforeEach } from "vitest";
import { searchNote } from "../searchNote.ts";
import { kibela } from "../../lib/kibela.ts";
import type { RequestHandlerExtra } from "@modelcontextprotocol/sdk/shared/protocol.js";

vi.mock("../../lib/kibela", () => ({
  kibela: {
    SearchNote: vi.fn(),
  },
}));

describe("search callback", () => {
  const mockRequestHandlerExtra = {} as RequestHandlerExtra;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns search results when query is successful", async () => {
    const mockSearchResults = {
      search: {
        edges: [
          {
            node: {
              document: {
                id: "xxx",
              },
              title: "Test Note 1",
              url: "https://example.kibe.la/notes/1",
              contentSummaryHtml: "Test",
              path: "test",
              author: {
                account: "test",
                realName: "Test",
              },
            },
          },
          {
            node: {
              document: {
                id: "xxx",
              },
              title: "Test Note 2",
              url: "https://example.kibe.la/notes/2",
              contentSummaryHtml: "Test",
              path: "test",
              author: {
                account: "test",
                realName: "Test",
              },
            },
          },
        ],
      },
    };

    vi.mocked(kibela.SearchNote).mockResolvedValue(mockSearchResults);

    const result = await searchNote({ query: "test" }, mockRequestHandlerExtra);

    expect(kibela.SearchNote).toHaveBeenCalledWith({
      query: "test",
      first: 16,
    });

    expect(result).toEqual({
      content: [
        {
          type: "text",
          text: JSON.stringify([
            {
              id: "xxx",
              title: "Test Note 1",
              url: "https://example.kibe.la/notes/1",
              contentSummaryHtml: "Test",
              path: "test",
              author: {
                account: "test",
                realName: "Test",
              },
            },
            {
              id: "xxx",
              title: "Test Note 2",
              url: "https://example.kibe.la/notes/2",
              contentSummaryHtml: "Test",
              path: "test",
              author: {
                account: "test",
                realName: "Test",
              },
            },
          ]),
        },
      ],
    });
  });

  it('returns "Not Found" error when search has no results', async () => {
    const mockEmptyResults = {
      search: {
        edges: null,
      },
    };

    vi.mocked(kibela.SearchNote).mockResolvedValue(mockEmptyResults);

    const result = await searchNote(
      { query: "nonexistent" },
      mockRequestHandlerExtra
    );

    expect(kibela.SearchNote).toHaveBeenCalledWith({
      query: "nonexistent",
      first: 16,
    });

    expect(result).toEqual({
      content: [{ type: "text", text: "Not Found", isError: true }],
    });
  });

  it('returns "Not Found" error when search edges are empty', async () => {
    const mockEmptyEdges = {
      search: {
        edges: [],
      },
    };

    vi.mocked(kibela.SearchNote).mockResolvedValue(mockEmptyEdges);

    const result = await searchNote(
      { query: "nonexistent" },
      mockRequestHandlerExtra
    );

    expect(kibela.SearchNote).toHaveBeenCalledWith({
      query: "nonexistent",
      first: 16,
    });

    expect(result).toEqual({
      content: [{ type: "text", text: "[]" }],
    });
  });
});
