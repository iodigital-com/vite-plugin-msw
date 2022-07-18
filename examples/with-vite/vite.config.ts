import { defineConfig } from "vite";
import { handlers } from "./mocks/handlers";
import msw from "../../";

export default defineConfig({
  plugins: [msw({ handlers })],
});
