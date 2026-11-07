import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import { wasp } from "wasp/client/vite";
import { fileURLToPath } from "node:url";
export default defineConfig({
  plugins: [wasp(), tailwindcss()],
    resolve: {
    alias: {
      src: fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  server: {
    open: true,
  },
});
