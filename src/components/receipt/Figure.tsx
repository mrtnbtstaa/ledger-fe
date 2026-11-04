import { formatMoney } from "@/lib/format";
import { Missing } from "@/components/ui/missing";

/** Every amount goes through here so figures stay tabular and missing ones stay visible. */
export function Figure({ value, currency }: { value: number | null; currency: string | null }) {
  if (value === null) return <Missing />;
  return <span className="font-mono tabular-nums">{formatMoney(value, currency)}</span>;
}
