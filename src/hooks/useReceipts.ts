"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { api, readSignal } from "@/lib/api/client";
import { call } from "@/lib/api/call";
import type { ApiFailure } from "@/lib/api/errors";
import type { ReceiptList, ReceiptStatus } from "@/lib/api/types";

export type ReceiptFilters = {
  status?: ReceiptStatus;
  category?: string;
  q?: string;
  sort?: "date" | "total";
  order?: "asc" | "desc";
  limit?: number;
  offset?: number;
};

export function useReceipts(filters: ReceiptFilters) {
  return useQuery<ReceiptList, ApiFailure>({
    queryKey: ["receipts", filters],
    placeholderData: keepPreviousData,
    queryFn: () =>
      call(() =>
        api.GET("/receipts", {
          params: {
            query: {
              status: filters.status,
              category: filters.category,
              q: filters.q,
              sort: filters.sort,
              order: filters.order,
              limit: filters.limit,
              offset: filters.offset,
            },
          },
          signal: readSignal(),
        }),
      ),
  });
}
