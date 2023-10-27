import { setupWorker } from "msw/browser";
import { handlers } from "../../with-vite-base/mocks/handlers";
export const worker = setupWorker(...handlers);
