import { defineConfig } from "vitest/config";

// Separate from vite.config.ts on purpose: tests are pure TypeScript (no React
// or Tailwind plugins needed), which keeps the Vitest runner fast and avoids
// plugin interference on Windows.
export default defineConfig({
  test: {
    environment: "node",
    include: ["src/**/*.test.ts"],
  },
});
