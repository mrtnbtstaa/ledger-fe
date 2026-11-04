"use client";

import { useQuery } from "@tanstack/react-query";
import { api, readSignal } from "@/lib/api/client";
import { call } from "@/lib/api/call";
import type { ApiFailure } from "@/lib/api/errors";
import type { ReceiptList, ReceiptStatus } from "@/lib/api/types";

export type ReceiptFilters = {
  status?: ReceiptStatus;
  category?: string;
  sort?: "date" | "total";
  order?: "asc" | "desc";
};

export function useReceipts(filters: ReceiptFilters) {
  return useQuery<ReceiptList, ApiFailure>({
    queryKey: ["receipts", filters],
    queryFn: () =>
      call(() =>
        api.GET("/receipts", {
          params: {
            query: {
              status: filters.status,
              category: filters.category,
              sort: filters.sort,
              order: filters.order,
            },
          },
          signal: readSignal(),
        }),
      ),
  });
}
