"use client";

import { Dropzone } from "@/components/upload/Dropzone";
import { config } from "@/lib/config";

type Props = {
  onSelect: (file: File) => void;
  disabled: boolean;
  busy: boolean;
  error: string | null;
};

export function UploadColumn({ onSelect, disabled, busy, error }: Props) {
  return (
    <section aria-labelledby="upload-heading">
      <h2 id="upload-heading" className="font-serif text-2xl">
        Upload your own
      </h2>
      <p className="mt-1 text-sm text-ink-muted">
        A phone photo works. Files are deleted after {config.retentionHours} hours.
      </p>
      <div className="mt-3">
        <Dropzone onSelect={onSelect} disabled={disabled} busy={busy} error={error} />
      </div>
    </section>
  );
}