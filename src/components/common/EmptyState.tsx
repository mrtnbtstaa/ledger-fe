import type { ReactNode } from "react";

/** One sentence and one action, no illustration. */
export function EmptyState({ children }: { children: ReactNode }) {
  return <p className="rounded-md border border-dashed border-line px-4 py-8 text-center text-sm text-ink-muted">{children}</p>;
}
