import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["active/**/*.test.ts", "review/**/*.test.ts"],
  },
});
