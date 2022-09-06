import vue from "@vitejs/plugin-vue";
import { defineConfig } from "@midwayjs/hooks-kit";
import jsx from "@vitejs/plugin-vue-jsx";
import { splitVendorChunkPlugin } from "vite";
import { dynamicRouterPlugin } from "./lib/dynamic-router/vite/dynamicRouterPlugin";

export default defineConfig({
  vite: {
    plugins: [
      vue(),
      jsx(),
      splitVendorChunkPlugin(),
      dynamicRouterPlugin({ includes: ["./src/Pages/*"] }),
    ],
  },
});
