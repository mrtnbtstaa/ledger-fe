import type { LineItem } from "@/lib/api/types";
import { Figure } from "./Figure";
import { Missing } from "@/components/ui/missing";

export function LineItemsTable({ items, currency }: { items: LineItem[]; currency: string | null }) {
  if (items.length === 0) {
    return (
      <p className="mt-4 border-t border-line pt-4 text-sm text-ink-muted">
        No line items were found on this receipt.
      </p>
    );
  }

  return (
    <div className="mt-4 border-t border-line">
      <h3 className="sr-only">Line items</h3>
      <ul className="divide-y divide-line/70">
        {items.map((item, index) => (
          <li key={index} className="py-3">
            <div className="flex items-baseline gap-2">
              <span className="min-w-0">{item.description ?? <Missing />}</span>
              <span className="hidden flex-1 border-b border-dotted border-line sm:block" aria-hidden />
              <span className="hidden shrink-0 text-sm text-ink-muted sm:block">
                {item.quantity === null ? null : `${item.quantity} × `}
                <Figure value={item.unitPrice} currency={currency} />
              </span>
              <span className="ml-auto shrink-0 text-sm sm:ml-0 sm:min-w-24 sm:text-right">
                <Figure value={item.lineTotal} currency={currency} />
              </span>
            </div>
            <p className="mt-1 text-xs text-ink-muted sm:hidden">
              {item.quantity === null ? null : `${item.quantity} × `}
              <Figure value={item.unitPrice} currency={currency} />
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
