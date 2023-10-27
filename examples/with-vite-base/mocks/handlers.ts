import { HttpResponse, http } from "msw";

const NotFoundResponse = new HttpResponse("Not found", {
  status: 404,
  headers: {
    "Content-Type": "text/plain",
  },
});

export const handlers = [
  http.get("/api/health", () =>
    HttpResponse.json({
      date: Date.now(),
      status: "OK",
    }),
  ),

  http.all("/api", () => NotFoundResponse),
  http.all("/api/*", () => NotFoundResponse),
];
