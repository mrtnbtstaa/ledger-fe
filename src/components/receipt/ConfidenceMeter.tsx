import { config } from "@/lib/config";
import { formatConfidence } from "@/lib/format";
import { Missing } from "@/components/ui/missing";

const SEGMENTS = 10;

export function ConfidenceMeter({ value }: { value: number | null }) {
  if (value === null) {
    return (
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.06em] text-ink-muted">Confidence</p>
        <p className="mt-1 text-sm">
          <Missing />
        </p>
      </div>
    );
  }

  const aboveThreshold = value >= config.confidenceThreshold;
  const filled = Math.round(value * SEGMENTS);

  return (
    <div>
      <div className="flex items-baseline justify-between gap-3">
        <span className="text-xs font-semibold uppercase tracking-[0.06em] text-ink-muted">Confidence</span>
        <span className="font-mono text-sm tabular-nums">{formatConfidence(value)}</span>
      </div>
      <div
        className="mt-2 flex gap-1"
        role="img"
        aria-label={`Confidence ${formatConfidence(value)}, ${aboveThreshold ? "at or above" : "below"} the ${config.confidenceThreshold.toFixed(2)} review threshold`}
      >
        {Array.from({ length: SEGMENTS }, (_, index) => (
          <span
            key={index}
            className={`h-1.5 flex-1 rounded-full ${
              index < filled ? (aboveThreshold ? "bg-accent" : "bg-warning") : "bg-line"
            }`}
          />
        ))}
      </div>
      <p className="mt-1 text-xs text-ink-muted">Review threshold {config.confidenceThreshold.toFixed(2)}</p>
    </div>
  );
}
