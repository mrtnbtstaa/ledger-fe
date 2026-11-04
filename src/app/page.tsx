"use client";

import Link from "next/link";
import { useState } from "react";
import { useBackendStatus } from "@/components/backend-status/BackendStatusProvider";
import { ErrorState } from "@/components/common/ErrorState";
import { PrivacyNotice } from "@/components/common/PrivacyNotice";
import { ConfidenceMeter } from "@/components/receipt/ConfidenceMeter";
import { FilePreview } from "@/components/receipt/FilePreview";
import { ProcessingStepper } from "@/components/receipt/ProcessingStepper";
import { ResultCard } from "@/components/receipt/ResultCard";
import { ValidationChecks } from "@/components/receipt/ValidationChecks";
import { Dropzone } from "@/components/upload/Dropzone";
import { SamplePicker } from "@/components/upload/SamplePicker";
import { useProcessSample, useSamples } from "@/hooks/useProcessSample";
import { useReceipt } from "@/hooks/useReceipt";
import { useUploadReceipt } from "@/hooks/useUploadReceipt";
import { withRetryHint } from "@/lib/api/errors";
import { config } from "@/lib/config";
import { statusAnnouncement } from "@/lib/status";
import { validateFile } from "@/lib/validation/file";

export default function HomePage() {
  const { status } = useBackendStatus();
  const ready = status === "ready";

  const samples = useSamples();
  const processSample = useProcessSample();
  const upload = useUploadReceipt();

  const [receiptId, setReceiptId] = useState<string | null>(null);
  const [selected, setSelected] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);

  const active = useReceipt(receiptId);

  const startUpload = (file: File) => {
    setReceiptId(null);
    upload.mutate(file, { onSuccess: (created) => setReceiptId(created.id) });
  };

  const onSelect = (file: File) => {
    const problem = validateFile(file);
    setFileError(problem);
    if (problem) return;
    setSelected(file);
    startUpload(file);
  };

  const failure = upload.error ?? processSample.error ?? active.error;
  const retry =
    upload.error && selected
      ? () => startUpload(selected)
      : active.error
        ? () => void active.refetch()
        : undefined;

  const blocked = !ready;

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
        <section aria-labelledby="samples-heading">
          <h2 id="samples-heading" className="font-serif text-2xl">
            Try a sample
          </h2>
          <p className="mt-1 text-sm text-ink-muted">No receipt needed. One sample is built to fail a check.</p>
          <div className="mt-3">
            {samples.isPending ? (
              <p className="text-sm text-ink-muted">Loading samples…</p>
            ) : samples.error ? (
              <ErrorState
                title="Samples are unavailable"
                message={withRetryHint(samples.error)}
                onRetry={() => void samples.refetch()}
              />
            ) : (
              <SamplePicker
                samples={samples.data ?? []}
                onPick={(sampleId) => {
                  setReceiptId(null);
                  processSample.mutate(sampleId, { onSuccess: (created) => setReceiptId(created.id) });
                }}
                disabled={blocked}
                pendingId={processSample.isPending ? (processSample.variables ?? null) : null}
              />
            )}
          </div>
        </section>

        <section aria-labelledby="upload-heading">
          <h2 id="upload-heading" className="font-serif text-2xl">
            Upload your own
          </h2>
          <p className="mt-1 text-sm text-ink-muted">
            A phone photo works. Files are deleted after {config.retentionHours} hours.
          </p>
          <div className="mt-3">
            <Dropzone onSelect={onSelect} disabled={blocked} busy={upload.isPending} error={fileError} />
          </div>
        </section>
      </div>

      {failure ? (
        <div className="mt-6">
          <ErrorState
            title="That request did not finish"
            message={withRetryHint(failure)}
            onRetry={retry}
            retryLabel={upload.error ? "Upload again" : "Try again"}
          />
        </div>
      ) : null}

      {active.data ? (
        <section className="mt-10">
          {active.data.status === "processing" ? (
            <div className="rounded-md border border-line bg-surface p-4">
              <ProcessingStepper stage={active.data.stage ?? "uploading"} />
            </div>
          ) : null}

          <div className="mt-6 grid gap-6 lg:grid-cols-[3fr_2fr] lg:items-start">
            <ResultCard receipt={active.data} />
            <aside className="space-y-6 lg:sticky lg:top-6">
              <div className="rounded-md border border-line bg-surface p-4">
                <h2 className="text-xs font-semibold uppercase tracking-[0.06em] text-ink-muted">Checks</h2>
                <div className="mt-3">
                  <ValidationChecks checks={active.data.checks} />
                </div>
                <div className="mt-4 border-t border-line pt-4">
                  <ConfidenceMeter value={active.data.confidence} />
                </div>
              </div>
              <FilePreview receipt={active.data} />
            </aside>
          </div>

          {active.data.status === "needs_review" ? (
            <p className="mt-6 text-sm text-ink-muted">
              This one needs a person.{" "}
              <Link href={`/review/${active.data.id}`} className="text-accent underline">
                Open it in the review queue
              </Link>
              .
            </p>
          ) : null}
        </section>
      ) : null}
    </div>
  );
}
