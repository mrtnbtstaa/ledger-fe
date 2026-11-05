"use client";

import { useState } from "react";
import { useProcessSample } from "@/hooks/useProcessSample";
import { useReceipt } from "@/hooks/useReceipt";
import { useUploadReceipt } from "@/hooks/useUploadReceipt";
import { validateFile } from "@/lib/validation/file";

export function useReceiptSubmission() {
  const processSample = useProcessSample();
  const upload = useUploadReceipt();

  const [receiptId, setReceiptId] = useState<string | null>(null);
  const [selected, setSelected] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);

  const active = useReceipt(receiptId);

  const startUpload = (file: File) => {
    setReceiptId(null);
    upload.mutate(file, { onSuccess: (created) => setReceiptId(created.id) });
  };

  const onSelect = (file: File) => {
    const problem = validateFile(file);
    setFileError(problem);
    if (problem) return;
    setSelected(file);
    startUpload(file);
  };

  const pickSample = (sampleId: string) => {
    setReceiptId(null);
    processSample.mutate(sampleId, { onSuccess: (created) => setReceiptId(created.id) });
  };

  const failure = upload.error ?? processSample.error ?? active.error;
  const retry =
    upload.error && selected
      ? () => startUpload(selected)
      : active.error
        ? () => void active.refetch()
        : undefined;
  const retryLabel = upload.error ? "Upload again" : "Try again";

  return {
    active,
    processSample,
    upload,
    selected,
    fileError,
    onSelect,
    pickSample,
    failure,
    retry,
    retryLabel,
  };
}