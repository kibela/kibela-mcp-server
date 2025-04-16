import { describe, it, expect, vi, beforeEach } from "vitest";
import { getFeedSections } from "../getFeedSections.ts";
import { kibela } from "../../lib/kibela.ts";
import type { RequestHandlerExtra } from "@modelcontextprotocol/sdk/shared/protocol.js";
import { FeedKind, GetFeedSectionsQuery } from "../../generated/graphql.ts";

vi.mock("../../lib/kibela", () => ({
  kibela: {
    GetFeedSections: vi.fn(),
  },
}));

describe("notes callback", () => {
  const mockRequestHandlerExtra = {} as RequestHandlerExtra;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns feed sections results when query is successful", async () => {
    const mockNotes = {
      feedSections: {
        edges: [
          {
            node: {
              date: null,
            },
          },
        ],
      },
    };

    vi.mocked(kibela.GetFeedSections).mockResolvedValue(
      mockNotes as GetFeedSectionsQuery
    );

    const result = await getFeedSections(
      { kind: FeedKind.Group, groupId: "xxx" },
      mockRequestHandlerExtra
    );

    expect(kibela.GetFeedSections).toHaveBeenCalledWith({
      kind: "GROUP",
      groupId: "xxx",
      first: 16,
    });

    expect(result).toEqual({
      content: [
        {
          type: "text",
          text: JSON.stringify([{ node: { date: null } }]),
        },
      ],
    });
  });

  it("returns error results when failed", async () => {
    const mockNotes = {
      feedSections: {},
    };

    vi.mocked(kibela.GetFeedSections).mockResolvedValue(
      mockNotes as GetFeedSectionsQuery
    );

    const result = await getFeedSections(
      { kind: FeedKind.Group, groupId: "xxx" },
      mockRequestHandlerExtra
    );

    expect(kibela.GetFeedSections).toHaveBeenCalledWith({
      kind: "GROUP",
      groupId: "xxx",
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
