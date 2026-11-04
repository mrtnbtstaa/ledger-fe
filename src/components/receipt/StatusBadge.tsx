import { STATUS } from "@/lib/status";
import type { ReceiptStatus } from "@/lib/api/types";

export function StatusBadge({ status }: { status: ReceiptStatus }) {
  const { label, icon: Icon, className } = STATUS[status];
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-sm px-2 py-0.5 text-xs font-semibold uppercase tracking-[0.06em] ${className}`}
    >
      <Icon className={`size-3.5 ${status === "processing" ? "motion-safe:animate-spin" : ""}`} aria-hidden />
      {label}
    </span>
  );
}
