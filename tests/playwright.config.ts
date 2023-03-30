import type { PlaywrightTestConfig } from "@playwright/test";

const defaultTestWebServerConfig = {
  timeout: 120 * 1000,
  reuseExistingServer: !process.env.CI,
};

interface GetWebServerConfigOptions {
  port: number;
  cwd: string;
}

export const getWebServerConfig = ({ port, cwd }: GetWebServerConfigOptions) => ({
  ...defaultTestWebServerConfig,
  command: `npm run dev -- --port ${port}`,
  url: `http://localhost:${port}`,
  cwd,
});

const config: PlaywrightTestConfig = {
  testDir: "../tests",
  reporter: [["list"], ["junit", { outputFile: "test-results.xml" }]],
  webServer: [
    getWebServerConfig({ port: 3002, cwd: "../examples/with-vite-browser" }),
    getWebServerConfig({ port: 3003, cwd: "../examples/with-vite-node" }),
  ],
};

export default config;
