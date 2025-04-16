import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  schema: [
    {
      [process.env.KIBELA_CODEGEN_URI as string]: {
        headers: {
          Authorization: `Bearer ${process.env.KIBELA_ACCESS_TOKEN}`,
        },
      },
    },
  ],
  documents: ["src/**/*.graphql", "src/**/*.ts", "src/**/*.tsx"],
  generates: {
    "./src/generated/graphql.ts": {
      plugins: [
        "typescript",
        "typescript-operations",
        "typescript-graphql-request",
      ],
    },
  },
};

export default config;
