"use client";

import { Camera, Upload } from "lucide-react";
import { useRef, useState } from "react";
import { buttonClass } from "@/components/ui/button";
import { config } from "@/lib/config";

type DropzoneProps = {
  onSelect: (file: File) => void;
  disabled: boolean;
  busy: boolean;
  error: string | null;
};

export function Dropzone({ onSelect, disabled, busy, error }: DropzoneProps) {
  const [dragging, setDragging] = useState(false);
  const picker = useRef<HTMLInputElement>(null);
  const camera = useRef<HTMLInputElement>(null);

  const take = (files: FileList | null) => {
    const file = files?.[0];
    if (file) onSelect(file);
  };

  return (
    <div>
      <div
        onDragOver={(event) => {
          event.preventDefault();
          if (!disabled) setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(event) => {
          event.preventDefault();
          setDragging(false);
          if (!disabled) take(event.dataTransfer.files);
        }}
        className={`rounded-md border-solid p-6 sm:p-10 ${
          dragging ? "border-[1.5px] border-accent bg-accent-soft" : "border-[1.5px] border-dashed border-line bg-surface-sunken"
        }`}
      >
        <p className="text-[0.95rem]">Drop a receipt here, or choose a file.</p>
        <p className="mt-1 text-sm text-ink-muted">
          JPG, PNG, or PDF up to {Math.round(config.maxUploadBytes / (1024 * 1024))} MB. PDFs are read from the first
          page only.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <button
            type="button"
            className={buttonClass()}
            onClick={() => picker.current?.click()}
            disabled={disabled || busy}
          >
            <Upload className="size-4" aria-hidden />
            {busy ? "Uploading…" : "Choose a file"}
          </button>
          <button
            type="button"
            className={buttonClass("secondary")}
            onClick={() => camera.current?.click()}
            disabled={disabled || busy}
          >
            <Camera className="size-4" aria-hidden />
            Take a photo
          </button>
        </div>
      </div>

      <input
        ref={picker}
        type="file"
        accept="image/jpeg,image/png,application/pdf"
        data-testid="file-input"
        className="sr-only"
        tabIndex={-1}
        aria-hidden
        onChange={(event) => {
          take(event.target.files);
          event.target.value = "";
        }}
      />
      <input
        ref={camera}
        type="file"
        accept="image/*"
        capture="environment"
        className="sr-only"
        tabIndex={-1}
        aria-hidden
        onChange={(event) => {
          take(event.target.files);
          event.target.value = "";
        }}
      />

      {error ? (
        <p role="alert" className="mt-2 text-sm text-danger">
          {error}
        </p>
      ) : null}
    </div>
  );
}
