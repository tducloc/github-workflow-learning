/// <reference types="vitest" />
import react from "@vitejs/plugin-react-swc";
import { defineConfig, loadEnv } from "vite";
import svgr from "vite-plugin-svgr";
import tsconfigPaths from "vite-tsconfig-paths";

// https://vite.dev/config/
export default defineConfig((props) => {
  // https://github.com/vitejs/vite/issues/1149#issuecomment-857686209
  const env = loadEnv(props.mode, process.cwd(), "VITE_APP");
  const envWithProcessPrefix = {
    "process.env": `${JSON.stringify(env)}`,
  };

  return {
    define: envWithProcessPrefix,
    optimizeDeps: {
      exclude: ["@icons/*"],
    },
    plugins: [react(), svgr(), tsconfigPaths()],
    server: {
      port: 3000,
      host: true,
    },
  };
});
