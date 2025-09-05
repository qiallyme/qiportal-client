import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export function createViteConfig(appName: string, rootDir: string) {
  return defineConfig({
    plugins: [react()],
    root: rootDir,
    resolve: {
      alias: {
        "@": path.resolve(rootDir, "src"),
        "@shared": path.resolve(rootDir, "../../shared"),
        "@ui": path.resolve(rootDir, "../../packages/ui/src"),
      },
    },
    build: {
      outDir: path.resolve(rootDir, `../../dist/${appName}`),
      emptyOutDir: true,
    },
  });
}
