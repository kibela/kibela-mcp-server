import { defineConfig } from "vitest/config";
import dotenv from "dotenv";

export default defineConfig({
  test: {
    globals: true,
    environment: "node",
    include: ["src/**/__tests__/**/*.test.ts"],
    coverage: {
      reporter: ["text", "json", "html"],
      exclude: [
        "node_modules/**",
        "**/*.d.ts",
        "./*.{ts,js}",
        "**/__tests__/**",
        "bin",
        "src/generated",
        "src/lib/env.ts",
        "src/index.ts",
        "src/lib/server.ts",
        "src/lib/schemas.ts",
        "src/lib/intl.ts",
        "src/lib/config.ts"
      ],
    },
    env: dotenv.config({ path: ".env.test" }).parsed,
  },
});
