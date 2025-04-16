import { describe, it, expect, vi, beforeEach, afterAll } from "vitest";
import { z } from "zod";

describe("env variables schema", () => {
  const originalEnv = { ...process.env };

  beforeEach(() => {
    vi.resetModules();
    process.env = { ...originalEnv };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  it("should define environment variable schema for Kibela", () => {
    const schema = z.object({
      KIBELA_ORIGIN: z.string().url(),
      KIBELA_ACCESS_TOKEN: z.string(),
    });

    const validEnv = {
      KIBELA_ORIGIN: "https://example.kibe.la",
      KIBELA_ACCESS_TOKEN: "test-token",
    };

    const result = schema.safeParse(validEnv);
    expect(result.success).toBe(true);
  });

  it("should validate the KIBELA_ORIGIN as a valid URL", () => {
    const schema = z.object({
      KIBELA_ORIGIN: z.string().url(),
      KIBELA_ACCESS_TOKEN: z.string(),
    });

    const invalidEnv = {
      KIBELA_ORIGIN: "not-a-url",
      KIBELA_ACCESS_TOKEN: "test-token",
    };

    const result = schema.safeParse(invalidEnv);
    expect(result.success).toBe(false);

    if (!result.success) {
      const error = result.error.format();
      expect(error.KIBELA_ORIGIN?._errors).toBeDefined();
    }
  });

  it("should require both KIBELA_ORIGIN and KIBELA_ACCESS_TOKEN", () => {
    const schema = z.object({
      KIBELA_ORIGIN: z.string().url(),
      KIBELA_ACCESS_TOKEN: z.string(),
    });

    const partialEnv = {
      KIBELA_ORIGIN: "https://example.kibe.la",
    };

    const result = schema.safeParse(partialEnv);
    expect(result.success).toBe(false);

    if (!result.success) {
      const error = result.error.format();
      expect(error.KIBELA_ACCESS_TOKEN?._errors).toBeDefined();
    }
  });
});
