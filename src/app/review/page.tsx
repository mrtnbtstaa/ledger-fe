"use client";

import Link from "next/link";
import { useState } from "react";
import { EmptyState } from "@/components/common/EmptyState";
import { ErrorState } from "@/components/common/ErrorState";
import { Pagination } from "@/components/common/Pagination";
import { ReceiptList } from "@/components/history/ReceiptList";
import { useReceipts } from "@/hooks/useReceipts";
import { withRetryHint } from "@/lib/api/errors";
import { config } from "@/lib/config";

const PAGE_SIZE = 10;
const field = "min-h-11 rounded-sm border border-line bg-surface px-2 text-sm";

export default function ReviewPage() {
  const [query, setQuery] = useState("");
  const [offset, setOffset] = useState(0);
  const list = useReceipts({
    status: "needs_review",
    q: query.trim() || undefined,
    sort: "date",
    order: "desc",
    limit: PAGE_SIZE,
    offset,
  });

  const total = list.data?.total ?? 0;
  const first = total === 0 ? 0 : offset + 1;
  const last = Math.min(offset + PAGE_SIZE, total);

  return (
    <div className="mx-auto w-full max-w-[1080px] px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="font-serif text-3xl">Review queue</h1>
      <p className="mt-1 max-w-[65ch] text-ink-muted">
        Receipts where a check failed or confidence stayed below{" "}
        {config.confidenceThreshold.toFixed(2)}. Correct the fields, then approve or reject. This
        queue is shared by everyone using the demo.
      </p>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <label className="flex items-center gap-2 text-sm text-ink-muted">
          Search
          <input
            type="search"
            maxLength={100}
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setOffset(0);
            }}
            placeholder="Vendor or file name"
            className={`${field} w-56`}
          />
        </label>
      </div>

      <div className="mt-4">
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
        ) : (
          <ReceiptList items={list.data?.items ?? []} showReason />
        )}
      </div>

      <p className="mt-4 text-sm text-ink-muted">
        {total === 0 ? "0 receipts" : `Showing ${first}–${last} of ${total} receipts`}
      </p>
      <Pagination total={total} limit={PAGE_SIZE} offset={offset} onChange={setOffset} />
    </div>
  );
}
