"use client";

import Link from "next/link";
import { ErrorState } from "@/components/common/ErrorState";
import { withRetryHint } from "@/lib/api/errors";
import { statusAnnouncement } from "@/lib/status";
import { useRouteReceipt } from "../hooks/useRouteReceipt";
import { ReviewDetailBody } from "../ReviewDetailBody";

export default function Content() {
  const { receipt } = useRouteReceipt();
  const detail = receipt.data;

  return (
    <div className="mx-auto w-full max-w-[1080px] px-4 py-8 sm:px-6 lg:px-8">
      <p className="sr-only" role="status">
        {detail ? statusAnnouncement(detail) : ""}
      </p>
      <p className="text-sm">
        <Link href="/review" className="text-accent underline">
          Back to the queue
        </Link>
      </p>

      {receipt.isPending ? (
        <p className="mt-6 text-sm text-ink-muted">Loading the receipt…</p>
      ) : receipt.error ? (
        <div className="mt-6">
          <ErrorState
            title="That receipt could not load"
            message={withRetryHint(receipt.error)}
            onRetry={() => void receipt.refetch()}
          />
        </div>
      ) : detail ? (
        <ReviewDetailBody receipt={detail} />
      ) : null}
    </div>
  );
}