"use client";

import { HistoryFilters } from "@/components/history/HistoryFilters";
import { HistoryResults } from "@/components/history/HistoryResults";
import { useReceiptFilters } from "../hooks/useReceiptFilters";
import { useHistoryData } from "../hooks/useHistoryData";
import { ResultsSummary } from "@/components/common/ResultsSummary";

export const Content = () => {
  const filters = useReceiptFilters();
  const { list, categories, total, first, last, pageSize } = useHistoryData({
    status: filters.status,
    category: filters.category,
    query: filters.query,
    sortKey: filters.sortKey,
    offset: filters.offset,
  });

  return (
    <div className="mx-auto w-full max-w-[1080px] px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="font-serif text-3xl">History</h1>
      <p className="mt-1 max-w-[65ch] text-ink-muted">
        Every receipt processed in this demo. Anyone visiting sees the same list.
      </p>

      <HistoryFilters
        query={filters.query}
        status={filters.status}
        category={filters.category}
        sortKey={filters.sortKey}
        categories={categories}
        onQueryChange={filters.setQuery}
        onStatusChange={filters.setStatus}
        onCategoryChange={filters.setCategory}
        onSortChange={filters.setSortKey}
      />

      <div className="mt-4">
        <HistoryResults list={list} />
      </div>

      <ResultsSummary
        total={total}
        first={first}
        last={last}
        pageSize={pageSize}
        offset={filters.offset}
        onPageChange={filters.setOffset}
      />
    </div>
  );
}