import type { RequestHandler } from "msw";
import type { Plugin } from "vite";
import { createNodeMiddleware } from "./node.js";
import { buildMswForBrowser, createBrowserMiddleware } from "./browser.js";

export interface VitePluginMswOptions {
  mode?: "browser" | "node";
  handlers: RequestHandler[];
  build?: boolean;
}

interface BrowserIntegrationOptions {
  build: boolean;
}

const browserIntegration = ({ build }: BrowserIntegrationOptions): Plugin => {
  let outDir;
  return {
    name: "vite-plugin-msw:browser-integration",
    configureServer(devServer) {
      const { isProduction } = devServer.config;
      if (!isProduction) {
        devServer.middlewares.use(createBrowserMiddleware());
      }
    },
    configResolved(config) {
      outDir = config.build.outDir;
    },
    async closeBundle() {
      const isProduction = process.env.NODE_ENV === "production";
      if (isProduction && build) {
        await buildMswForBrowser({ outDir });
      }
    },
  };
};

const getNodeIntegration = (handlers: RequestHandler[]): Plugin => {
  return {
    name: "vite-plugin-msw:node-integration",
    configureServer(devServer) {
      devServer.middlewares.use(createNodeMiddleware()(...handlers));
    },
  };
};

const defaultVitePluginMswOptions: VitePluginMswOptions = { mode: "browser", handlers: undefined, build: false };

const vitePluginMsw = ({ mode, handlers, build } = defaultVitePluginMswOptions): Plugin => ({
  ...(mode === "node" && getNodeIntegration(handlers)),
  ...(mode === "browser" && browserIntegration({ build })),
});

export default vitePluginMsw;
