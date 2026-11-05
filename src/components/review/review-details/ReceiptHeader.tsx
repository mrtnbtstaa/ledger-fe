import { StatusBadge } from "@/components/receipt/StatusBadge";
import { Missing } from "@/components/ui/missing";
import { Receipt } from "@/lib/api/types";
import { formatDate } from "@/lib/format";

export function ReceiptHeader({ receipt }: { receipt: Receipt }) {
  return (
    <header className="mt-4 flex flex-wrap items-start justify-between gap-3 border-b border-line pb-4">
      <div className="min-w-0">
        <h1 className="font-serif text-3xl leading-tight">
          {receipt.data?.vendor ?? <Missing />}
        </h1>
        <p className="mt-1 text-sm text-ink-muted">
          <span className="font-mono tabular-nums">
            {receipt.data?.date ? formatDate(receipt.data.date) : <Missing />}
          </span>{" "}
          · <span className="truncate font-mono">{receipt.filename}</span>
        </p>
      </div>
      <StatusBadge status={receipt.status} />
    </header>
  );
}