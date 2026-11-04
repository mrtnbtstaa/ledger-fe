"use client";

import { useQuery } from "@tanstack/react-query";
import { api, readSignal } from "@/lib/api/client";
import { call } from "@/lib/api/call";
import type { ApiFailure } from "@/lib/api/errors";
import type { Receipt } from "@/lib/api/types";

const POLL_MS = 1500;

/** Polls while the backend reports a processing stage, then stops (D4). */
export function useReceipt(id: string | null) {
  return useQuery<Receipt, ApiFailure>({
    queryKey: ["receipt", id],
    queryFn: () =>
      call(() => api.GET("/receipts/{id}", { params: { path: { id: id! } }, signal: readSignal() })),
    enabled: Boolean(id),
    refetchInterval: (query) => (query.state.data?.status === "processing" ? POLL_MS : false),
  });
}
