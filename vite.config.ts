import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
    server: {
      host: "::",  // Слушаем все хосты
      port: 8080,
      allowedHosts: ["*"],  // Разрешаем все хосты
    },
    plugins: [react()],
    css: {
      postcss: path.resolve(__dirname, "postcss.config.cjs"),
    },
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    build: {
      // Optimize for mobile performance
      target: "esnext",
      minify: "terser",
      terserOptions: {
        compress: {
          drop_console: mode === "production",
          drop_debugger: mode === "production",
        },
      },
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ["react", "react-dom"],
            router: ["react-router-dom"],
            animations: ["framer-motion"],
            ui: ["@radix-ui/react-toast", "@radix-ui/react-tooltip"],
          },
        },
      },
      // Optimize chunk size
      chunkSizeWarningLimit: 1000,
    },
    optimizeDeps: {
      include: [
        "react",
        "react-dom",
        "react-router-dom",
        "framer-motion",
        "@tanstack/react-query",
      ],
    },
}));
