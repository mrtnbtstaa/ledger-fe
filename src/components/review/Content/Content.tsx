"use client";

import { SearchField } from "@/components/common/SearchField";
import { ReviewResults } from "@/components/review/ReviewResults";
import { config } from "@/lib/config";
import { useSearchQuery } from "../hooks/useSearchQuery";
import { useReviewQueue } from "../hooks/useReviewQueue";
import { ResultsSummary } from "@/components/common/ResultsSummary";

export default function Content() {
  const { query, offset, setQuery, setOffset } = useSearchQuery();
  const { list, total, first, last, pageSize } = useReviewQueue({ query, offset });

  return (
    <div className="mx-auto w-full max-w-[1080px] px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="font-serif text-3xl">Review queue</h1>
      <p className="mt-1 max-w-[65ch] text-ink-muted">
        Receipts where a check failed or confidence stayed below{" "}
        {config.confidenceThreshold.toFixed(2)}. Correct the fields, then approve or reject. This
        queue is shared by everyone using the demo.
      </p>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <SearchField value={query} onChange={setQuery} />
      </div>

      <div className="mt-4">
        <ReviewResults list={list} query={query} />
      </div>

      <ResultsSummary
        total={total}
        first={first}
        last={last}
        pageSize={pageSize}
        offset={offset}
        onPageChange={setOffset}
      />
    </div>
  );
}