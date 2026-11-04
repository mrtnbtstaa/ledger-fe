"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { config } from "@/lib/config";

export type BackendStatus = "unknown" | "waking" | "ready" | "unreachable";

type BackendStatusValue = { status: BackendStatus; waitedMs: number; retry: () => void };

const BackendStatusContext = createContext<BackendStatusValue | null>(null);

const RETRY_DELAYS_MS = [2000, 3000, 5000];
const PROBE_TIMEOUT_MS = 3000;
const GIVE_UP_MS = 90_000;

/** Pings /health on load so a sleeping backend wakes while the visitor reads the page (D3). */
export function BackendStatusProvider({ children }: { children: React.ReactNode }) {
  const [status, setStatus] = useState<BackendStatus>(config.useMock ? "ready" : "unknown");
  const [waitedMs, setWaitedMs] = useState(0);
  const [attempt, setAttempt] = useState(0);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    if (config.useMock) return;

    let cancelled = false;
    let step = 0;
    const startedAt = Date.now();

    const probe = async () => {
      try {
        const response = await fetch(`${config.apiUrl}/health`, {
          cache: "no-store",
          signal: AbortSignal.timeout?.(PROBE_TIMEOUT_MS),
        });
        if (cancelled) return;
        if (response.ok) {
          setStatus("ready");
          return;
        }
      } catch {
        // No answer inside the probe timeout: treat it as still waking.
      }
      if (cancelled) return;

      const elapsed = Date.now() - startedAt;
      setWaitedMs(elapsed);
      if (elapsed >= GIVE_UP_MS) {
        setStatus("unreachable");
        return;
      }
      setStatus("waking");
      const delay = RETRY_DELAYS_MS[Math.min(step, RETRY_DELAYS_MS.length - 1)]!;
      step += 1;
      timers.current.push(setTimeout(() => void probe(), delay));
    };

    void probe();

    return () => {
      cancelled = true;
      timers.current.forEach(clearTimeout);
      timers.current = [];
    };
  }, [attempt]);

  const retry = useCallback(() => {
    setStatus("unknown");
    setWaitedMs(0);
    setAttempt((value) => value + 1);
  }, []);

  return (
    <BackendStatusContext.Provider value={{ status, waitedMs, retry }}>
      {children}
    </BackendStatusContext.Provider>
  );
}

export function useBackendStatus(): BackendStatusValue {
  const value = useContext(BackendStatusContext);
  if (!value) throw new Error("useBackendStatus must be used inside BackendStatusProvider");
  return value;
}
