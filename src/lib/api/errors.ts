export type ApiFailure = { code: string; message: string; retryAfter?: number };

const copy: Record<string, string> = {
  too_large: "That file is larger than 5 MB. Choose a smaller file or take a new photo.",
  unsupported_type: "That file type is not supported. Use a JPG, PNG, or PDF.",
  rate_limited: "The demo has reached its processing limit for now.",
  not_found: "That receipt no longer exists. It may have been removed after the retention period.",
  conflict: "This receipt has already been decided, so that action is no longer available.",
  invalid: "Some fields were rejected. Check the highlighted values and save again.",
  server: "The server could not finish the request. Try again, or use a sample receipt.",
  network: "Could not reach the server. Check your connection and try again.",
  timeout: "The server took too long to answer. Try again.",
};

const byStatus: Record<number, string> = {
  400: "invalid",
  404: "not_found",
  409: "conflict",
  413: "too_large",
  415: "unsupported_type",
  422: "invalid",
  429: "rate_limited",
};

export function normalizeError(status: number, body: unknown): ApiFailure {
  const code = byStatus[status] ?? "server";
  const retryAfter =
    body && typeof body === "object" && "error" in body
      ? Number((body as { error?: { retryAfter?: unknown } }).error?.retryAfter) || undefined
      : undefined;
  return { code, message: copy[code] ?? copy.server, retryAfter };
}

export function transportError(error: unknown): ApiFailure {
  // Fetch aborts reject with a DOMException, which is not an Error subclass in browsers.
  const name = error && typeof error === "object" && "name" in error ? String(error.name) : "";
  return name === "TimeoutError" || name === "AbortError"
    ? { code: "timeout", message: copy.timeout }
    : { code: "network", message: copy.network };
}

export function withRetryHint(failure: ApiFailure): string {
  if (failure.code !== "rate_limited") return failure.message;
  if (!failure.retryAfter) return `${failure.message} Try a sample receipt instead.`;
  const minutes = Math.max(1, Math.ceil(failure.retryAfter / 60));
  return `${failure.message} Try again in ${minutes} minute${minutes === 1 ? "" : "s"}, or use a sample receipt.`;
}
