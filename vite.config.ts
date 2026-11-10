import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  base: "/", // Will be replaced with the correct base path for GitHub Pages
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  // The build-time renderer (scripts/prerender-routes.mjs) imports the SSR
  // bundle straight into Node. Several of the site's dependencies still ship
  // CommonJS, which Node refuses to import by named export, so the bundle
  // carries them itself instead of leaving them external. It never reaches a
  // visitor, so its size does not matter.
  ssr: {
    noExternal: true,
  },
  build: {
    outDir: "dist",
    emptyOutDir: true,
    sourcemap: false,
    rollupOptions: {
      input: 'index.html'
    }
  },
}));
