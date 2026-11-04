import { describe, expect, it } from "vitest";
import {
  formatConfidence,
  formatDate,
  formatDateInput,
  formatFileSize,
  formatMoney,
} from "@/lib/format";

describe("formatMoney", () => {
  it("formats with the receipt currency", () => {
    expect(formatMoney(13.25, "USD")).toBe("$13.25");
  });

  it("never renders a missing amount as zero", () => {
    expect(formatMoney(null, "USD")).toBe("Not found");
  });

  it("falls back to a plain figure for an unknown currency code", () => {
    expect(formatMoney(10, "XYZZY")).toBe("10.00");
  });
});

describe("dates", () => {
  it("renders a stable day-month-year figure", () => {
    expect(formatDate("2026-10-28")).toBe("28 Oct 2026");
  });

  it("marks a missing date", () => {
    expect(formatDate(null)).toBe("Not found");
  });

  it("slices an ISO timestamp for date inputs", () => {
    expect(formatDateInput("2026-10-28T13:04:00Z")).toBe("2026-10-28");
    expect(formatDateInput(null)).toBe("");
  });
});

describe("small helpers", () => {
  it("rounds confidence to two decimals", () => {
    expect(formatConfidence(0.923)).toBe("0.92");
    expect(formatConfidence(null)).toBe("Not found");
  });

  it("formats the upload size limit the way the dropzone says it", () => {
    expect(formatFileSize(5 * 1024 * 1024)).toBe("5.0 MB");
    expect(formatFileSize(600 * 1024)).toBe("600 KB");
  });
});
