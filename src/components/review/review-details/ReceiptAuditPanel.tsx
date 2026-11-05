"use client";

import { ConfidenceMeter } from "@/components/receipt/ConfidenceMeter";
import { FilePreview } from "@/components/receipt/FilePreview";
import { ValidationChecks } from "@/components/receipt/ValidationChecks";
import type { Receipt } from "@/lib/api/types";

export function ReceiptAuditPanel({ receipt }: { receipt: Receipt }) {
  return (
    <div className="space-y-6">
      <FilePreview receipt={receipt} />
      <section aria-labelledby="checks-heading" className="rounded-md border border-line bg-surface p-4">
        <h2
          id="checks-heading"
          className="text-xs font-semibold uppercase tracking-[0.06em] text-ink-muted"
        >
          Checks
        </h2>
        <div className="mt-3">
          <ValidationChecks checks={receipt.checks} />
        </div>
        <div className="mt-4 border-t border-line pt-4">
          <ConfidenceMeter value={receipt.confidence} />
        </div>
      </section>
    </div>
  );
}