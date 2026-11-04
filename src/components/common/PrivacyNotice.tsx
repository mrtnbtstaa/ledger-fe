import { config } from "@/lib/config";

export function PrivacyNotice() {
  return (
    <p className="rounded-md bg-surface-sunken px-4 py-3 text-sm text-ink-muted">
      This is a public demo. Please do not upload receipts with personal or sensitive information — use a sample
      instead. Uploaded files are deleted after {config.retentionHours} hours.
    </p>
  );
}
