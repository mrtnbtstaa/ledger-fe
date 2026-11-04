"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api, writeSignal } from "@/lib/api/client";
import { call } from "@/lib/api/call";
import type { ApiFailure } from "@/lib/api/errors";
import type { Receipt } from "@/lib/api/types";

export function useUploadReceipt() {
  const queryClient = useQueryClient();
  return useMutation<Receipt, ApiFailure, File>({
    mutationFn: (file: File) =>
      call(() =>
        api.POST("/upload", {
          // Placeholder value: the serializer below builds the multipart payload from the real file.
          body: { file: "" },
          bodySerializer: () => {
            const form = new FormData();
            form.append("file", file);
            return form;
          },
          signal: writeSignal(),
        }),
      ),
    onSuccess: (receipt: Receipt) => queryClient.setQueryData(["receipt", receipt.id], receipt),
  });
}
