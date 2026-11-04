"use client";

import { ArrowRight } from "lucide-react";
import type { Sample } from "@/lib/api/types";

type SamplePickerProps = {
  samples: Sample[];
  onPick: (sampleId: string) => void;
  disabled: boolean;
  pendingId: string | null;
};

export function SamplePicker({ samples, onPick, disabled, pendingId }: SamplePickerProps) {
  return (
    <ul className="grid gap-2 sm:grid-cols-3">
      {samples.map((sample) => {
        const pending = pendingId === sample.id;
        return (
          <li key={sample.id}>
            <button
              type="button"
              onClick={() => onPick(sample.id)}
              disabled={disabled}
              className="flex h-full w-full flex-col rounded-md border border-line bg-surface p-4 text-left hover:border-accent disabled:cursor-not-allowed disabled:opacity-50"
            >
              <span className="font-semibold">{sample.label}</span>
              <span className="mt-1 flex-1 text-sm text-ink-muted">{sample.description}</span>
              <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-[0.06em] text-accent">
                {pending ? "Processing…" : "Try it"}
                <ArrowRight className="size-3.5" aria-hidden />
              </span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}
