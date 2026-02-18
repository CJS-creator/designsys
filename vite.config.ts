import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@designsys/ui-ux-core": path.resolve(__dirname, "./packages/ui-ux-core/src"),
      "@designsys/ui-ux-patterns": path.resolve(__dirname, "./packages/ui-ux-patterns/src"),
      "@designsys/ui-ux-skills": path.resolve(__dirname, "./packages/ui-ux-skills/src"),
    },
  },
  build: {
    // Existing chunking strategy currently produces a few large bundles.
    // Raise warning threshold to avoid noisy false-positive build warnings.
    chunkSizeWarningLimit: 1000,
  },
}));
