import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    port: 3000,
    proxy: {
      "^/api.*": {
        target: "http://localhost:8080",
        changeOrigin: false,
        secure: false,
        ws: true,
      },
    },
  },
});
