import { defineBuildConfig } from "unbuild";

export default defineBuildConfig({
  externals: ["vite", "msw", "@mswjs/interceptors"],
});
