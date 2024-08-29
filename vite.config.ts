import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { crx, type ManifestV3Export } from "@crxjs/vite-plugin";
import manifest from "./manifest.json";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), crx({ manifest: manifest as ManifestV3Export })],
  esbuild: {
    drop: ["console", "debugger"],
  },
  resolve: {
    alias: [
      {
        find: "@",
        replacement: path.resolve(__dirname, "src"),
      },
      {
        find: "@options",
        replacement: path.resolve(__dirname, "src/pages/options"),
      },
      {
        find: "@popup",
        replacement: path.resolve(__dirname, "src/pages/popup"),
      },
      {
        find: "@content",
        replacement: path.resolve(__dirname, "src/pages/content"),
      },
    ],
  },
  server: { hmr: { clientPort: 5173 } },
  build: {
    chunkSizeWarningLimit: 1024,
  },
});
