/* eslint-disable @typescript-eslint/ban-ts-comment */
import type { NextFunction, NextHandleFunction } from "connect";
import type { IncomingHttpHeaders, IncomingMessage, ServerResponse } from "http";
import { MockedRequest, RequestHandler, handleRequest } from "msw";
import { StrictEventEmitter } from "strict-event-emitter";
import { Headers } from "headers-polyfill";
import { encodeBuffer } from "@mswjs/interceptors";

const emitter = new StrictEventEmitter();

const sanitizeHeaders = (headers: IncomingHttpHeaders) =>
  Object.entries({ ...headers }).reduce((acc, [key, value]) => {
    if (typeof key === "string" && !key.startsWith(":")) {
      // @ts-ignore
      acc[key] = value;
    }
    return acc;
  }, {});

export const createNodeMiddleware =
  (serverOrigin: string = `http://localhost`) =>
  (...handlers: RequestHandler[]): NextHandleFunction => {
    return async (req: IncomingMessage, res: ServerResponse, next: NextFunction) => {
      if (!req.method || !req.url) {
        next();
      } else {
        // @ts-ignore
        const requestBody = typeof req.body === "string" ? req.body : JSON.stringify(req.body);
        // Treat all relative URLs as the ones coming from the server.
        const mockedRequest = new MockedRequest(new URL(req.url, serverOrigin), {
          method: req.method,
          headers: new Headers(sanitizeHeaders(req.headers)),
          credentials: "omit",
          body: encodeBuffer(requestBody),
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
            onMockedResponse(mockedResponse) {
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
