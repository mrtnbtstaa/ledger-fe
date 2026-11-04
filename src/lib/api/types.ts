import type { components } from "./schema";

export type Receipt = components["schemas"]["Receipt"];
export type ReceiptSummary = components["schemas"]["ReceiptSummary"];
export type ReceiptList = components["schemas"]["ReceiptList"];
export type ExtractedData = components["schemas"]["ExtractedData"];
export type LineItem = components["schemas"]["LineItem"];
export type ValidationCheck = components["schemas"]["ValidationCheck"];
export type Sample = components["schemas"]["Sample"];
export type ReceiptStatus = NonNullable<components["schemas"]["ReceiptStatus"]>;
export type ReceiptStage = NonNullable<components["schemas"]["ReceiptStage"]>;
