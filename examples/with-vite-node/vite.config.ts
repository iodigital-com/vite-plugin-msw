import { defineConfig } from "vite";
import { handlers } from "../with-vite-base/mocks/handlers.js";
import msw from "../../";

export default defineConfig({
  plugins: [msw({ mode: "node", handlers })],
});
