"use client";

import { useBackendStatus } from "@/components/backend-status/BackendStatusProvider";
import { ErrorState } from "@/components/common/ErrorState";
import { PrivacyNotice } from "@/components/common/PrivacyNotice";
import { SampleColumn } from "@/components/home/SampleColumn";
import { UploadColumn } from "@/components/home/UploadColumn";
import { withRetryHint } from "@/lib/api/errors";
import { statusAnnouncement } from "@/lib/status";
import { useReceiptSubmission } from "../hooks/useReceiptSubmission";
import { ReceiptResult } from "../ReceiptResult";

export const Content = () => {
  const { status } = useBackendStatus();
  const blocked = status !== "ready";

  const {
    active,
    processSample,
    upload,
    fileError,
    onSelect,
    pickSample,
    failure,
    retry,
    retryLabel,
  } = useReceiptSubmission();

  return (
    <div className="mx-auto w-full max-w-[1080px] px-4 py-8 sm:px-6 lg:px-8">
      <p className="sr-only" role="status">
        {active.data ? statusAnnouncement(active.data) : ""}
      </p>

      <h1 className="max-w-[24ch] font-serif text-[2rem] leading-[1.1] tracking-[-0.01em] sm:text-4xl lg:text-[3.25rem]">
        A receipt photo in. Checked data out.
      </h1>
      <p className="mt-4 max-w-[65ch] text-ink-muted">
        Open a sample or upload your own, and see the fields the model extracted, the arithmetic it verified, and what
        still needs a person.
      </p>

      <div className="mt-6">
        <PrivacyNotice />
      </div>

      {blocked ? (
        <p className="mt-4 text-sm text-ink-muted" role="status">
          Sample and upload unlock as soon as the server is ready. You can read the pages meanwhile.
        </p>
      ) : null}

      <div className="mt-8 grid gap-8 lg:grid-cols-2">
        <SampleColumn
          enabled={!blocked}
          disabled={blocked}
          onPick={pickSample}
          pendingId={processSample.isPending ? (processSample.variables ?? null) : null}
        />
        <UploadColumn
          onSelect={onSelect}
          disabled={blocked}
          busy={upload.isPending}
          error={fileError}
        />
      </div>

      {failure ? (
        <div className="mt-6">
          <ErrorState
            title="That request did not finish"
            message={withRetryHint(failure)}
            onRetry={retry}
            retryLabel={retryLabel}
          />
        </div>
      ) : null}

      {active.data ? <ReceiptResult receipt={active.data} /> : null}
    </div>
  );
}