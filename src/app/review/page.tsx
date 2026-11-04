"use client";

import Link from "next/link";
import { EmptyState } from "@/components/common/EmptyState";
import { ErrorState } from "@/components/common/ErrorState";
import { ReceiptList } from "@/components/history/ReceiptList";
import { useReceipts } from "@/hooks/useReceipts";
import { withRetryHint } from "@/lib/api/errors";
import { config } from "@/lib/config";

export default function ReviewPage() {
  const list = useReceipts({ status: "needs_review", sort: "date", order: "desc" });

  return (
    <div className="mx-auto w-full max-w-[1080px] px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="font-serif text-3xl">Review queue</h1>
      <p className="mt-1 max-w-[65ch] text-ink-muted">
        Receipts where a check failed or confidence stayed below {config.confidenceThreshold.toFixed(2)}. Correct the
        fields, then approve or reject. This queue is shared by everyone using the demo.
      </p>

      <div className="mt-6">
        {list.isPending ? (
          <p className="text-sm text-ink-muted">Loading the queue…</p>
        ) : list.error ? (
          <ErrorState
            title="The queue could not load"
            message={withRetryHint(list.error)}
            onRetry={() => void list.refetch()}
          />
        ) : (list.data?.items.length ?? 0) === 0 ? (
          <EmptyState>
            Nothing is waiting for review.{" "}
            <Link href="/" className="text-accent underline">
              Process a receipt
            </Link>{" "}
            and it will appear here.
          </EmptyState>
        ) : (
          <ReceiptList items={list.data?.items ?? []} showReason />
        )}
      </div>
    </div>
  );
}
