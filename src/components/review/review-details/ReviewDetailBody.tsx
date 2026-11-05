import { ReviewEditForm } from "@/components/review/ReviewEditForm";
import type { Receipt } from "@/lib/api/types";
import { ReceiptHeader } from "./ReceiptHeader";
import { ProcessingBanner } from "../../common/ProcessingBanner";
import { ReceiptAuditPanel } from "./ReceiptAuditPanel";

export function ReviewDetailBody({ receipt }: { receipt: Receipt }) {
  return (
    <>
      <ReceiptHeader receipt={receipt} />
      <ProcessingBanner receipt={receipt} />
      <div className="mt-6 grid gap-8 lg:grid-cols-2 lg:items-start">
        <ReceiptAuditPanel receipt={receipt} />
        <ReviewEditForm receipt={receipt} />
      </div>
    </>
  );
}