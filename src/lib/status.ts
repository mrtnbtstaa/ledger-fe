import { BadgeCheck, Check, CircleAlert, LoaderCircle, TriangleAlert, X } from "lucide-react";
import type { ReceiptStage, ReceiptStatus } from "./api/types";

type StatusTone = { label: string; icon: typeof Check; className: string };

/** One map for badges, tables and the audit list; colour never travels alone (FR-028). */
export const STATUS: Record<ReceiptStatus, StatusTone> = {
  processing: { label: "Processing", icon: LoaderCircle, className: "bg-info-soft text-info" },
  auto_approved: { label: "Auto-approved", icon: BadgeCheck, className: "bg-accent-soft text-accent" },
  needs_review: { label: "Needs review", icon: TriangleAlert, className: "bg-warning-soft text-warning" },
  approved: { label: "Approved", icon: Check, className: "bg-success-soft text-success" },
  rejected: { label: "Rejected", icon: X, className: "bg-surface-sunken text-ink-muted" },
  failed: { label: "Failed", icon: CircleAlert, className: "bg-danger-soft text-danger" },
};

export const STAGES = ["uploading", "extracting", "validating", "done"] as const;

export const STAGE_LABELS = {
  uploading: "Uploading",
  extracting: "Extracting",
  validating: "Validating",
  done: "Done",
} as const;

/** One line for screen readers; the live region must be mounted before it speaks (DESIGN 403). */
export function statusAnnouncement(receipt: { status: ReceiptStatus; stage?: ReceiptStage | null }): string {
  if (receipt.status === "processing") return `Processing: ${STAGE_LABELS[receipt.stage ?? "uploading"]}.`;
  return `Status: ${STATUS[receipt.status].label}.`;
}
