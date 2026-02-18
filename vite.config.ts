import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

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
}));
