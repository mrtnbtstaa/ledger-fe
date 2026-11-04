"use client";

import Link from "next/link";
import { useState } from "react";
import { EmptyState } from "@/components/common/EmptyState";
import { ErrorState } from "@/components/common/ErrorState";
import { ReceiptList } from "@/components/history/ReceiptList";
import { useReceipts } from "@/hooks/useReceipts";
import { withRetryHint } from "@/lib/api/errors";
import type { ReceiptStatus } from "@/lib/api/types";
import { STATUS } from "@/lib/status";

const sortOptions = {
  "date-desc": { label: "Newest first", sort: "date", order: "desc" },
  "date-asc": { label: "Oldest first", sort: "date", order: "asc" },
  "total-desc": { label: "Highest total", sort: "total", order: "desc" },
  "total-asc": { label: "Lowest total", sort: "total", order: "asc" },
} as const;

type SortKey = keyof typeof sortOptions;

const select = "min-h-11 rounded-sm border border-line bg-surface px-2 text-sm";

export default function HistoryPage() {
  const [status, setStatus] = useState<"all" | ReceiptStatus>("all");
  const [category, setCategory] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("date-desc");
  const { sort, order } = sortOptions[sortKey];

  const everything = useReceipts({ sort, order });
  const list = useReceipts({
    status: status === "all" ? undefined : status,
    category: category || undefined,
    sort,
    order,
  });

  const categories = [
    ...new Set(
      (everything.data?.items ?? [])
        .map((item) => item.category)
        .filter((value): value is string => Boolean(value)),
    ),
  ].sort();

  return (
    <div className="mx-auto w-full max-w-[1080px] px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="font-serif text-3xl">History</h1>
      <p className="mt-1 max-w-[65ch] text-ink-muted">
        Every receipt processed in this demo. Anyone visiting sees the same list.
      </p>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <label className="flex items-center gap-2 text-sm text-ink-muted">
          Status
          <select className={select} value={status} onChange={(event) => setStatus(event.target.value as "all" | ReceiptStatus)}>
            <option value="all">All</option>
            {(Object.keys(STATUS) as ReceiptStatus[]).map((value) => (
              <option key={value} value={value}>
                {STATUS[value].label}
              </option>
            ))}
          </select>
        </label>
        <label className="flex items-center gap-2 text-sm text-ink-muted">
          Category
          <select className={select} value={category} onChange={(event) => setCategory(event.target.value)}>
            <option value="">All</option>
            {categories.map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </select>
        </label>
        <label className="flex items-center gap-2 text-sm text-ink-muted">
          Sort
          <select className={select} value={sortKey} onChange={(event) => setSortKey(event.target.value as SortKey)}>
            {Object.entries(sortOptions).map(([key, option]) => (
              <option key={key} value={key}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="mt-4">
        {list.isPending ? (
          <p className="text-sm text-ink-muted">Loading receipts…</p>
        ) : list.error ? (
          <ErrorState
            title="History could not load"
            message={withRetryHint(list.error)}
            onRetry={() => void list.refetch()}
          />
        ) : (list.data?.items.length ?? 0) === 0 ? (
          <EmptyState>
            No receipts match these filters.{" "}
            <Link href="/" className="text-accent underline">
              Try a sample
            </Link>
            .
          </EmptyState>
        ) : (
          <ReceiptList items={list.data?.items ?? []} />
        )}
      </div>

      <p className="mt-4 text-sm text-ink-muted">{list.data?.total ?? 0} receipts</p>
    </div>
  );
}
