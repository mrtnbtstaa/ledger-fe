"use client";

import Link from "next/link";
import { ConfidenceMeter } from "@/components/receipt/ConfidenceMeter";
import { FilePreview } from "@/components/receipt/FilePreview";
import { ResultCard } from "@/components/receipt/ResultCard";
import { ValidationChecks } from "@/components/receipt/ValidationChecks";
import type { Receipt } from "@/lib/api/types";
import { ProcessingBanner } from "../common/ProcessingBanner";

export function ReceiptResult({ receipt }: { receipt: Receipt }) {
  return (
    <section className="mt-10">
      <ProcessingBanner receipt={receipt} />

      <div className="mt-6 grid gap-6 lg:grid-cols-[3fr_2fr] lg:items-start">
        <ResultCard receipt={receipt} />
        <aside className="space-y-6 lg:sticky lg:top-6">
          <div className="rounded-md border border-line bg-surface p-4">
            <h2 className="text-xs font-semibold uppercase tracking-[0.06em] text-ink-muted">
              Checks
            </h2>
            <div className="mt-3">
              <ValidationChecks checks={receipt.checks} />
            </div>
            <div className="mt-4 border-t border-line pt-4">
              <ConfidenceMeter value={receipt.confidence} />
            </div>
          </div>
          <FilePreview receipt={receipt} />
        </aside>
      </div>

      {receipt.status === "needs_review" ? (
        <p className="mt-6 text-sm text-ink-muted">
          This one needs a person.{" "}
          <Link href={`/review/${receipt.id}`} className="text-accent underline">
            Open it in the review queue
          </Link>
          .
        </p>
      ) : null}
    </section>
  );
}