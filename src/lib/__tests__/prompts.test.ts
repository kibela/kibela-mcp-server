import { describe, expect, it } from "vitest";
import { user } from "../prompt.ts";

describe("user", () => {
  it("should return user prompt", () => {
    const prompt = user("test");

    expect(prompt).toStrictEqual({
      messages: [
        {
          role: "user",
          content: {
            type: "text",
            text: "test",
          },
        },
      ],
    });
  });
});
