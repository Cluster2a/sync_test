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
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      input: {
        app: path.resolve(__dirname, "index.html"),
        ...(process.env.BUILD_SSR && {
          server: path.resolve(__dirname, "src/entry-server.tsx"),
        }),
      },
      external: (id) => {
        // For client builds, externalize papaparse to avoid build issues
        if (id === 'papaparse') return true;
        return false;
      },
    },
  },
  ssr: {
    noExternal: ['@radix-ui/*', 'lucide-react', 'papaparse'],
  },
}));
