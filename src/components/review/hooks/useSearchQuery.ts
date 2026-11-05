"use client";

import { useCallback, useState } from "react";

export function useSearchQuery() {
  const [query, setQueryState] = useState("");
  const [offset, setOffset] = useState(0);

  const setQuery = useCallback((value: string) => {
    setQueryState(value);
    setOffset(0);
  }, []);

  return { query, offset, setQuery, setOffset };
}