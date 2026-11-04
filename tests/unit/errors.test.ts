import { describe, expect, it } from "vitest";
import { normalizeError, transportError, withRetryHint } from "@/lib/api/errors";

describe("normalizeError", () => {
  it("explains an oversized file in the visitor's terms", () => {
    expect(normalizeError(413, undefined).message).toContain("5 MB");
  });

  it("reads the retry delay off a rate limit", () => {
    const failure = normalizeError(429, { error: { code: "rate_limited", message: "slow down", retryAfter: 120 } });
    expect(failure).toMatchObject({ code: "rate_limited", retryAfter: 120 });
  });

  it("never forwards a server message", () => {
    const failure = normalizeError(500, { error: { code: "boom", message: "Traceback: ZeroDivisionError" } });
    expect(failure.message).not.toContain("Traceback");
    expect(failure.code).toBe("server");
  });
});

describe("failure copy", () => {
  it("turns a retry delay into minutes", () => {
    const message = withRetryHint({ code: "rate_limited", message: "Limit reached.", retryAfter: 120 });
    expect(message).toContain("2 minutes");
  });

  it("distinguishes a timeout from a dropped connection", () => {
    expect(transportError(new DOMException("slow", "TimeoutError")).code).toBe("timeout");
    expect(transportError(new TypeError("failed to fetch")).code).toBe("network");
  });
});
