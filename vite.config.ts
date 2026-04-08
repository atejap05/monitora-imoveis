import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "./",
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor chunks
          "react-vendor": ["react", "react-dom"],
          "query-vendor": [
            "@tanstack/react-query",
            "@tanstack/react-query-devtools",
          ],
          "ui-vendor": [
            "@radix-ui/react-dialog",
            "@radix-ui/react-select",
            "@radix-ui/react-dropdown-menu",
          ],
          "chart-vendor": ["recharts"],
          "table-vendor": ["@tanstack/react-table"],
          "map-vendor": ["leaflet", "react-leaflet"],
          "form-vendor": ["react-hook-form", "@hookform/resolvers", "zod"],
          "utils-vendor": ["date-fns", "xlsx", "react-papaparse"],
          "pdf-vendor": ["@react-pdf/renderer"],
        },
      },
    },
    // Aumentar limite de warning se necessário
    chunkSizeWarningLimit: 1600,
  },
});
