/** Missing values are never blank or zero (FR-013). */
export function Missing() {
  return <span className="italic text-ink-muted">Not found</span>;
}
