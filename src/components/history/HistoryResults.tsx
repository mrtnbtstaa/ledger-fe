"use client";

import Link from "next/link";
import { EmptyState } from "@/components/common/EmptyState";
import { ErrorState } from "@/components/common/ErrorState";
import { ReceiptList } from "@/components/history/ReceiptList";
import { withRetryHint } from "@/lib/api/errors";
import type { useReceipts } from "@/hooks/useReceipts";

type ReceiptsQuery = ReturnType<typeof useReceipts>;

export const HistoryResults = ({ list }: { list: ReceiptsQuery }) => {
  if (list.isPending) {
    return <p className="text-sm text-ink-muted">Loading receipts…</p>;
  }

  if (list.error) {
    return (
      <ErrorState
        title="History could not load"
        message={withRetryHint(list.error)}
        onRetry={() => void list.refetch()}
      />
    );
  }

  const items = list.data?.items ?? [];
  if (items.length === 0) {
    return (
      <EmptyState>
        No receipts match these filters.{" "}
        <Link href="/" className="text-accent underline">
          Try a sample
        </Link>
        .
      </EmptyState>
    );
  }

  return <ReceiptList items={items} />;
}