"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api, writeSignal } from "@/lib/api/client";
import { call } from "@/lib/api/call";
import type { ApiFailure } from "@/lib/api/errors";
import type { ExtractedData, Receipt } from "@/lib/api/types";

function useReceiptMutation<TArgs>(id: string, run: (args: TArgs) => Promise<Receipt>) {
  const queryClient = useQueryClient();
  return useMutation<Receipt, ApiFailure, TArgs>({
    mutationFn: run,
    onSuccess: (receipt) => {
      queryClient.setQueryData(["receipt", id], receipt);
      void queryClient.invalidateQueries({ queryKey: ["receipts"] });
    },
  });
}

export function useSaveFields(id: string) {
  return useReceiptMutation<ExtractedData>(id, (data) =>
    call(() => api.PATCH("/receipts/{id}", { params: { path: { id } }, body: { data }, signal: writeSignal() })),
  );
}

export function useDecideReceipt(id: string) {
  return useReceiptMutation<"approve" | "reject">(id, (action) =>
    action === "approve"
      ? call(() => api.POST("/receipts/{id}/approve", { params: { path: { id } }, signal: writeSignal() }))
      : call(() => api.POST("/receipts/{id}/reject", { params: { path: { id } }, signal: writeSignal() })),
  );
}
