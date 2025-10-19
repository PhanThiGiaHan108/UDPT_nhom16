import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [["babel-plugin-react-compiler"]],
      },
    }),
  ],
  server: {
    port: 5173, // cổng mặc định
    proxy: {
      "/api/payment": {
        target: "http://localhost:5004", // địa chỉ payment service
        changeOrigin: true,
        secure: false,
      },
      "/api": {
        target: "http://localhost:5000", // địa chỉ backend chung
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
