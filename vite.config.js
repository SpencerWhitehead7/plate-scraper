import path from "node:path"

import legacy from "@vitejs/plugin-legacy"
import react from "@vitejs/plugin-react-swc"
import { visualizer } from "rollup-plugin-visualizer"
import checker from "vite-plugin-checker"
import { defineConfig, splitVendorChunkPlugin } from "vite"

export default defineConfig({
  root: path.resolve(__dirname, "client"),
  publicDir: "../public",

  build: {
    outDir: "../built/client",
  },

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "client"),
    },
  },

  server: {
    proxy: {
      "/api": "http://localhost:1337",
    },
  },

  plugins: [
    react({
      include: "./client/**.*{jsx,tsx}",
    }),
    checker({
      typescript: { root: path.resolve(__dirname, "client") },
    }),
    splitVendorChunkPlugin(),
    legacy({ targets: ["defaults", "not IE 11"] }),
    visualizer(),
  ],
})
