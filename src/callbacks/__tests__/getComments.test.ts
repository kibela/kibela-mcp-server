import { describe, it, expect, vi, beforeEach } from "vitest";
import { getComments } from "../getComments.ts";
import { kibela } from "../../lib/kibela.ts";
import type { RequestHandlerExtra } from "@modelcontextprotocol/sdk/shared/protocol.js";
import type { GetCommentsQuery } from "../../generated/graphql.ts";

vi.mock("../../lib/kibela", () => ({
  kibela: {
    GetComments: vi.fn(),
  },
}));

describe("getComments callback", () => {
  const mockRequestHandlerExtra = {} as RequestHandlerExtra;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns comments and inline comments when query is successful", async () => {
    const mockData = {
      note: {
        comments: {
          edges: [
            {
              node: {
                id: "comment-1",
                anchor: null,
                content: "This is a comment",
                author: {
                  account: "user1",
                  realName: "User One",
                },
                createdAt: "2025-01-01T00:00:00Z",
                updatedAt: "2025-01-01T00:00:00Z",
                replies: {
                  edges: [
                    {
                      node: {
                        id: "reply-1",
                        anchor: null,
                        content: "This is a reply",
                        author: {
                          account: "user2",
                          realName: "User Two",
                        },
                        createdAt: "2025-01-02T00:00:00Z",
                        updatedAt: "2025-01-02T00:00:00Z",
                      },
                    },
                  ],
                },
              },
            },
          ],
        },
        inlineComments: {
          edges: [
            {
              node: {
                id: "inline-1",
                anchor: "some-anchor",
                content: "Inline comment",
                author: {
                  account: "user3",
                  realName: "User Three",
                },
                createdAt: "2025-01-03T00:00:00Z",
                updatedAt: "2025-01-03T00:00:00Z",
                replies: {
                  edges: [],
                },
              },
            },
          ],
        },
      },
    };

    vi.mocked(kibela.GetComments).mockResolvedValue(
      mockData as GetCommentsQuery
    );

    const result = await getComments(
      { noteId: "note-1" },
      mockRequestHandlerExtra
    );

    expect(kibela.GetComments).toHaveBeenCalledWith({
      id: "note-1",
      first: 16,
    });

    const parsed = JSON.parse(
      (result.content[0] as { type: "text"; text: string }).text
    );

    expect(parsed.comments).toHaveLength(1);
    expect(parsed.comments[0]).toEqual({
      id: "comment-1",
      content: "This is a comment",
      anchor: null,
      author: { account: "user1", realName: "User One" },
      createdAt: "2025-01-01T00:00:00Z",
      updatedAt: "2025-01-01T00:00:00Z",
      replies: [
        {
          id: "reply-1",
          content: "This is a reply",
          anchor: null,
          author: { account: "user2", realName: "User Two" },
          createdAt: "2025-01-02T00:00:00Z",
          updatedAt: "2025-01-02T00:00:00Z",
        },
      ],
    });

    expect(parsed.inlineComments).toHaveLength(1);
    expect(parsed.inlineComments[0]).toEqual({
      id: "inline-1",
      content: "Inline comment",
      anchor: "some-anchor",
      author: { account: "user3", realName: "User Three" },
      createdAt: "2025-01-03T00:00:00Z",
      updatedAt: "2025-01-03T00:00:00Z",
      replies: [],
    });
  });

  it("returns error when note is not found", async () => {
    vi.mocked(kibela.GetComments).mockResolvedValue({
      note: null,
    } as unknown as GetCommentsQuery);

    const result = await getComments(
      { noteId: "nonexistent" },
      mockRequestHandlerExtra
    );

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

  it("uses custom first parameter when provided", async () => {
    const mockData = {
      note: {
        comments: { edges: [] },
        inlineComments: { edges: [] },
      },
    };

    vi.mocked(kibela.GetComments).mockResolvedValue(
      mockData as GetCommentsQuery
    );

    await getComments(
      { noteId: "note-1", first: 50 },
      mockRequestHandlerExtra
    );

    expect(kibela.GetComments).toHaveBeenCalledWith({
      id: "note-1",
      first: 50,
    });
  });
});
