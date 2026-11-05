"use client";

import { STATUS } from "@/lib/status";
import type { ReceiptStatus } from "@/lib/api/types";
import { StatusFilter } from "./hooks/useReceiptFilters";
import { SortKey, sortOptions } from "./lib/sort-options";

const field = "min-h-11 rounded-sm border border-line bg-surface px-2 text-sm";

type Props = {
  query: string;
  status: StatusFilter;
  category: string;
  sortKey: SortKey;
  categories: string[];
  onQueryChange: (value: string) => void;
  onStatusChange: (value: StatusFilter) => void;
  onCategoryChange: (value: string) => void;
  onSortChange: (value: SortKey) => void;
};

export const HistoryFilters = ({
  query,
  status,
  category,
  sortKey,
  categories,
  onQueryChange,
  onStatusChange,
  onCategoryChange,
  onSortChange,
}: Props) => {
  return (
    <div className="mt-6 flex flex-wrap items-center gap-3">
      <label className="flex items-center gap-2 text-sm text-ink-muted">
        Search
        <input
          type="search"
          maxLength={100}
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
          placeholder="Vendor or file name"
          className={`${field} w-56`}
        />
      </label>
      <label className="flex items-center gap-2 text-sm text-ink-muted">
        Status
        <select
          className={field}
          value={status}
          onChange={(event) => onStatusChange(event.target.value as StatusFilter)}
        >
          <option value="all">All</option>
          {(Object.keys(STATUS) as ReceiptStatus[]).map((value) => (
            <option key={value} value={value}>
              {STATUS[value].label}
            </option>
          ))}
        </select>
      </label>
      <label className="flex items-center gap-2 text-sm text-ink-muted">
        Category
        <select
          className={field}
          value={category}
          onChange={(event) => onCategoryChange(event.target.value)}
        >
          <option value="">All</option>
          {categories.map((value) => (
            <option key={value} value={value}>
              {value}
            </option>
          ))}
        </select>
      </label>
      <label className="flex items-center gap-2 text-sm text-ink-muted">
        Sort
        <select
          className={field}
          value={sortKey}
          onChange={(event) => onSortChange(event.target.value as SortKey)}
        >
          {Object.entries(sortOptions).map(([key, option]) => (
            <option key={key} value={key}>
              {option.label}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}