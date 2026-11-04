import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ValidationChecks } from "@/components/receipt/ValidationChecks";
import type { ValidationCheck } from "@/lib/api/types";

const checks: ValidationCheck[] = [
  { rule: "a", description: "Line items add up to the subtotal", passed: true, details: null },
  {
    rule: "b",
    description: "Subtotal plus tax equals the total",
    passed: false,
    details: "Subtotal plus tax is $15.23, but the total reads $16.35.",
  },
];

describe("ValidationChecks", () => {
  it("puts failed rows first so the reason is seen before the praise", () => {
    render(<ValidationChecks checks={checks} />);
    const rows = screen.getAllByRole("listitem");
    expect(rows[0]).toHaveTextContent("Subtotal plus tax equals the total");
    expect(rows[1]).toHaveTextContent("Line items add up to the subtotal");
  });

  it("names the state for screen readers, not just the icon", () => {
    render(<ValidationChecks checks={checks} />);
    expect(screen.getByText(/^Failed:/)).toBeInTheDocument();
    expect(screen.getByText(/^Passed:/)).toBeInTheDocument();
  });

  it("shows the disagreeing numbers", () => {
    render(<ValidationChecks checks={checks} />);
    expect(screen.getByText(/but the total reads/)).toBeInTheDocument();
  });
});
