"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { ErrorState } from "@/components/common/ErrorState";
import { ConfidenceMeter } from "@/components/receipt/ConfidenceMeter";
import { FilePreview } from "@/components/receipt/FilePreview";
import { ProcessingStepper } from "@/components/receipt/ProcessingStepper";
import { StatusBadge } from "@/components/receipt/StatusBadge";
import { ValidationChecks } from "@/components/receipt/ValidationChecks";
import { ReviewEditForm } from "@/components/review/ReviewEditForm";
import { useReceipt } from "@/hooks/useReceipt";
import { withRetryHint } from "@/lib/api/errors";
import { formatDate } from "@/lib/format";
import { Missing } from "@/components/ui/missing";

export default function ReviewDetailPage() {
  const params = useParams<{ id: string }>();
  const id = typeof params?.id === "string" ? params.id : null;
  const receipt = useReceipt(id);
  const detail = receipt.data;

  return (
    <div className="mx-auto w-full max-w-[1080px] px-4 py-8 sm:px-6 lg:px-8">
      <p className="text-sm">
        <Link href="/review" className="text-accent underline">
          Back to the queue
        </Link>
      </p>

      {receipt.isPending ? (
        <p className="mt-6 text-sm text-ink-muted">Loading the receipt…</p>
      ) : receipt.error ? (
        <div className="mt-6">
          <ErrorState
            title="That receipt could not load"
            message={withRetryHint(receipt.error)}
            onRetry={() => void receipt.refetch()}
          />
        </div>
      ) : detail ? (
        <>
          <header className="mt-4 flex flex-wrap items-start justify-between gap-3 border-b border-line pb-4">
            <div className="min-w-0">
              <h1 className="font-serif text-3xl leading-tight">{detail.data?.vendor ?? <Missing />}</h1>
              <p className="mt-1 text-sm text-ink-muted">
                <span className="font-mono tabular-nums">
                  {detail.data?.date ? formatDate(detail.data.date) : <Missing />}
                </span>{" "}
                · <span className="truncate font-mono">{detail.filename}</span>
              </p>
            </div>
            <StatusBadge status={detail.status} />
          </header>

          {detail.status === "processing" ? (
            <div className="mt-6 rounded-md border border-line bg-surface p-4">
              <ProcessingStepper stage={detail.stage ?? "uploading"} />
            </div>
          ) : null}

          <div className="mt-6 grid gap-8 lg:grid-cols-2 lg:items-start">
            <div className="space-y-6">
              <FilePreview receipt={detail} />
              <section aria-labelledby="checks-heading" className="rounded-md border border-line bg-surface p-4">
                <h2 id="checks-heading" className="text-xs font-semibold uppercase tracking-[0.06em] text-ink-muted">
                  Checks
                </h2>
                <div className="mt-3">
                  <ValidationChecks checks={detail.checks} />
                </div>
                <div className="mt-4 border-t border-line pt-4">
                  <ConfidenceMeter value={detail.confidence} />
                </div>
              </section>
            </div>

            <ReviewEditForm receipt={detail} />
          </div>
        </>
      ) : null}
    </div>
  );
}
