import Link from "next/link";
import type { ReceiptSummary } from "@/lib/api/types";
import { formatDateTime } from "@/lib/format";
import { Figure } from "@/components/receipt/Figure";
import { StatusBadge } from "@/components/receipt/StatusBadge";
import { Missing } from "@/components/ui/missing";

type ReceiptListProps = {
  items: ReceiptSummary[];
  showReason?: boolean;
};

/** One markup for both History and the Review queue; rows become stacked records under 640px. */
export const ReceiptList = ({ items, showReason = false }: ReceiptListProps) => {
  return (
    <ul className="mt-4 border-t border-line">
      <li
        aria-hidden
        className="hidden bg-surface-sunken px-3 py-2 text-xs font-semibold uppercase tracking-[0.06em] text-ink-muted md:grid md:grid-cols-[9rem_1fr_8rem_8rem_9rem] md:gap-3"
      >
        <span>Uploaded</span>
        <span>Vendor</span>
        <span>Category</span>
        <span className="text-right">Total</span>
        <span>Status</span>
      </li>
      {items.map((item) => (
        <li key={item.id}>
          <Link
            href={`/review/${item.id}`}
            className="grid grid-cols-[1fr_auto] items-center gap-x-3 gap-y-1 border-b border-line px-1 py-3 hover:bg-surface-sunken md:grid-cols-[9rem_1fr_8rem_8rem_9rem] md:px-3"
          >
            <span className="hidden font-mono text-sm tabular-nums text-ink-muted md:col-start-1 md:block">
              {formatDateTime(item.uploadedAt)}
            </span>
            <div className="min-w-0 md:col-start-2">
              <p className="truncate font-medium">{item.vendor ?? <Missing />}</p>
              <p className="mt-0.5 font-mono text-xs tabular-nums text-ink-muted md:hidden">
                {formatDateTime(item.uploadedAt)}
              </p>
            </div>
            <span className="hidden text-sm text-ink-muted md:col-start-3 md:block">
              {item.category ?? <Missing />}
            </span>
            <span className="justify-self-end text-sm md:col-start-4">
              <Figure value={item.total} currency={item.currency} />
            </span>
            <span className="col-span-2 md:col-span-1 md:col-start-5">
              <StatusBadge status={item.status} />
            </span>
            {showReason ? (
              <p className="col-span-2 text-sm text-ink-muted md:col-span-5 md:col-start-1">
                {item.failureReason ?? "Flagged for review."}
              </p>
            ) : null}
          </Link>
        </li>
      ))}
    </ul>
  );
}
