import createClient from "openapi-fetch";
import { config } from "@/lib/config";
import { mockFetch } from "./mock";
import type { paths } from "./schema";

export const api = createClient<paths>({
  baseUrl: config.apiUrl || "http://mock.local",
  fetch: config.useMock ? mockFetch : undefined,
});

const READ_TIMEOUT_MS = 15_000;
const WRITE_TIMEOUT_MS = 45_000;

/** Per-request deadline; openapi-fetch has none of its own (FR-022). */
export const readSignal = () => AbortSignal.timeout?.(READ_TIMEOUT_MS);
export const writeSignal = () => AbortSignal.timeout?.(WRITE_TIMEOUT_MS);
