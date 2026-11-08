import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { fileURLToPath, URL } from "node:url";
import { loadEnv } from "vite";
import { validateHostedEnvironment } from "./src/lib/hosting.ts";

export default defineConfig(({ mode }) => {
  validateHostedEnvironment({ ...loadEnv(mode, process.cwd(), "VITE_"), ...process.env });
  return {
  resolve: { alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) } },
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      "/api": {
        target: process.env.API_PROXY_TARGET ?? "http://127.0.0.1:8000",
      },
    },
    watch: { usePolling: process.env.VITE_USE_POLLING === "true" },
  },
  test: {
    environment: "jsdom",
    setupFiles: ["./src/test/setup.ts"],
    include: ["src/**/*.test.{ts,tsx}", "tests/**/*.test.{ts,tsx}"],
    restoreMocks: true,
  },
  };
});
