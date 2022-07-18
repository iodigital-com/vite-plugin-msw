/* eslint-disable @typescript-eslint/ban-ts-comment */
import type { NextFunction, NextHandleFunction } from "connect";
import type { IncomingHttpHeaders, IncomingMessage, ServerResponse } from "http";
import type { RequestHandler } from "msw";
import type { ViteDevServer } from "vite";
import { parseIsomorphicRequest, handleRequest } from "msw";
import bodyParser from "body-parser";
import { EventEmitter } from "events";
import { Headers } from "headers-polyfill";

const emitter = new EventEmitter();

const sanitizeHeaders = (headers: IncomingHttpHeaders) =>
  Object.entries({ ...headers }).reduce((acc, [key, value]) => {
    if (typeof key === "string" && !key.startsWith(":")) {
      // @ts-ignore
      acc[key] = value;
    }
    return acc;
  }, {});

export const createMiddleware =
  (serverOrigin: string) =>
  (...handlers: RequestHandler[]): NextHandleFunction => {
    return async (req: IncomingMessage, res: ServerResponse, next: NextFunction) => {
      if (!req.method || !req.url) {
        next();
      } else {
        const mockedRequest = parseIsomorphicRequest({
          id: "",
          method: req.method,
          // Treat all relative URLs as the ones coming from the server.
          url: new URL(req.url, serverOrigin),
          headers: new Headers(sanitizeHeaders(req.headers)),
          credentials: "omit",
          // @ts-ignore
          body: req.body,
        });

        await handleRequest(
          mockedRequest,
          handlers,
          {
            onUnhandledRequest: () => null,
          },
          // @ts-ignore
          emitter,
          {
            resolutionContext: {
              /**
               * @note Resolve relative request handler URLs against
               * the server's origin (no relative URLs in Node.js).
               */
              baseUrl: serverOrigin,
            },
            onMockedResponseSent(mockedResponse) {
              const { status, statusText, headers, body } = mockedResponse;
              res.statusCode = status;
              headers.forEach((value, name) => {
                res.setHeader(name, value);
              });

              res.end(body ? body : statusText);
            },
            onPassthroughResponse() {
              next();
            },
          }
        );
      }
    };
  };

export interface VitePluginMswOptions {
  handlers: RequestHandler[];
}

const vitePluginMsw = ({ handlers }: VitePluginMswOptions) => ({
  name: "configure-server",
  configureServer(devServer: ViteDevServer) {
    const { server } = devServer.config;
    const port = server.port ? `:${server.port}` : "";
    const host = server.host || "localhost";
    const https = server.https ? "https" : "http";

    const serverOrigin = `${https}://${host}${port}`;
    devServer.middlewares.use(bodyParser.json());
    devServer.middlewares.use(createMiddleware(serverOrigin)(...handlers));
  },
});

export default vitePluginMsw;
