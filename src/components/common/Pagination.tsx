import { buttonClass } from "@/components/ui/button";

type PaginationProps = {
  total: number;
  limit: number;
  offset: number;
  onChange: (offset: number) => void;
};

export function Pagination({ total, limit, offset, onChange }: PaginationProps) {
  if (total <= limit) return null;

  const page = Math.floor(offset / limit) + 1;
  const pages = Math.ceil(total / limit);

  return (
    <nav aria-label="Pagination" className="mt-4 flex flex-wrap items-center justify-between gap-3">
      <p className="text-sm text-ink-muted">
        Page {page} of {pages}
      </p>
      <div className="flex gap-2">
        <button
          type="button"
          className={buttonClass("secondary")}
          disabled={offset === 0}
          onClick={() => onChange(Math.max(0, offset - limit))}
        >
          Previous
        </button>
        <button
          type="button"
          className={buttonClass("secondary")}
          disabled={offset + limit >= total}
          onClick={() => onChange(offset + limit)}
        >
          Next
        </button>
      </div>
    </nav>
  );
}
