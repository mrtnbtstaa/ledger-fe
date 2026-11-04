export type ApiFailure = { code: string; message: string; retryAfter?: number };

const copy: Record<string, string> = {
  too_large: "That file is larger than 5 MB. Choose a smaller file or take a new photo.",
  unsupported_type: "That file type is not supported. Use a JPG, PNG, or PDF.",
  too_many_pages: "That PDF has too many pages. Use a PDF with 3 pages or fewer.",
  rate_limited: "The demo has reached its processing limit for now.",
  not_found: "That receipt no longer exists. It may have been removed after the retention period.",
  conflict: "This receipt has already been decided, so that action is no longer available.",
  invalid: "Some fields were rejected. Check the highlighted values and save again.",
  unauthorized: "This action needs the review passcode.",
  server: "The server could not finish the request. Try again, or use a sample receipt.",
  network: "Could not reach the server. Check your connection and try again.",
  timeout: "The server took too long to answer. Try again.",
};

const byStatus: Record<number, string> = {
  400: "invalid",
  401: "unauthorized",
  404: "not_found",
  409: "conflict",
  413: "too_large",
  415: "unsupported_type",
  422: "invalid",
  429: "rate_limited",
};

const byCode: Record<string, string> = {
  invalid_file_type: "unsupported_type",
  file_too_large: "too_large",
  too_many_pages: "too_many_pages",
  empty_file: "invalid",
  receipt_not_found: "not_found",
  file_expired: "not_found",
  invalid_state: "conflict",
  rate_limited: "rate_limited",
  validation_error: "invalid",
  unauthorized: "unauthorized",
  internal_error: "server",
};

export function normalizeError(status: number, body: unknown): ApiFailure {
  const detail =
    body && typeof body === "object" && "error" in body
      ? (body as { error?: { code?: unknown; retryAfter?: unknown } }).error
      : undefined;
  const backendCode = typeof detail?.code === "string" ? detail.code : undefined;
  const code = (backendCode ? byCode[backendCode] : undefined) ?? byStatus[status] ?? "server";
  const retryAfter = Number(detail?.retryAfter) || undefined;
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
