import createClient from "openapi-fetch";
import { config } from "@/lib/config";
import { mockFetch } from "./mock";
import type { paths } from "./schema";

export const api = createClient<paths>({
  baseUrl: config.apiUrl || "http://mock.local",
  fetch: config.useMock ? mockFetch : undefined,
});

const READ_TIMEOUT_MS = 65_000;  // Wait up to 65 seconds for Render to wake up
const WRITE_TIMEOUT_MS = 90_000; // Give uploads extra time

/** Per-request deadline; openapi-fetch has none of its own (FR-022). */
export const readSignal = () => AbortSignal.timeout?.(READ_TIMEOUT_MS);
export const writeSignal = () => AbortSignal.timeout?.(WRITE_TIMEOUT_MS);
