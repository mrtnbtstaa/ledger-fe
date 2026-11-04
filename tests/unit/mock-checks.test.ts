import { describe, expect, it } from "vitest";
import { runChecks } from "@/lib/api/mock";
import type { ExtractedData } from "@/lib/api/types";

const clean: ExtractedData = {
  vendor: "Blue Bottle Coffee",
  date: "2026-10-28",
  dateRaw: "10/28/2026",
  currency: "USD",
  subtotal: 13.25,
  tax: 1.09,
  total: 14.34,
  category: "Meals",
  lineItems: [
    { description: "Flat white", quantity: 2, unitPrice: 4.5, lineTotal: 9 },
    { description: "Almond croissant", quantity: 1, unitPrice: 4.25, lineTotal: 4.25 },
  ],
};

const failed = (checks: ReturnType<typeof runChecks>, rule: string) =>
  checks.find((check) => check.rule === rule);

describe("runChecks", () => {
  it("passes every rule for a consistent receipt", () => {
    expect(runChecks(clean).every((check) => check.passed)).toBe(true);
  });

  it("catches a total that disagrees with subtotal plus tax", () => {
    const check = failed(runChecks({ ...clean, total: 16.35 }), "subtotal_plus_tax_equals_total");
    expect(check?.passed).toBe(false);
    expect(check?.details).toContain("14.34");
    expect(check?.details).toContain("16.35");
  });

  it("catches line items that do not reach the subtotal", () => {
    const check = failed(
      runChecks({ ...clean, lineItems: [{ description: "Wrong", quantity: 1, unitPrice: 9, lineTotal: 9 }] }),
      "line_items_sum_to_subtotal",
    );
    expect(check?.passed).toBe(false);
    expect(check?.details).toContain("13.25");
  });

  it("says why a missing tax blocks the check instead of crashing", () => {
    const check = failed(runChecks({ ...clean, tax: null }), "subtotal_plus_tax_equals_total");
    expect(check?.passed).toBe(false);
    expect(check?.details).toContain("Tax was not found");
  });

  it("flags a missing vendor", () => {
    expect(failed(runChecks({ ...clean, vendor: null }), "vendor_and_date_present")?.passed).toBe(false);
  });
});
