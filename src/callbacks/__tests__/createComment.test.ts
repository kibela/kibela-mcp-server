import { describe, it, expect, vi, beforeEach } from "vitest";
import { createComment } from "../createComment.ts";
import { kibela } from "../../lib/kibela.ts";
import type { RequestHandlerExtra } from "@modelcontextprotocol/sdk/shared/protocol.js";
import { CreateCommentMutation } from "../../generated/graphql.ts";

vi.mock("../../lib/kibela", () => ({
  kibela: {
    CreateComment: vi.fn(),
  },
}));

describe("createComment callback", () => {
  const mockRequestHandlerExtra = {} as RequestHandlerExtra;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns comment id results when query is successful", async () => {
    const mockComments = {
      createComment: {
        comment: {
          id: "xxx",
        },
      },
    };

    vi.mocked(kibela.CreateComment).mockResolvedValue(
      mockComments as CreateCommentMutation
    );

    const result = await createComment(
      {
        content: "Test",
        noteId: "xxx",
      },
      mockRequestHandlerExtra
    );

    expect(kibela.CreateComment).toHaveBeenCalledWith({
      input: {
        content: "Test",
        commentableId: "xxx",
      },
    });

    expect(result).toEqual({
      content: [
        {
          type: "text",
          text: JSON.stringify({
            id: "xxx",
          }),
        },
      ],
    });
  });

  it("returns error results when failed", async () => {
    const mockComments = {
      createComment: {},
    };

    vi.mocked(kibela.CreateComment).mockResolvedValue(
      mockComments as CreateCommentMutation
    );

    const result = await createComment(
      {
        content: "Test",
        noteId: "xxx",
      },
      mockRequestHandlerExtra
    );

    expect(kibela.CreateComment).toHaveBeenCalledWith({
      input: {
        content: "Test",
        commentableId: "xxx",
      },
    });

    expect(result).toEqual({
      content: [
        {
          type: "text",
          text: "Failed",
          isError: true,
        },
      ],
    });
  });
});
