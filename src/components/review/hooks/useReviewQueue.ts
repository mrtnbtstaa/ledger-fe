"use client";

import { useReceipts } from "@/hooks/useReceipts";

const PAGE_SIZE = 10;

type Params = { query: string; offset: number };

export function useReviewQueue({ query, offset }: Params) {
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

  return { list, total, first, last, pageSize: PAGE_SIZE };
}