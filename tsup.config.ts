import { defineConfig } from "tsup";

export default defineConfig({
  entry: {
    cli: "src/index.ts",
  },
  format: ["esm"],
  target: "es2022",
  clean: true,
  outDir: "bin",
  outExtension: () => ({
    js: ".mjs",
  }),
  banner: {
    js: "#!/usr/bin/env node",
  },
});
