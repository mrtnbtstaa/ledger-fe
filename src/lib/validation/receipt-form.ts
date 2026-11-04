import { z } from "zod";
import type { ExtractedData } from "@/lib/api/types";

/** Empty inputs arrive as "" from the form; setValueAs turns them into null before validation. */
const numberOrNull = z.number().finite().nullable();

const text = z.string().trim();

export const receiptFormSchema = z.object({
  vendor: text,
  date: text,
  currency: text,
  category: text,
  subtotal: numberOrNull,
  tax: numberOrNull,
  total: numberOrNull,
  lineItems: z.array(
    z.object({
      description: text.min(1, "Every line item needs a description."),
      quantity: numberOrNull,
      unitPrice: numberOrNull,
      lineTotal: numberOrNull,
    }),
  ),
});

export type ReceiptFormValues = z.infer<typeof receiptFormSchema>;

export function toFormValues(data: ExtractedData | null): ReceiptFormValues {
  return {
    vendor: data?.vendor ?? "",
    date: data?.date?.slice(0, 10) ?? "",
    currency: data?.currency ?? "",
    category: data?.category ?? "",
    subtotal: data?.subtotal ?? null,
    tax: data?.tax ?? null,
    total: data?.total ?? null,
    lineItems: (data?.lineItems ?? []).map((item) => ({
      description: item.description ?? "",
      quantity: item.quantity ?? null,
      unitPrice: item.unitPrice ?? null,
      lineTotal: item.lineTotal ?? null,
    })),
  };
}

const nullIfEmpty = (value: string) => (value.trim() === "" ? null : value.trim());

/** Totals are sent as typed; the backend is the only place that recomputes checks (D7). */
export function fromFormValues(values: ReceiptFormValues, current: ExtractedData | null): ExtractedData {
  return {
    vendor: nullIfEmpty(values.vendor),
    date: nullIfEmpty(values.date),
    dateRaw: current?.dateRaw ?? null,
    currency: nullIfEmpty(values.currency),
    subtotal: values.subtotal,
    tax: values.tax,
    total: values.total,
    category: nullIfEmpty(values.category),
    lineItems: values.lineItems.map((item) => ({
      description: nullIfEmpty(item.description),
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      lineTotal: item.lineTotal,
    })),
  };
}
