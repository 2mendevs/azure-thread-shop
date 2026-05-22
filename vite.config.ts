import { defineConfig } from "@lovable.dev/vite-tanstack-config";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  vite: {
    plugins: [
      tsconfigPaths(),
    ],
  },
});
