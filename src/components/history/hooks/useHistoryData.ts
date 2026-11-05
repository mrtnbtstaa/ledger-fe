"use client";

import { useReceipts } from "@/hooks/useReceipts";
import type { ReceiptStatus } from "@/lib/api/types";
import { SortKey, sortOptions } from "../lib/sort-options";

const PAGE_SIZE = 10;
const CATEGORY_SAMPLE_LIMIT = 200;

type Params = {
  status: "all" | ReceiptStatus;
  category: string;
  query: string;
  sortKey: SortKey;
  offset: number;
};

export function useHistoryData({ status, category, query, sortKey, offset }: Params) {
  const { sort, order } = sortOptions[sortKey];

  // Full sample, only used to build the category dropdown.
  const everything = useReceipts({ sort, order, limit: CATEGORY_SAMPLE_LIMIT });

  // Paged, filtered list actually rendered.
  const list = useReceipts({
    status: status === "all" ? undefined : status,
    category: category || undefined,
    q: query.trim() || undefined,
    sort,
    order,
    limit: PAGE_SIZE,
    offset,
  });

  const categories = [
    ...new Set(
      (everything.data?.items ?? [])
        .map((item) => item.category)
        .filter((value): value is string => Boolean(value)),
    ),
  ].sort();

  const total = list.data?.total ?? 0;
  const first = total === 0 ? 0 : offset + 1;
  const last = Math.min(offset + PAGE_SIZE, total);

  return { everything, list, categories, total, first, last, pageSize: PAGE_SIZE };
}