"use client";

import Link from "next/link";
import { EmptyState } from "@/components/common/EmptyState";
import { ErrorState } from "@/components/common/ErrorState";
import { ReceiptList } from "@/components/history/ReceiptList";
import { withRetryHint } from "@/lib/api/errors";
import type { useReceipts } from "@/hooks/useReceipts";

type ReceiptsQuery = ReturnType<typeof useReceipts>;

export function ReviewResults({ list, query }: { list: ReceiptsQuery; query: string }) {
  if (list.isPending) {
    return <p className="text-sm text-ink-muted">Loading the queue…</p>;
  }

  if (list.error) {
    return (
      <ErrorState
        title="The queue could not load"
        message={withRetryHint(list.error)}
        onRetry={() => void list.refetch()}
      />
    );
  }

  const items = list.data?.items ?? [];
  if (items.length === 0) {
    return (
      <EmptyState>
        {query.trim() ? (
          "No receipts match this search."
        ) : (
          <>
            Nothing is waiting for review.{" "}
            <Link href="/" className="text-accent underline">
              Process a receipt
            </Link>{" "}
            and it will appear here.
          </>
        )}
      </EmptyState>
    );
  }

  return <ReceiptList items={items} showReason />;
}