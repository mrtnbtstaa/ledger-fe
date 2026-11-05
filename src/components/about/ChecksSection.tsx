import { PageSection } from "@/components/about/PageSection";
import { config } from "@/lib/config";

export const ChecksSection = () => {
  const threshold = config.confidenceThreshold.toFixed(2);

  return (
    <PageSection id="checks" title="What gets checked">
      <ul className="mt-3 list-disc space-y-1 pl-5 text-ink-muted">
        <li>Line items add up to the subtotal.</li>
        <li>Subtotal plus tax equals the total.</li>
        <li>The total is above zero, and the vendor and date were found.</li>
        <li>Confidence must clear the {threshold} review threshold.</li>
      </ul>
      <p className="mt-3 text-sm text-ink-muted">
        Totals are never recomputed in the browser. The server is the only place checks run, so the screen cannot
        disagree with the record.
      </p>
    </PageSection>
  );
}