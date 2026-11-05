"use client";

import { ErrorState } from "@/components/common/ErrorState";
import { SamplePicker } from "@/components/upload/SamplePicker";
import { useSamples } from "@/hooks/useProcessSample";
import { withRetryHint } from "@/lib/api/errors";

type Props = {
  enabled: boolean;
  disabled: boolean;
  onPick: (sampleId: string) => void;
  pendingId: string | null;
};

export function SampleColumn({ enabled, disabled, onPick, pendingId }: Props) {
  const samples = useSamples(enabled);

  return (
    <section aria-labelledby="samples-heading">
      <h2 id="samples-heading" className="font-serif text-2xl">
        Try a sample
      </h2>
      <p className="mt-1 text-sm text-ink-muted">No receipt needed. One sample is built to fail a check.</p>
      <div className="mt-3">
        {samples.isPending ? (
          <p className="text-sm text-ink-muted">Loading samples…</p>
        ) : samples.error ? (
          <ErrorState
            title="Samples are unavailable"
            message={withRetryHint(samples.error)}
            onRetry={() => void samples.refetch()}
          />
        ) : (
          <SamplePicker
            samples={samples.data ?? []}
            onPick={onPick}
            disabled={disabled}
            pendingId={pendingId}
          />
        )}
      </div>
    </section>
  );
}