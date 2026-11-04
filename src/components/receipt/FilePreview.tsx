import type { Receipt } from "@/lib/api/types";

/** The original sits next to the data whenever the backend still keeps the file (FR-012). */
export function FilePreview({ receipt }: { receipt: Receipt }) {
  return (
    <section aria-labelledby="original-heading">
      <h2 id="original-heading" className="text-xs font-semibold uppercase tracking-[0.06em] text-ink-muted">
        Original
      </h2>
      {receipt.fileUrl ? (
        receipt.fileType === "pdf" ? (
          <a
            href={receipt.fileUrl}
            target="_blank"
            rel="noreferrer"
            className="mt-2 inline-flex min-h-11 items-center text-sm font-semibold text-accent underline"
          >
            Open the original PDF
          </a>
        ) : (
          /* eslint-disable-next-line @next/next/no-img-element -- backend host is configured at deploy time */
          <img
            src={receipt.fileUrl}
            alt={`Original receipt: ${receipt.filename}`}
            className="mt-2 max-h-80 w-full rounded-sm border border-line object-contain"
          />
        )
      ) : (
        <p className="mt-2 text-sm text-ink-muted">
          The original file is no longer stored. Extracted data and checks are kept for the demo.
        </p>
      )}
    </section>
  );
}
