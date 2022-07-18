/* eslint-disable @typescript-eslint/ban-ts-comment */
import type { NextFunction, NextHandleFunction } from "connect";
import type { IncomingMessage, ServerResponse } from "http";
import { resolve } from "path";
// import { createReadStream } from "node:fs";
import fsExtra from "fs-extra";
import { createRequire } from "node:module";

const { copy, readFile } = fsExtra;
const require = createRequire(import.meta.url);

const swFileName = "mockServiceWorker.js";
const mswPath = require.resolve(`msw/lib/${swFileName}`);

export const createBrowserMiddleware = (): NextHandleFunction => {
  return async (req: IncomingMessage, res: ServerResponse, next: NextFunction) => {
    try {
      if (req.method !== "GET" || req.url !== `/${swFileName}`) {
        next();
        return;
      }
      const swContent = await readFile(mswPath, "utf8");
      res.setHeader("content-type", "application/javascript");
      res.statusCode = 200;
      res.end(swContent);
    } catch (error) {
      res.end(error);
    }
  };
};

interface BuildBrowserSupportOptions {
  outDir: string;
}

export const buildMswForBrowser = async ({ outDir }: BuildBrowserSupportOptions) => {
  const outputPath = resolve(process.cwd(), outDir, swFileName);
  await copy(mswPath, outputPath);
};
