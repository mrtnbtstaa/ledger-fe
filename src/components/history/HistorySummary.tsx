"use client";

import { Pagination } from "@/components/common/Pagination";

type Props = {
  total: number;
  first: number;
  last: number;
  pageSize: number;
  offset: number;
  onPageChange: (offset: number) => void;
};

export const HistorySummary = ({ total, first, last, pageSize, offset, onPageChange }: Props) => {
  return (
    <>
      <p className="mt-4 text-sm text-ink-muted">
        {total === 0 ? "0 receipts" : `Showing ${first}–${last} of ${total} receipts`}
      </p>
      <Pagination total={total} limit={pageSize} offset={offset} onChange={onPageChange} />
    </>
  );
}