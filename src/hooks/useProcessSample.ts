"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api, readSignal, writeSignal } from "@/lib/api/client";
import { call } from "@/lib/api/call";
import type { ApiFailure } from "@/lib/api/errors";
import type { Receipt, Sample } from "@/lib/api/types";

export function useSamples() {
  return useQuery<Sample[], ApiFailure>({
    queryKey: ["samples"],
    queryFn: () => call(() => api.GET("/samples", { signal: readSignal() })),
    staleTime: Infinity,
  });
}

export function useProcessSample() {
  const queryClient = useQueryClient();
  return useMutation<Receipt, ApiFailure, string>({
    mutationFn: (sampleId: string) =>
      call(() =>
        api.POST("/samples/{sampleId}/process", {
          params: { path: { sampleId } },
          signal: writeSignal(),
        }),
      ),
    onSuccess: (receipt: Receipt) => queryClient.setQueryData(["receipt", receipt.id], receipt),
  });
}
