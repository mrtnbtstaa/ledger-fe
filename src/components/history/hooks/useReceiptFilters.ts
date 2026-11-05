"use client";

import { useCallback, useState } from "react";
import type { ReceiptStatus } from "@/lib/api/types";
import type { SortKey } from "@/components/history/lib/sort-options";

export type StatusFilter = "all" | ReceiptStatus;

export function useReceiptFilters() {
  const [status, setStatusState] = useState<StatusFilter>("all");
  const [category, setCategoryState] = useState("");
  const [query, setQueryState] = useState("");
  const [sortKey, setSortKeyState] = useState<SortKey>("date-desc");
  const [offset, setOffset] = useState(0);

  // Any filter change resets pagination.
  const setStatus = useCallback((value: StatusFilter) => {
    setStatusState(value);
    setOffset(0);
  }, []);
  const setCategory = useCallback((value: string) => {
    setCategoryState(value);
    setOffset(0);
  }, []);
  const setQuery = useCallback((value: string) => {
    setQueryState(value);
    setOffset(0);
  }, []);
  const setSortKey = useCallback((value: SortKey) => {
    setSortKeyState(value);
    setOffset(0);
  }, []);

  return {
    status,
    category,
    query,
    sortKey,
    offset,
    setStatus,
    setCategory,
    setQuery,
    setSortKey,
    setOffset,
  };
}