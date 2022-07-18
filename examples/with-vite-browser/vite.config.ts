import { defineConfig } from "vite";
import { handlers } from "../with-vite-base/mocks/handlers";
import msw from "../../";

export default defineConfig({
  plugins: [msw({ mode: "browser", handlers })],
});
