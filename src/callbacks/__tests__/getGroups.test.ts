import { describe, it, expect, vi, beforeEach } from "vitest";
import { getGroups } from "../getGroups.ts";
import { kibela } from "../../lib/kibela.ts";
import type { RequestHandlerExtra } from "@modelcontextprotocol/sdk/shared/protocol.js";
import { GetGroupsQuery } from "../../generated/graphql.ts";

vi.mock("../../lib/kibela", () => ({
  kibela: {
    GetGroups: vi.fn(),
  },
}));

describe("groups callback", () => {
  const mockRequestHandlerExtra = {} as RequestHandlerExtra;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns groups results when query is successful", async () => {
    const mockGroups = {
      groups: {
        edges: [
          {
            node: {
              id: "xxx",
              name: "Test Group 1",
              isDefault: true,
              isArchived: false,
            },
          },
          {
            node: {
              id: "xxx",
              name: "Test Group 2",
              isDefault: false,
              isArchived: false,
            },
          },
        ],
      },
    };

    vi.mocked(kibela.GetGroups).mockResolvedValue(mockGroups as GetGroupsQuery);

    const result = await getGroups({}, mockRequestHandlerExtra);

    expect(kibela.GetGroups).toHaveBeenCalledWith({
      first: 16,
    });

    expect(result).toEqual({
      content: [
        {
          type: "text",
          text: JSON.stringify([
            {
              id: "xxx",
              name: "Test Group 1",
              isDefault: true,
              isArchived: false,
            },
            {
              id: "xxx",
              name: "Test Group 2",
              isDefault: false,
              isArchived: false,
            },
          ]),
        },
      ],
    });
  });

  it('returns "Not Found" error when no groups', async () => {
    const mockEmptyResults = {
      groups: {
        edges: null,
      },
    };

    vi.mocked(kibela.GetGroups).mockResolvedValue(mockEmptyResults);

    const result = await getGroups({}, mockRequestHandlerExtra);

    expect(kibela.GetGroups).toHaveBeenCalledWith({
      first: 16,
    });

    expect(result).toEqual({
      content: [{ type: "text", text: "Not Found", isError: true }],
    });
  });

  it('returns "Not Found" error when groups edges are empty', async () => {
    const mockEmptyEdges = {
      groups: {
        edges: [],
      },
    };

    vi.mocked(kibela.GetGroups).mockResolvedValue(mockEmptyEdges);

    const result = await getGroups({}, mockRequestHandlerExtra);

    expect(kibela.GetGroups).toHaveBeenCalledWith({
      first: 16,
    });

    expect(result).toEqual({
      content: [{ type: "text", text: "[]" }],
    });
  });
});
