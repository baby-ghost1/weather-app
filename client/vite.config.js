import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, "../", "");
  return {
    plugins: [react(), tailwindcss()],
    define: {
      "import.meta.env.VITE_OWM_API_KEY": JSON.stringify(env.OPENWEATHER_API_KEY),
    },
    server: {
      port: 5173,
      proxy: {
        "/api": {
          target: "http://localhost:3000",
          changeOrigin: true,
        },
      },
    },
  };
});
