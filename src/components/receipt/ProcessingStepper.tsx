import { Check, LoaderCircle } from "lucide-react";
import type { ReceiptStage } from "@/lib/api/types";
import { STAGES, STAGE_LABELS } from "@/lib/status";

/** Four labelled steps on a rule: the pipeline stays visible instead of an endless spinner (FR-006). */
export function ProcessingStepper({ stage }: { stage: ReceiptStage }) {
  const activeIndex = STAGES.indexOf(stage);

  return (
    <ol className="grid grid-cols-4 gap-2" aria-label="Processing progress">
      {STAGES.map((step, index) => {
        const complete = index < activeIndex || stage === "done";
        const active = index === activeIndex && stage !== "done";
        return (
          <li key={step} className="min-w-0">
            <div className={`h-0.5 rounded-full ${complete || active ? "bg-accent" : "bg-line"}`} />
            <p
              className={`mt-2 flex items-center gap-1 text-xs ${
                active ? "font-semibold text-accent" : complete ? "text-ink" : "text-ink-muted"
              }`}
            >
              {complete ? (
                <Check className="size-3.5 shrink-0" aria-hidden />
              ) : active ? (
                <LoaderCircle className="size-3.5 shrink-0 motion-safe:animate-spin" aria-hidden />
              ) : null}
              <span className="truncate">{STAGE_LABELS[step]}</span>
            </p>
          </li>
        );
      })}
    </ol>
  );
}
