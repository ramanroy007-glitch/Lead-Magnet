import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: "/",   // 🔥 VERY IMPORTANT — FIXES BROKEN UI
  plugins: [react()],

  build: {
    outDir: "dist",
    emptyOutDir: true,
  },

  resolve: {
    alias: {
      "@": "./",
    },
  },
});

