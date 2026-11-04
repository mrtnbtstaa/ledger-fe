import { describe, expect, it } from "vitest";
import type { ExtractedData } from "@/lib/api/types";
import { fromFormValues, receiptFormSchema, toFormValues } from "@/lib/validation/receipt-form";

const data: ExtractedData = {
  vendor: "Harbor Hardware",
  date: "2026-10-30",
  dateRaw: "30.10.2026",
  currency: "USD",
  subtotal: 13.97,
  tax: 1.26,
  total: 15.23,
  category: "Supplies",
  lineItems: [{ description: "Wood screws", quantity: 1, unitPrice: 6.99, lineTotal: 6.99 }],
};

describe("receipt form values", () => {
  it("starts from an empty form when nothing was extracted", () => {
    const values = toFormValues(null);
    expect(values.vendor).toBe("");
    expect(values.subtotal).toBeNull();
    expect(values.lineItems).toEqual([]);
  });

  it("round-trips without losing the raw date", () => {
    expect(fromFormValues(toFormValues(data), data)).toEqual(data);
  });

  it("turns blank fields back into null instead of empty strings", () => {
    const values = { ...toFormValues(data), vendor: "  ", tax: null };
    const result = fromFormValues(values, data);
    expect(result.vendor).toBeNull();
    expect(result.tax).toBeNull();
  });

  it("trims an ISO timestamp down to a date input value", () => {
    expect(toFormValues({ ...data, date: "2026-10-30T00:00:00Z" }).date).toBe("2026-10-30");
  });
});

describe("receipt form schema", () => {
  it("accepts blanks as missing numbers", () => {
    const parsed = receiptFormSchema.safeParse({ ...toFormValues(data), subtotal: null, tax: null });
    expect(parsed.success).toBe(true);
  });

  it("requires every line item to have a description", () => {
    const values = toFormValues(data);
    values.lineItems[0]!.description = "";
    expect(receiptFormSchema.safeParse(values).success).toBe(false);
  });
});
