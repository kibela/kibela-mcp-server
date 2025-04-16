import { describe, it, expect, vi, beforeEach } from "vitest";
import { createComment } from "../createComment.ts";
import { kibela } from "../../lib/kibela.ts";
import type { RequestHandlerExtra } from "@modelcontextprotocol/sdk/shared/protocol.js";
import { CreateCommentReplyMutation } from "../../generated/graphql.ts";
import { createCommentReply } from "../createCommentReply.ts";

vi.mock("../../lib/kibela", () => ({
  kibela: {
    CreateCommentReply: vi.fn(),
  },
}));

describe("createComment callback", () => {
  const mockRequestHandlerExtra = {} as RequestHandlerExtra;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns comment reply id results when query is successful", async () => {
    const mockComments = {
      createCommentReply: {
        reply: {
          id: "xxx",
        },
      },
    };

    vi.mocked(kibela.CreateCommentReply).mockResolvedValue(
      mockComments as CreateCommentReplyMutation
    );

    const result = await createCommentReply(
      {
        content: "Test",
        commentId: "xxx",
      },
      mockRequestHandlerExtra
    );

    expect(kibela.CreateCommentReply).toHaveBeenCalledWith({
      input: {
        content: "Test",
        commentId: "xxx",
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
      createCommentReply: {},
    };

    vi.mocked(kibela.CreateCommentReply).mockResolvedValue(
      mockComments as CreateCommentReplyMutation
    );

    const result = await createCommentReply(
      {
        content: "Test",
        commentId: "xxx",
      },
      mockRequestHandlerExtra
    );

    expect(kibela.CreateCommentReply).toHaveBeenCalledWith({
      input: {
        content: "Test",
        commentId: "xxx",
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
