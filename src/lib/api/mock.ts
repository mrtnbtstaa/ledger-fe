import { config } from "@/lib/config";
import { formatMoney } from "@/lib/format";
import type {
  ExtractedData,
  Receipt,
  ReceiptStatus,
  ReceiptSummary,
  Sample,
  ValidationCheck,
} from "./types";

/**
 * In-browser stand-in for the FastAPI backend: used when NEXT_PUBLIC_API_URL is empty and by
 * the Playwright suite. It renders the same shapes as contracts/openapi.json.
 */
const PROCESSING_MS = 4_000;
const TOLERANCE = 0.011;

const samples: Sample[] = [
  {
    id: "blue-bottle",
    label: "Blue Bottle Coffee",
    description: "Clean photo. Every check passes, so it is auto-approved.",
    expected: "clean",
  },
  {
    id: "harbor-hardware",
    label: "Harbor Hardware",
    description: "The printed total disagrees with subtotal plus tax.",
    expected: "fails_validation",
  },
  {
    id: "corner-pharmacy",
    label: "Corner Pharmacy",
    description: "Tax is missing and confidence is low.",
    expected: "fails_validation",
  },
];

const fixtures: Record<string, { data: ExtractedData; confidence: number }> = {
  "blue-bottle": {
    confidence: 0.94,
    data: {
      vendor: "Blue Bottle Coffee",
      date: "2026-10-28",
      dateRaw: "10/28/2026",
      currency: "USD",
      subtotal: 13.25,
      tax: 1.09,
      total: 14.34,
      category: "Meals",
      lineItems: [
        { description: "Flat white", quantity: 2, unitPrice: 4.5, lineTotal: 9.0 },
        { description: "Almond croissant", quantity: 1, unitPrice: 4.25, lineTotal: 4.25 },
      ],
    },
  },
  "harbor-hardware": {
    confidence: 0.71,
    data: {
      vendor: "Harbor Hardware",
      date: "2026-10-30",
      dateRaw: "30.10.2026",
      currency: "USD",
      subtotal: 13.97,
      tax: 1.26,
      total: 16.35,
      category: "Supplies",
      lineItems: [
        { description: "Wood screws, 40 mm", quantity: 1, unitPrice: 6.99, lineTotal: 6.99 },
        { description: "Sandpaper, 120 grit", quantity: 2, unitPrice: 3.49, lineTotal: 6.98 },
      ],
    },
  },
  "corner-pharmacy": {
    confidence: 0.52,
    data: {
      vendor: "Corner Pharmacy",
      date: "2026-11-02",
      dateRaw: "Nov 2, 2026",
      currency: "USD",
      subtotal: 22.4,
      tax: null,
      total: 22.4,
      category: "Health",
      lineItems: [
        { description: "Ibuprofen 200 mg", quantity: 1, unitPrice: 22.4, lineTotal: 22.4 },
      ],
    },
  },
};

type Stored = { receipt: Receipt; startedAt: number };

const store = new Map<string, Stored>();
let seeded = false;

const round = (value: number) => Math.round(value * 100) / 100;
const sum = (values: (number | null)[]) =>
  round(values.reduce<number>((total, v) => total + (v ?? 0), 0));

export function runChecks(data: ExtractedData): ValidationCheck[] {
  const itemSum = sum(data.lineItems.map((item) => item.lineTotal));
  const itemsMatchSubtotal =
    data.subtotal !== null && data.lineItems.length > 0
      ? Math.abs(itemSum - data.subtotal) <= TOLERANCE
      : data.lineItems.length === 0 && data.subtotal === null;

  const totalMatches =
    data.subtotal !== null && data.tax !== null && data.total !== null
      ? Math.abs(round(data.subtotal + data.tax) - data.total) <= TOLERANCE
      : false;

  return [
    {
      rule: "line_items_sum_to_subtotal",
      description: "Line items add up to the subtotal",
      passed: itemsMatchSubtotal,
      details:
        data.subtotal === null
          ? "No subtotal was found to compare against."
          : itemsMatchSubtotal
            ? undefined
            : `Items add up to ${formatMoney(itemSum, data.currency)}, but the subtotal reads ${formatMoney(data.subtotal, data.currency)}.`,
    },
    {
      rule: "subtotal_plus_tax_equals_total",
      description: "Subtotal plus tax equals the total",
      passed: totalMatches,
      details: totalMatches
        ? undefined
        : data.tax === null
          ? "Tax was not found, so the total cannot be verified."
          : `Subtotal plus tax is ${formatMoney(round((data.subtotal ?? 0) + data.tax), data.currency)}, but the total reads ${formatMoney(data.total, data.currency)}.`,
    },
    {
      rule: "total_is_positive",
      description: "The total is above zero",
      passed: data.total !== null && data.total > 0,
      details: data.total === null ? "No total was found." : undefined,
    },
    {
      rule: "vendor_and_date_present",
      description: "A vendor and a date were found",
      passed: Boolean(data.vendor) && Boolean(data.date),
      details: !data.vendor
        ? "No vendor was found."
        : !data.date
          ? "No date was found."
          : undefined,
    },
  ];
}

