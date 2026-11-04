import { ArrowRight } from "lucide-react";

const steps = [
  { title: "Upload", detail: "A photo or the first page of a PDF." },
  { title: "Extract", detail: "A vision model reads vendor, date, items and totals." },
  { title: "Validate", detail: "Arithmetic rules re-check the figures it returned." },
  { title: "Decide", detail: "Clean results are auto-approved; the rest wait for a human." },
];

export function PipelineDiagram() {
  return (
    <ol className="grid gap-2 sm:grid-cols-[repeat(4,minmax(0,1fr))] sm:items-stretch sm:gap-3">
      {steps.map((step, index) => (
        <li key={step.title} className="flex flex-col gap-2">
          <div className="h-full rounded-sm border border-line p-3">
            <p className="font-mono text-xs uppercase tracking-[0.06em] text-ink-muted">
              {String(index + 1).padStart(2, "0")}
            </p>
            <p className="mt-1 font-semibold">{step.title}</p>
            <p className="mt-1 text-sm text-ink-muted">{step.detail}</p>
          </div>
          {index < steps.length - 1 ? (
            <ArrowRight className="size-4 self-center text-line sm:hidden" aria-hidden />
          ) : null}
        </li>
      ))}
    </ol>
  );
}
