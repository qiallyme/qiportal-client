import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(process.cwd(), "apps/client/src"),
      "@admin": path.resolve(process.cwd(), "apps/admin/src"),
      "@shared": path.resolve(process.cwd(), "shared"),
      "@ui": path.resolve(process.cwd(), "packages/ui/src"),
    },
  },
  build: {
    outDir: "dist",
    emptyOutDir: true,
  },
  server: {
    port: 3000,
    host: true,
  },
});
