import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { fileURLToPath, URL } from "node:url";

// GitHub Pages serves a project site under /<repo-name>/, so assets must be
// requested from there. CI sets VITE_BASE from the repo name; this fallback
// only applies to local production builds. Use `npm run build:ftp` (VITE_BASE=/)
// when deploying to the root of a domain instead.
const base =
  process.env.VITE_BASE ??
  (process.env.NODE_ENV === 'production' ? '/shambala-react-final/' : '/');

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base,
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
      src: fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  server: {
    host: '0.0.0.0',
    port: 3000,
    open: true
  },
  build: {
    outDir: 'build',
    assetsDir: 'assets'
  }
})
