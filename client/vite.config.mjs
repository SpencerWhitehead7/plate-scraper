import path from "node:path"

import legacy from "@vitejs/plugin-legacy"
import react from "@vitejs/plugin-react-swc"
import { visualizer } from "rollup-plugin-visualizer"
import { defineConfig, splitVendorChunkPlugin } from "vite"
import checker from "vite-plugin-checker"

export default defineConfig({
  // eslint-disable-next-line no-undef
  root: __dirname,
  publicDir: "public",

  build: {
    // eslint-disable-next-line no-undef
    outDir: path.resolve(__dirname, "dist"),
  },

  resolve: {
    alias: {
      // eslint-disable-next-line no-undef
      "@": path.resolve(__dirname, "src"),
    },
  },

  server: {
    proxy: {
      "/api": "http://localhost:1337",
    },
  },

  plugins: [
    react({
      include: "./src/**.*{jsx,tsx}",
    }),
    checker({
      typescript: true,
    }),
    splitVendorChunkPlugin(),
    legacy({ targets: ["defaults", "not IE 11"] }),
    visualizer(),
  ],
})
