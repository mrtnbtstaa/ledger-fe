import { renderHook, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

const loadProvider = async () => {
  vi.stubEnv("NEXT_PUBLIC_API_URL", "http://backend.test");
  vi.stubEnv("NEXT_PUBLIC_USE_MOCK", "0");
  vi.resetModules();
  return import("@/components/backend-status/BackendStatusProvider");
};

describe("BackendStatusProvider", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.unstubAllEnvs();
  });

  it("moves to waking when the health probe does not answer", async () => {
    vi.stubGlobal("fetch", vi.fn(() => Promise.reject(new TypeError("failed to fetch"))));
    const { BackendStatusProvider, useBackendStatus } = await loadProvider();

    const { result } = renderHook(() => useBackendStatus(), {
      wrapper: ({ children }) => <BackendStatusProvider>{children}</BackendStatusProvider>,
    });

    expect(result.current.status).toBe("unknown");
    await waitFor(() => expect(result.current.status).toBe("waking"));
    expect(vi.mocked(fetch)).toHaveBeenCalledWith("http://backend.test/health", expect.anything());
  });

  it("becomes ready without a refresh once the probe answers", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(() => Promise.resolve(new Response(JSON.stringify({ status: "ok" }), { status: 200 }))),
    );
    const { BackendStatusProvider, useBackendStatus } = await loadProvider();

    const { result } = renderHook(() => useBackendStatus(), {
      wrapper: ({ children }) => <BackendStatusProvider>{children}</BackendStatusProvider>,
    });

    await waitFor(() => expect(result.current.status).toBe("ready"));
  });
});
