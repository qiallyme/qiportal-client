import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import baseConfig from "../../configs/vite.config";

export default defineConfig({
  ...baseConfig,
  root: path.resolve(__dirname),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
      "@shared": path.resolve(__dirname, "../../shared"),
      "@ui": path.resolve(__dirname, "../../shared/ui"),
    },
  },
  build: {
    outDir: path.resolve(__dirname, "dist"),
    emptyOutDir: true,
  },
  server: {
    port: 3002,
    host: true,
  },
});
