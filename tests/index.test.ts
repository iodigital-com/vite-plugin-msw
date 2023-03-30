import { expect, test } from "@playwright/test";
import type { Page } from "@playwright/test";

function getApiResponse({
  page,
  url,
}: {
  page: Page;
  url: string;
}): Promise<{ status: number; json: { status: string } }> {
  return page.evaluate(async (url) => {
    const response = await fetch(url);
    const json = await response.json();
    return { status: response.status, json };
  }, url);
}

test.describe("with-vite-browser", () => {
  test("it can fetch a response from API", async ({ page, context }) => {
    const serviceWorkerPromise = context.waitForEvent("serviceworker");
    const baseUrl = "http://localhost:3002";
    const url = `${baseUrl}/api/health`;
    await page.goto(baseUrl);
    await serviceWorkerPromise;
    const { status, json } = await getApiResponse({ page, url });
    expect(status).toEqual(200);
    expect(json.status).toEqual("OK");
  });
});

test.describe("with-vite-node", () => {
  test("it can fetch a response from API", async ({ page }) => {
    const baseUrl = "http://localhost:3003";
    const url = `${baseUrl}/api/health`;
    await page.goto(baseUrl);
    const { status, json } = await getApiResponse({ page, url });
    expect(status).toEqual(200);
    expect(json.status).toEqual("OK");
  });
});
