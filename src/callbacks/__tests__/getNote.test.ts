import { describe, it, expect, vi, beforeEach } from "vitest";
import { getNote } from "../getNote.ts";
import { kibela } from "../../lib/kibela.ts";
import type { RequestHandlerExtra } from "@modelcontextprotocol/sdk/shared/protocol.js";
import { GetNoteQuery } from "../../generated/graphql.ts";

vi.mock("../../lib/kibela", () => ({
  kibela: {
    GetNote: vi.fn(),
  },
}));

describe("notes callback", () => {
  const mockRequestHandlerExtra = {} as RequestHandlerExtra;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns notes results when query is successful", async () => {
    const mockNotes = {
      note: {
        title: "Test Note 1",
        content: "Test",
        url: "https://example.com",
        author: {
          account: "test",
          realName: "Test",
        },
        folders: {
          edges: [
            {
              node: {
                id: "xxx",
                name: "Test Folder 1",
                fullName: "Test Folder 1",
                fixedPath: "test",
                group: {
                  id: "xxx",
                  name: "Test Group 1",
                },
              },
            },
          ],
        },
        comments: {
          edges: [
            {
              node: {
                id: "xxx",
                content: "Test",
                anchor: "test",
                author: {
                  account: "test_user",
                  realName: "Test User",
                },
                replies: {
                  edges: [
                    {
                      node: {
                        id: "xxx",
                        content: "Test",
                        anchor: "test",
                        author: {
                          account: "test_user",
                          realName: "Test User",
                        },
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
                id: "xxx",
                content: "Test",
                anchor: "test",
                author: {
                  account: "test_user",
                  realName: "Test User",
                },
                replies: {
                  edges: [
                    {
                      node: {
                        id: "xxx",
                        content: "Test",
                        anchor: "test",
                        author: {
                          account: "test_user",
                          realName: "Test User",
                        },
                      },
                    },
                  ],
                },
              },
            },
          ],
        },
      },
    };

    vi.mocked(kibela.GetNote).mockResolvedValue(mockNotes as GetNoteQuery);

    const result = await getNote({ id: "xxx" }, mockRequestHandlerExtra);

    expect(kibela.GetNote).toHaveBeenCalledWith({
      id: "xxx",
      first: 16,
    });

    expect(result).toEqual({
      content: [
        {
          type: "text",
          text: JSON.stringify({
            title: "Test Note 1",
            content: "Test",
            url: "https://example.com",
            author: {
              account: "test",
              realName: "Test",
            },
            folders: [
              {
                id: "xxx",
                name: "Test Folder 1",
                fullName: "Test Folder 1",
                fixedPath: "test",
                group: {
                  id: "xxx",
                  name: "Test Group 1",
                },
              },
            ],
            comments: [
              {
                id: "xxx",
                content: "Test",
                anchor: "test",
                author: {
                  account: "test_user",
                  realName: "Test User",
                },
                replies: [
                  {
                    id: "xxx",
                    content: "Test",
                    anchor: "test",
                    author: {
                      account: "test_user",
                      realName: "Test User",
                    },
                  },
                ],
              },
            ],
            inlineComments: [
              {
                id: "xxx",
                content: "Test",
                anchor: "test",
                author: {
                  account: "test_user",
                  realName: "Test User",
                },
                replies: [
                  {
                    id: "xxx",
                    content: "Test",
                    anchor: "test",
                    author: {
                      account: "test_user",
                      realName: "Test User",
                    },
                  },
                ],
              },
            ],
          }),
        },
      ],
    });
  });

  it("returns error results when result is empty", async () => {
    const mockNotes = {};

    vi.mocked(kibela.GetNote).mockResolvedValue(mockNotes as GetNoteQuery);

    const result = await getNote({ id: "xxx" }, mockRequestHandlerExtra);

    expect(kibela.GetNote).toHaveBeenCalledWith({
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
