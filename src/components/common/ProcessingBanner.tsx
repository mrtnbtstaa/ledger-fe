import { ProcessingStepper } from "@/components/receipt/ProcessingStepper";
import type { Receipt } from "@/lib/api/types";

export function ProcessingBanner({ receipt }: { receipt: Receipt }) {
  if (receipt.status !== "processing") return null;
  return (
    <div className="mt-6 rounded-md border border-line bg-surface p-4">
      <ProcessingStepper stage={receipt.stage ?? "uploading"} />
    </div>
  );
}