function decide(
  checks: ValidationCheck[],
  confidence: number,
  status?: ReceiptStatus,
): ReceiptStatus {
  if (status && status !== "processing") return status;
  const allPassed = checks.every((check) => check.passed);
  return allPassed && confidence >= config.confidenceThreshold ? "auto_approved" : "needs_review";
}

function buildReceipt(
  id: string,
  filename: string,
  fileType: Receipt["fileType"],
  data: ExtractedData,
  confidence: number,
): Receipt {
  const checks = runChecks(data);
  const uploadedAt = new Date().toISOString();
  return {
    id,
    filename,
    fileType,
    uploadedAt,
    status: decide(checks, confidence),
    stage: "done",
    confidence,
    fileUrl: null,
    fileExpiresAt: new Date(Date.now() + config.retentionHours * 3_600_000).toISOString(),
    data,
    checks,
    cached: false,
    failureReason: null,
  };
}

function seed() {
  if (seeded) return;
  seeded = true;
  // Pre-existing rows so /history and /review are not empty on a first visit.
  const earlier = [
    { sample: "blue-bottle", minutesAgo: 195, status: "approved" as ReceiptStatus },
    { sample: "corner-pharmacy", minutesAgo: 88, status: "needs_review" as ReceiptStatus },
    { sample: "harbor-hardware", minutesAgo: 26, status: "needs_review" as ReceiptStatus },
  ];
  for (const row of earlier) {
    const fixture = fixtures[row.sample]!;
    const receipt = buildReceipt(
      `seed-${row.sample}`,
      `${row.sample}.jpg`,
      "jpg",
      fixture.data,
      fixture.confidence,
    );
    receipt.status = row.status;
    receipt.uploadedAt = new Date(Date.now() - row.minutesAgo * 60_000).toISOString();
    store.set(receipt.id, { receipt, startedAt: 0 });
  }
}

function stored(id: string): Receipt | undefined {
  const entry = store.get(id);
  if (!entry) return undefined;
  if (entry.receipt.status !== "processing") return entry.receipt;
  const elapsed = Date.now() - entry.startedAt;
  if (elapsed >= PROCESSING_MS) return entry.receipt;
  const stage =
    elapsed < PROCESSING_MS * 0.35
      ? "uploading"
      : elapsed < PROCESSING_MS * 0.7
        ? "extracting"
        : "validating";
  return { ...entry.receipt, status: "processing", stage };
}

function summary(receipt: Receipt): ReceiptSummary {
  return {
    id: receipt.id,
    filename: receipt.filename,
    uploadedAt: receipt.uploadedAt,
    vendor: receipt.data?.vendor ?? null,
    date: receipt.data?.date ?? null,
    total: receipt.data?.total ?? null,
    currency: receipt.data?.currency ?? null,
    category: receipt.data?.category ?? null,
    status: receipt.status,
    confidence: receipt.confidence ?? null,
    failureReason:
      receipt.failureReason ??
      receipt.checks.find((check) => !check.passed)?.details ??
      (receipt.status === "needs_review" &&
      receipt.confidence !== null &&
      receipt.confidence < config.confidenceThreshold
        ? `Confidence is ${receipt.confidence.toFixed(2)}, below the ${config.confidenceThreshold.toFixed(2)} review threshold.`
        : null),
  };
}

function startProcessing(receipt: Receipt): Receipt {
  // Terminal status is kept; GET reveals it only once the stage clock runs out.
  store.set(receipt.id, { receipt, startedAt: Date.now() });
  return { ...receipt, status: "processing", stage: "uploading" };
}

function titleFromFilename(filename: string): string {
  const base = filename
    .replace(/\.[^.]+$/, "")
    .replace(/[-_]+/g, " ")
    .trim();
  if (!base) return "Receipt";
  return base.replace(/\b\w/g, (c) => c.toUpperCase());
}

