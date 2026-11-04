import type { Metadata } from "next";
import { PipelineDiagram } from "@/components/about/PipelineDiagram";
import { config } from "@/lib/config";

export const metadata: Metadata = {
  title: "About",
  description: "How the receipt processor extracts, checks and reviews data, and what its evaluation set shows.",
};

const accuracy = [
  { label: "Receipts in the evaluation set", value: config.eval.setSize, suffix: "" },
  { label: "Field accuracy", value: config.eval.fieldAccuracy, suffix: "%" },
  { label: "Auto-approved without a reviewer", value: config.eval.autoApprovedShare, suffix: "%" },
];

export default function AboutPage() {
  return (
    <div className="mx-auto w-full max-w-[680px] px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="font-serif text-[2rem] leading-tight sm:text-4xl">What this does, and how you can check it</h1>

      <p className="mt-4 text-ink-muted">
        Receipts arrive as photos or PDFs, usually blurry, folded, or in a language the accounting software does not
        parse. Extracting the numbers is the easy half. The hard half is knowing when the numbers are wrong.
      </p>
      <p className="mt-3 text-ink-muted">
        So every result is shown with its own audit trail: the fields the model returned, the arithmetic rules run
        against them, a confidence value, and a decision. Anything that does not hold up waits for a person instead of
        being passed downstream.
      </p>

      <section className="mt-10" aria-labelledby="pipeline">
        <h2 id="pipeline" className="font-serif text-2xl">
          The pipeline
        </h2>
        <div className="mt-4">
          <PipelineDiagram />
        </div>
      </section>

      <section className="mt-10" aria-labelledby="checks">
        <h2 id="checks" className="font-serif text-2xl">
          What gets checked
        </h2>
        <ul className="mt-3 list-disc space-y-1 pl-5 text-ink-muted">
          <li>Line items add up to the subtotal.</li>
          <li>Subtotal plus tax equals the total.</li>
          <li>The total is above zero, and the vendor and date were found.</li>
          <li>Confidence must clear the {config.confidenceThreshold.toFixed(2)} review threshold.</li>
        </ul>
        <p className="mt-3 text-sm text-ink-muted">
          Totals are never recomputed in the browser. The server is the only place checks run, so the screen cannot
          disagree with the record.
        </p>
      </section>

      <section className="mt-10" aria-labelledby="accuracy">
        <h2 id="accuracy" className="font-serif text-2xl">
          Accuracy
        </h2>
        <dl className="mt-3 divide-y divide-line border-y border-line text-sm">
          {accuracy.map((row) => (
            <div key={row.label} className="flex items-baseline justify-between gap-4 py-2">
              <dt className="text-ink-muted">{row.label}</dt>
              <dd className="font-mono tabular-nums">
                {row.value === null ? (
                  <span className="italic text-ink-muted">Not published yet</span>
                ) : (
                  `${row.value}${row.suffix}`
                )}
              </dd>
            </div>
          ))}
        </dl>
        <p className="mt-2 text-sm text-ink-muted">
          Only figures from the evaluation set are shown here, never estimates.
        </p>
      </section>

      <section className="mt-10" aria-labelledby="links">
        <h2 id="links" className="font-serif text-2xl">
          Elsewhere
        </h2>
        <ul className="mt-3 space-y-1 text-sm">
          {config.repoUrl ? (
            <li>
              <a href={config.repoUrl} target="_blank" rel="noreferrer" className="text-accent underline">
                Source code and the backend
              </a>
            </li>
          ) : null}
          {config.demoVideoUrl ? (
            <li>
              <a href={config.demoVideoUrl} target="_blank" rel="noreferrer" className="text-accent underline">
                Recorded walkthrough
              </a>
            </li>
          ) : null}
          {config.sheetUrl ? (
            <li>
              <a href={config.sheetUrl} target="_blank" rel="noreferrer" className="text-accent underline">
                Approved rows in Google Sheets
              </a>
            </li>
          ) : null}
        </ul>
      </section>
    </div>
  );
}
