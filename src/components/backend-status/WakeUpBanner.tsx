"use client";

import { config } from "@/lib/config";
import { useBackendStatus } from "./BackendStatusProvider";

/** In the page flow, not a modal: the visitor can read and browse while the server wakes (FR-021). */
export function WakeUpBanner() {
  const { status, waitedMs, retry } = useBackendStatus();
  if (status !== "waking" && status !== "unreachable") return null;

  return (
    <div className="mx-auto w-full max-w-[1080px] px-4 pt-4 sm:px-6 lg:px-8">
      {status === "unreachable" ? (
        <div
          role="alert"
          className="flex flex-wrap items-center gap-x-4 gap-y-2 rounded-sm border border-danger/40 bg-danger-soft px-4 py-3 text-sm text-danger"
        >
          <span className="flex-1">
            The server is not responding. Your connection is fine, so this is on our side.
            {config.demoVideoUrl ? " You can watch the same flow in the recorded demo." : ""}
          </span>
          <button
            type="button"
            onClick={retry}
            className="min-h-11 rounded-sm border border-danger px-3 font-semibold text-danger hover:bg-danger/10"
          >
            Try again
          </button>
          {config.demoVideoUrl ? (
            <a href={config.demoVideoUrl} target="_blank" rel="noreferrer" className="font-semibold underline">
              Watch the demo
            </a>
          ) : null}
        </div>
      ) : (
        <div role="status" aria-live="polite" className="rounded-sm border border-info/30 bg-info-soft px-4 py-3 text-sm text-info">
          <p>
            The server is waking up. This can take up to a minute on the first visit — the page is ready, uploads
            unlock on their own.
          </p>
          {waitedMs >= 45_000 && config.demoVideoUrl ? (
            <p className="mt-1">
              Taking longer than usual.{" "}
              <a href={config.demoVideoUrl} target="_blank" rel="noreferrer" className="font-semibold underline">
                Watch the recorded demo
              </a>{" "}
              instead.
            </p>
          ) : null}
          <div className="mt-2 h-0.5 overflow-hidden rounded-full bg-info/20" aria-hidden="true">
            <div className="h-full w-1/3 bg-info motion-safe:animate-pulse" />
          </div>
        </div>
      )}
    </div>
  );
}
