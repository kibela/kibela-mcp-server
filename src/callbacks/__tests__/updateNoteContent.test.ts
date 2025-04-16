import { describe, it, expect, vi, beforeEach } from "vitest";
import { updateNoteContent } from "../updateNoteContent.ts";
import { kibela } from "../../lib/kibela.ts";
import type { RequestHandlerExtra } from "@modelcontextprotocol/sdk/shared/protocol.js";
import { UpdateNoteContentMutation } from "../../generated/graphql.ts";

vi.mock("../../lib/kibela", () => ({
  kibela: {
    UpdateNoteContent: vi.fn(),
  },
}));

describe("updateNoteContent callback", () => {
  const mockRequestHandlerExtra = {} as RequestHandlerExtra;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns notes results when query is successful", async () => {
    const mockNotes = {
      updateNoteContent: {
        note: {
          id: "xxx",
          url: "https://example.com",
        },
      },
    };

    vi.mocked(kibela.UpdateNoteContent).mockResolvedValue(
      mockNotes as UpdateNoteContentMutation
    );

    const result = await updateNoteContent(
      {
        id: "xxx",
        newContent: "New Test",
        baseContent: "Base Test",
      },
      mockRequestHandlerExtra
    );

    expect(kibela.UpdateNoteContent).toHaveBeenCalledWith({
      input: {
        id: "xxx",
        newContent: "New Test",
        baseContent: "Base Test",
        touch: true,
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

  it("returns notes results when query is successful", async () => {
    const mockNotes = {
      updateNoteContent: {},
    };

    vi.mocked(kibela.UpdateNoteContent).mockResolvedValue(
      mockNotes as UpdateNoteContentMutation
    );

    const result = await updateNoteContent(
      {
        id: "xxx",
        newContent: "New Test",
        baseContent: "Base Test",
      },
      mockRequestHandlerExtra
    );

    expect(kibela.UpdateNoteContent).toHaveBeenCalledWith({
      input: {
        id: "xxx",
        newContent: "New Test",
        baseContent: "Base Test",
        touch: true,
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