function uploadData(filename: string): { data: ExtractedData; confidence: number } {
  const subtotal = 24.5;
  const tax = 1.96;
  return {
    confidence: 0.88,
    data: {
      vendor: titleFromFilename(filename),
      date: new Date().toISOString().slice(0, 10),
      dateRaw: null,
      currency: "USD",
      subtotal,
      tax,
      total: round(subtotal + tax),
      category: "Uncategorised",
      lineItems: [
        { description: "Notebook, A5", quantity: 1, unitPrice: 14.5, lineTotal: 14.5 },
        { description: "Gel pens, pack of 4", quantity: 1, unitPrice: 10.0, lineTotal: 10.0 },
      ],
    },
  };
}

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json" } });

const failure = (status: number, code: string, message: string, retryAfter?: number) =>
  json({ error: { code, message, retryAfter } }, status);

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const mockFetch: typeof fetch = async (input, init) => {
  const request = input instanceof Request ? input : new Request(input, init);
  const url = new URL(request.url);
  const path = url.pathname;
  const method = request.method.toUpperCase();
  await sleep(120);
  seed();

  const sampleProcess = path.match(/^\/samples\/([^/]+)\/process$/);
  if (method === "POST" && sampleProcess) {
    const id = decodeURIComponent(sampleProcess[1]!);
    const fixture = fixtures[id];
    if (!fixture) return failure(404, "not_found", "Unknown sample.");
    const receipt = buildReceipt(
      crypto.randomUUID(),
      `${id}.jpg`,
      "jpg",
      fixture.data,
      fixture.confidence,
    );
    return json(startProcessing(receipt), 202);
  }

  const action = path.match(/^\/receipts\/([^/]+)\/(approve|reject)$/);
  if (method === "POST" && action) {
    const entry = store.get(decodeURIComponent(action[1]!));
    if (!entry) return failure(404, "not_found", "Unknown receipt.");
    if (entry.receipt.status !== "needs_review") {
      return failure(409, "conflict", "Only receipts awaiting review can be decided.");
    }
    entry.receipt.status = action[2] === "approve" ? "approved" : "rejected";
    return json(entry.receipt);
  }

  const detail = path.match(/^\/receipts\/([^/]+)$/);
  if (detail) {
    const id = decodeURIComponent(detail[1]!);
    if (method === "GET") {
      const receipt = stored(id);
      return receipt ? json(receipt) : failure(404, "not_found", "Unknown receipt.");
    }
    if (method === "PATCH") {
      const entry = store.get(id);
      if (!entry) return failure(404, "not_found", "Unknown receipt.");
      const body = (await request.json()) as { data?: ExtractedData };
      if (!body?.data) return failure(422, "invalid", "No data supplied.");
      const checks = runChecks(body.data);
      const updated: Receipt = {
        ...entry.receipt,
        data: body.data,
        checks,
        status: decide(
          checks,
          entry.receipt.confidence ?? 0,
          entry.receipt.status === "processing" ? undefined : entry.receipt.status,
        ),
        failureReason: null,
      };
      entry.receipt = updated;
      return json(updated);
    }
  }

  if (method === "GET" && path === "/receipts") {
    const status = url.searchParams.get("status");
    const category = url.searchParams.get("category");
    const q = url.searchParams.get("q")?.trim().toLowerCase();
    const sort = url.searchParams.get("sort") ?? "date";
    const order = url.searchParams.get("order") ?? "desc";
    const limit = Number(url.searchParams.get("limit") ?? 50);
    const offset = Number(url.searchParams.get("offset") ?? 0);
    const items = [...store.values()]
      .map((entry) => stored(entry.receipt.id) ?? entry.receipt)
      .map(summary)
      .filter((item) => (status ? item.status === status : true))
      .filter((item) => (category ? item.category === category : true))
      .filter(
        (item) =>
          !q || item.vendor?.toLowerCase().includes(q) || item.filename.toLowerCase().includes(q),
      )
      .sort((a, b) => {
        const pick =
          sort === "total"
            ? (r: ReceiptSummary) => r.total ?? 0
            : (r: ReceiptSummary) => Date.parse(r.uploadedAt);
        const delta = pick(a) - pick(b);
        return order === "asc" ? delta : -delta;
      });
    return json({ items: items.slice(offset, offset + limit), total: items.length });
  }

  if (method === "POST" && path === "/upload") {
    const form = await request.formData();
    const file = form.get("file");
    if (!(file instanceof File)) return failure(400, "invalid", "No file supplied.");
    const { data, confidence } = uploadData(file.name);
    const type =
      file.type === "application/pdf" ? "pdf" : file.type === "image/png" ? "png" : "jpg";
    const receipt = buildReceipt(crypto.randomUUID(), file.name, type, data, confidence);
    return json(startProcessing(receipt), 202);
  }

  if (method === "GET" && path === "/samples") return json(samples);
  if (method === "GET" && path === "/health") return json({ status: "ok" });

  return failure(404, "not_found", "Unknown route.");
};
