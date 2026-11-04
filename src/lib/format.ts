const money = new Map<string, Intl.NumberFormat>();

function moneyFormatter(currency: string | null): Intl.NumberFormat {
  const key = currency ?? "plain";
  let formatter = money.get(key);
  if (!formatter) {
    formatter = new Intl.NumberFormat("en-US", {
      style: currency ? "currency" : "decimal",
      currency: currency ?? undefined,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
    money.set(key, formatter);
  }
  return formatter;
}

/** Amounts never collapse to "0" for missing data (FR-013). */
export function formatMoney(value: number | null, currency: string | null): string {
  if (value === null) return "Not found";
  try {
    return moneyFormatter(currency).format(value);
  } catch {
    // Unknown currency code from the extractor: still show the figure.
    return moneyFormatter(null).format(value);
  }
}

export function formatDate(value: string | null): string {
  if (!value) return "Not found";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
}

export function formatDateTime(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export function formatConfidence(value: number | null): string {
  return value === null ? "Not found" : value.toFixed(2);
}
