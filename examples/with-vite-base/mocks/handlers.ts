import { rest } from "msw";

export const handlers = [
  rest.get("/api/health", (req, res, ctx) => {
    return res(
      ctx.json({
        date: Date.now(),
        status: "OK",
      })
    );
  }),

  rest.all("/api", (req, res, ctx) => res(ctx.status(404))),
  rest.all("/api/*", (req, res, ctx) => res(ctx.status(404))),
];
