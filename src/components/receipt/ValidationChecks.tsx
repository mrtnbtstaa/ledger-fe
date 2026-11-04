import { Check, X } from "lucide-react";
import type { ValidationCheck } from "@/lib/api/types";

/** Failed rows first and never collapsed: the evidence sits next to the result (FR-009). */
export function ValidationChecks({ checks }: { checks: ValidationCheck[] }) {
  if (checks.length === 0) {
    return <p className="text-sm text-ink-muted">No checks have run yet.</p>;
  }

  const ordered = [...checks].sort((a, b) => Number(a.passed) - Number(b.passed));

  return (
    <ul className="divide-y divide-line">
      {ordered.map((check) => (
        <li key={check.rule} className="flex gap-3 py-3 first:pt-0 last:pb-0">
          {check.passed ? (
            <Check className="mt-0.5 size-4 shrink-0 text-success" aria-hidden />
          ) : (
            <X className="mt-0.5 size-4 shrink-0 text-danger" aria-hidden />
          )}
          <div className="min-w-0">
            <p className="text-sm">
              <span className="sr-only">{check.passed ? "Passed: " : "Failed: "}</span>
              {check.description}
            </p>
            {check.details ? <p className="mt-1 text-sm text-ink-muted">{check.details}</p> : null}
          </div>
        </li>
      ))}
    </ul>
  );
}
