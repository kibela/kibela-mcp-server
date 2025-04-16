import { describe, it, expect, vi, beforeEach } from "vitest";
import { getNotes } from "../getNotes.ts";
import { kibela } from "../../lib/kibela.ts";
import type { RequestHandlerExtra } from "@modelcontextprotocol/sdk/shared/protocol.js";
import { GetNotesQuery } from "../../generated/graphql.ts";

vi.mock("../../lib/kibela", () => ({
  kibela: {
    GetNotes: vi.fn(),
  },
}));

describe("notes callback", () => {
  const mockRequestHandlerExtra = {} as RequestHandlerExtra;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns notes results when query is successful", async () => {
    const mockNotes = {
      notes: {
        edges: [
          {
            node: {
              id: "xxx",
              title: "Test Note 1",
              url: "http://example.com",
            },
          },
          {
            node: {
              id: "xxx",
              title: "Test Note 2",
              url: "http://example.com",
            },
          },
        ],
      },
    };

    vi.mocked(kibela.GetNotes).mockResolvedValue(mockNotes as GetNotesQuery);

    const result = await getNotes({ folderId: "xxx" }, mockRequestHandlerExtra);

    expect(kibela.GetNotes).toHaveBeenCalledWith({
      first: 16,
      folderId: "xxx",
      last: undefined,
    });

    expect(result).toEqual({
      content: [
        {
          type: "text",
          text: JSON.stringify([
            {
              id: "xxx",
              title: "Test Note 1",
            },
            {
              id: "xxx",
              title: "Test Note 2",
            },
          ]),
        },
      ],
    });
  });

  it('returns "Not Found" error when no notes', async () => {
    const mockEmptyResults = {
      notes: {
        edges: null,
      },
    };

    vi.mocked(kibela.GetNotes).mockResolvedValue(mockEmptyResults);

    const result = await getNotes({ folderId: "xxx" }, mockRequestHandlerExtra);

    expect(kibela.GetNotes).toHaveBeenCalledWith({
      first: 16,
      folderId: "xxx",
      last: undefined,
    });

    expect(result).toEqual({
      content: [{ type: "text", text: "Not Found", isError: true }],
    });
  });

  it('returns "Not Found" error when notes edges are empty', async () => {
    const mockEmptyEdges = {
      notes: {
        edges: [],
      },
    };

    vi.mocked(kibela.GetNotes).mockResolvedValue(mockEmptyEdges);

    const result = await getNotes({ folderId: "xxx" }, mockRequestHandlerExtra);

    expect(kibela.GetNotes).toHaveBeenCalledWith({
      first: 16,
      folderId: "xxx",
      last: undefined,
    });

    expect(result).toEqual({
      content: [{ type: "text", text: "[]" }],
    });
  });
});
