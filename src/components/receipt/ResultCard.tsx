import type { Receipt } from "@/lib/api/types";
import { formatDate } from "@/lib/format";
import { Missing } from "@/components/ui/missing";
import { Figure } from "./Figure";
import { LineItemsTable } from "./LineItemsTable";
import { StatusBadge } from "./StatusBadge";

export function ResultCard({ receipt }: { receipt: Receipt }) {
  const data = receipt.data;

  return (
    <article
      className="receipt-edge rounded-md border border-line bg-surface p-6"
      aria-label="Extracted receipt data"
    >
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <h2 className="font-serif text-2xl leading-tight">{data?.vendor ?? <Missing />}</h2>
          <p className="mt-1 flex flex-wrap items-baseline gap-x-2 text-sm text-ink-muted">
            <span className={data?.date ? "font-mono tabular-nums" : ""}>
              {data?.date ? formatDate(data.date) : <Missing />}
            </span>
            <span aria-hidden>·</span>
            <span>{data?.category ?? <Missing />}</span>
          </p>
        </div>
        <StatusBadge status={receipt.status} />
      </header>

      {!data ? (
        <p className="py-8 text-sm text-ink-muted">Reading the receipt. Fields appear as they are extracted.</p>
      ) : (
        <>
          <LineItemsTable items={data.lineItems} currency={data.currency} />
          <dl className="mt-2 border-t border-line pt-4 text-sm">
            <div className="flex items-baseline justify-between gap-4 py-1">
              <dt className="text-ink-muted">Subtotal</dt>
              <dd>
                <Figure value={data.subtotal} currency={data.currency} />
              </dd>
            </div>
            <div className="flex items-baseline justify-between gap-4 py-1">
              <dt className="text-ink-muted">Tax</dt>
              <dd>
                <Figure value={data.tax} currency={data.currency} />
              </dd>
            </div>
            <div className="mt-2 flex items-end justify-between gap-4 border-t-2 border-ink/60 pt-3">
              <dt className="font-semibold">
                Total
                {data.currency ? (
                  <span className="ml-2 font-mono text-xs uppercase tracking-wide text-ink-muted">
                    {data.currency}
                  </span>
                ) : null}
              </dt>
              <dd className="text-[1.75rem] leading-none">
                <Figure value={data.total} currency={data.currency} />
              </dd>
            </div>
          </dl>
        </>
      )}

      <footer className="mt-6 flex flex-wrap items-center gap-x-2 gap-y-1 border-t border-line pt-3 text-xs text-ink-muted">
        <span className="truncate font-mono">{receipt.filename}</span>
        {receipt.cached ? <span>· Already processed, shown from cache.</span> : null}
        {receipt.failureReason ? <span className="text-danger">{receipt.failureReason}</span> : null}
      </footer>
    </article>
  );
}
