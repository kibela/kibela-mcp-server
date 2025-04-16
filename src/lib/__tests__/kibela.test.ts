import { describe, it, expect, vi, beforeEach } from "vitest";
import { kibela } from "../kibela.ts";

vi.mock("graphql-request", () => ({
  GraphQLClient: vi.fn().mockImplementation(() => ({
    request: vi.fn(),
  })),
}));

vi.mock("../../generated/graphql", () => ({
  getSdk: vi.fn().mockImplementation((client) => ({
    SearchKibela: vi.fn(),
    client,
  })),
}));

describe("kibela client", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.KIBELA_ORIGIN = "https://test.kibe.la";
    process.env.KIBELA_ACCESS_TOKEN = "test-token";
  });

  it("should export the sdk with the initialized client", () => {
    expect(kibela).toBeDefined();
  });
});
