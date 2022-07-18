import { setupWorker } from "msw";
import { handlers } from "../../with-vite-base/mocks/handlers";
export const worker = setupWorker(...handlers);
