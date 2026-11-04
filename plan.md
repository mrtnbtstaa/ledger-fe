# Implementation Plan: Receipt Processor Frontend

**Branch**: `001-receipt-frontend` | **Date**: 2026-11-04 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `spec.md`

---

## Summary

Build a public, no-login Next.js frontend for an LLM-powered receipt processor. The primary use case is a recruiter or interviewer opening a live link and, within about two minutes, seeing a receipt processed into validated structured data, understanding why the result can be trusted, and optionally correcting low-confidence results in a review queue.

The technical approach rests on three decisions:

1. **Static shell, client-side data.** Home and About pages are statically rendered so they load instantly even while the free-tier backend is asleep. All receipt data is fetched client-side.
2. **Cold start is a first-class state.** A global `BackendStatus` provider pings `/health` on first load, polls with backoff, and gates actions behind a visible "waking up" experience.
3. **Typed contract with the backend.** The API client is generated from the backend's OpenAPI schema, and Zod is used only for client-side form and file checks, so the frontend never drifts from the backend's types.

---

## Technical Context

| Item | Decision |
|---|---|
| **Language/Version** | TypeScript (strict mode), Node.js current LTS |
| **Framework** | Next.js, App Router (use the current stable release; verify at project creation) |
| **UI** | React with Tailwind CSS and shadcn/ui components (Radix primitives for accessibility) |
| **Server state** | TanStack Query (caching, polling, retries, mutations) |
| **Forms/validation** | React Hook Form + Zod (review edit form, file validation) |
| **API client** | `openapi-typescript` to generate types, `openapi-fetch` as the thin runtime client |
| **Icons** | lucide-react |
| **Storage** | None on the frontend. Optional `sessionStorage` for "last viewed receipt id" only, wrapped in try/catch |
| **Testing** | Vitest + React Testing Library (units/components), Playwright (P1 end-to-end), MSW (API mocking) |
| **Quality gates** | ESLint, `tsc --noEmit`, Prettier, Lighthouse CI |
| **Target platform** | Modern evergreen browsers; mobile-first from 360px; phones are a primary device |
| **Hosting** | Vercel, Netlify, or Cloudflare Pages free tier (static/serverless frontend that never sleeps). Backend is separate on Render |
| **Project type** | Web application (frontend only; backend is a separate repository or folder) |
| **Performance goals** | Home interactive in under 3s on a mid-range phone; warm sample result in under 10s; Lighthouse 90+ (Performance, Accessibility, Best Practices) |
| **Constraints** | Backend may be asleep (30 to 60s cold start); free LLM quota is limited; no secrets in client code; no accounts |
| **Scale/Scope** | Demo traffic (tens of visitors per day); 5 routes; about 25 components |

### Configuration (environment variables)

| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_API_URL` | Backend base URL (e.g. `https://your-app.onrender.com`) |
| `NEXT_PUBLIC_SHEET_URL` | Public read-only Google Sheet link |
| `NEXT_PUBLIC_DEMO_VIDEO_URL` | Backup demo video |
| `NEXT_PUBLIC_REPO_URL` | GitHub repository |

All are public by design. No secret ever lives in the frontend.

---

## Constitution Check

*Gate: must pass before implementation. Re-check after design.*

| Principle | How this plan complies |
|---|---|
| **Spec first** | Every component and hook traces to a user story or FR in `spec.md` (see Traceability) |
| **Simplicity** | No custom backend layer, no state library beyond TanStack Query, no auth, no database |
| **Testability** | P1 stories each have a Playwright test; components are tested with MSW-mocked APIs |
| **Accessibility** | Radix-based primitives, keyboard support, non-color status cues, contrast checks in CI |
| **Resilience** | Timeouts, retries, and user-facing messages for every network failure (FR-022 to FR-024) |
| **No secrets in client** | Only `NEXT_PUBLIC_*` values, all non-sensitive |

**Result**: Pass. No violations to justify (see Complexity Tracking).

---

## Key Technical Decisions

### D1: Static shell with client-side fetching
- **Decision**: `/` and `/about` render statically. `/history`, `/review`, and `/review/[id]` are client components that fetch after mount.
- **Rationale**: Visitors see a real page immediately while the backend wakes. SSR data fetching would block on a sleeping server and show an error page.
- **Alternatives rejected**: Server-side fetching in server components (fails or hangs on cold start); a full SPA without Next.js (loses static optimization and easy deployment).

### D2: Browser calls the backend directly, with CORS
- **Decision**: The browser calls `NEXT_PUBLIC_API_URL` directly. The backend allows only the deployed frontend origin plus `localhost` for development.
- **Rationale**: Proxying through Next.js route handlers or rewrites adds another timeout layer, which is risky when the backend takes up to a minute to wake, and serverless function time limits on free tiers may cut requests short.
- **Alternatives rejected**: Next.js rewrites or a BFF layer (extra timeouts and complexity).

### D3: Cold-start handling via a `BackendStatus` provider
- **Decision**: A client provider exposes `status: "unknown" | "waking" | "ready" | "unreachable"`. On mount it calls `GET /health`. If there is no response within 3s it moves to `waking` and retries with backoff (2s, 3s, 5s, capped) for up to about 90s, then moves to `unreachable`.
- **Rationale**: Directly satisfies FR-020, FR-021, and User Story 4. Gating actions on `ready` prevents confusing failures.
- **Behavior**: While `waking`, upload and sample buttons stay clickable but queue the action and show the banner. The queued action fires when status becomes `ready`.
- **Unreachable state**: Shows a retry button and a link to the demo video.

### D4: Processing progress model
- **Decision**: `POST /upload` (or the sample endpoint) returns a receipt id immediately with status `processing`. The frontend polls `GET /receipts/{id}` every 1.5s (TanStack Query `refetchInterval`) until a terminal status, and maps the backend `stage` field to the UI steps: Uploading, Extracting, Validating, Done.
- **Fallback**: If the backend processes synchronously and returns the finished receipt, the UI plays the stages briefly so the pipeline remains visible, and the result renders as soon as it arrives.
- **Open dependency**: The exact contract must be reconciled with the backend OpenAPI schema (see Contracts).

### D5: Typed API layer
- **Decision**: Generate types from the backend's `openapi.json` with `openapi-typescript`, and use `openapi-fetch` for requests. A thin `lib/api` module wraps it with timeouts (AbortController), error normalization, and a rate-limit (429) handler.
- **Rationale**: One source of truth for types. Contract changes surface as compile errors.

### D6: Client-side file validation
- **Decision**: Zod schema checks type (`image/jpeg`, `image/png`, `application/pdf`), size (limit from config, default 5 MB), and a non-empty file before any upload. Mobile capture uses `<input type="file" accept="image/*,application/pdf" capture>` behavior via a separate "Take photo" control.
- **Rationale**: Faster feedback and protects the LLM quota (FR-005). The backend remains the authority.

### D7: Review editing with live re-validation
- **Decision**: The edit form uses React Hook Form seeded from the receipt. On save it calls `PATCH /receipts/{id}`; the backend returns fresh validation results, which replace the displayed checks. Totals are never recomputed on the client.
- **Rationale**: Single source of truth for validation logic (backend), consistent with the spec's assumption.

### D8: Status is never conveyed by color alone
- **Decision**: A `StatusBadge` component renders icon + text + color for each status, driven by one status map.
- **Rationale**: FR-028.

### D9: Theming
- **Decision**: Design tokens as CSS variables in `globals.css`, mapped into the Tailwind config, with light and dark values via `prefers-color-scheme`. Tokens come from `DESIGN.md` if you create one.
- **Rationale**: FR-029 with minimal code.

### D10: Rate limiting UX
- **Decision**: HTTP 429 is mapped to a friendly message with the retry time (from `Retry-After` when present) and an alternate path: use a sample receipt or watch the demo video.
- **Rationale**: FR-023; protects the demo when quota is exhausted.

---

## Project Structure

### Documentation (this feature)

```
specs/001-receipt-frontend/
├── spec.md              # Feature specification
├── plan.md              # This file
├── research.md          # Decision log and alternatives (optional detail)
├── data-model.md        # Frontend types and state shapes
├── quickstart.md        # Run, test, deploy instructions
├── contracts/           # Backend API contract as consumed by the frontend
│   └── openapi.json     # Snapshot of the backend schema
└── tasks.md             # Created by /speckit-tasks
```

### Source code (repository root)

```
frontend/
├── src/
│   ├── app/
│   │   ├── layout.tsx                # Providers, fonts, global banner slot
│   │   ├── page.tsx                  # Home: samples, upload, result
│   │   ├── history/page.tsx          # Processed receipts table
│   │   ├── review/
│   │   │   ├── page.tsx              # Review queue
│   │   │   └── [id]/page.tsx         # Review detail + edit
│   │   ├── about/page.tsx            # Static case study page
│   │   ├── not-found.tsx
│   │   └── globals.css               # Design tokens
│   ├── components/
│   │   ├── ui/                       # shadcn/ui primitives
│   │   ├── backend-status/
│   │   │   ├── BackendStatusProvider.tsx
│   │   │   └── WakeUpBanner.tsx
│   │   ├── upload/
│   │   │   ├── Dropzone.tsx
│   │   │   ├── CameraButton.tsx
│   │   │   └── SamplePicker.tsx
│   │   ├── receipt/
│   │   │   ├── ProcessingStepper.tsx
│   │   │   ├── ResultCard.tsx
│   │   │   ├── LineItemsTable.tsx
│   │   │   ├── ValidationChecks.tsx
│   │   │   ├── ConfidenceMeter.tsx
│   │   │   ├── StatusBadge.tsx
│   │   │   └── FilePreview.tsx
│   │   ├── review/
│   │   │   ├── ReviewQueueList.tsx
│   │   │   └── ReviewEditForm.tsx
│   │   ├── history/
│   │   │   └── ReceiptsTable.tsx     # Filters + sorting
│   │   ├── common/
│   │   │   ├── ErrorState.tsx
│   │   │   ├── EmptyState.tsx
│   │   │   └── PrivacyNotice.tsx
│   │   └── about/
│   │       └── PipelineDiagram.tsx
│   ├── hooks/
│   │   ├── useBackendStatus.ts
│   │   ├── useUploadReceipt.ts
│   │   ├── useProcessSample.ts
│   │   ├── useReceipt.ts             # Polling until terminal status
│   │   ├── useReceipts.ts            # History + filters
│   │   └── useReviewActions.ts       # Patch, approve, reject
│   ├── lib/
│   │   ├── api/
│   │   │   ├── client.ts             # openapi-fetch + timeout + errors
│   │   │   ├── schema.d.ts           # Generated types (do not edit)
│   │   │   └── errors.ts             # Error normalization, 429 handling
│   │   ├── validation/
│   │   │   ├── file.ts               # Zod file schema
│   │   │   └── receipt-form.ts       # Zod edit form schema
│   │   ├── format.ts                 # Currency, date helpers
│   │   ├── status.ts                 # Status map (label, icon, tone)
│   │   └── config.ts                 # Reads NEXT_PUBLIC_* values
│   └── types/                        # Frontend-only derived types
├── public/
│   └── samples/                      # Sample receipt images + thumbnails
├── tests/
│   ├── unit/                         # Vitest
│   ├── e2e/                          # Playwright (P1 stories)
│   └── mocks/                        # MSW handlers and fixtures
├── .github/workflows/ci.yml          # Lint, typecheck, tests, Lighthouse
├── next.config.ts
├── tailwind.config.ts
├── package.json
└── tsconfig.json
```

**Structure decision**: A single Next.js application under `frontend/`, separate from the backend. Feature-grouped components (`upload`, `receipt`, `review`, `history`) keep related UI together, and all network access goes through hooks and `lib/api`, never directly from components.

---

## Data Model (frontend view)

Types come from the generated schema. This section describes shapes the UI relies on.

```ts
type ReceiptStatus = "processing" | "auto_approved" | "needs_review" | "approved" | "rejected" | "failed";

type ReceiptStage = "uploading" | "extracting" | "validating" | "done";

interface Receipt {
  id: string;
  filename: string;
  fileType: "jpg" | "png" | "pdf";
  uploadedAt: string;          // ISO 8601
  status: ReceiptStatus;
  stage?: ReceiptStage;
  confidence: number | null;   // 0 to 1
  fileUrl?: string;            // may be absent after retention expiry
  data: ExtractedData | null;
  checks: ValidationCheck[];
  cached?: boolean;            // true when served by file-hash cache
}

interface ExtractedData {
  vendor: string | null;
  date: string | null;
  currency: string | null;
  subtotal: number | null;
  tax: number | null;
  total: number | null;
  category: string | null;
  lineItems: LineItem[];
}

interface LineItem {
  description: string;
  quantity: number | null;
  unitPrice: number | null;
  lineTotal: number | null;
}

interface ValidationCheck {
  rule: string;                // e.g. "line_items_sum_to_subtotal"
  description: string;
  passed: boolean;
  details?: string;
}

type BackendStatus = "unknown" | "waking" | "ready" | "unreachable";
```

Null values render as "Not found" (FR-013).

---

## Contracts (as consumed by the frontend)

> **Assumption**: these endpoints match the backend. Reconcile against `contracts/openapi.json` before implementing and update this table if they differ.

| Method | Path | Purpose | Used by |
|---|---|---|---|
| GET | `/health` | Readiness and wake-up ping | BackendStatusProvider |
| POST | `/upload` (multipart) | Submit a receipt; returns `{ id, status }` | useUploadReceipt |
| GET | `/samples` | List sample ids, labels, and expected behavior | SamplePicker |
| POST | `/samples/{sampleId}/process` | Process a sample; returns `{ id, status }` | useProcessSample |
| GET | `/receipts/{id}` | Receipt detail with stage, data, and checks | useReceipt |
| GET | `/receipts?status=&category=&sort=&order=` | History and review queue (`status=needs_review`) | useReceipts |
| PATCH | `/receipts/{id}` | Save edited fields; returns updated checks | useReviewActions |
| POST | `/receipts/{id}/approve` | Approve | useReviewActions |
| POST | `/receipts/{id}/reject` | Reject | useReviewActions |

**Error shape (expected)**: `{ error: { code: string, message: string, retryAfter?: number } }`. Anything else is normalized to a generic error (FR-024).

**Status codes the UI handles explicitly**: 400/422 (validation), 413 (too large), 415 (unsupported type), 429 (rate limit), 5xx (generic), and network timeouts.

---

## Traceability: Spec to Plan

| Spec item | Plan elements |
|---|---|
| US1, FR-001 to FR-003 | `SamplePicker`, `useProcessSample`, `PrivacyNotice`, `public/samples` |
| US2, FR-004 to FR-007 | `Dropzone`, `CameraButton`, `lib/validation/file.ts`, `useUploadReceipt` |
| US3, FR-008 to FR-013 | `ResultCard`, `ValidationChecks`, `ConfidenceMeter`, `StatusBadge`, `FilePreview`, `LineItemsTable` |
| US4, FR-020 to FR-024 | `BackendStatusProvider`, `WakeUpBanner`, `ErrorState`, `lib/api/errors.ts`, D3, D10 |
| US5, FR-014 to FR-017 | `/review` pages, `ReviewQueueList`, `ReviewEditForm`, `useReviewActions` |
| US6, FR-018, FR-019 | `/history`, `ReceiptsTable`, `useReceipts`, sheet link from config |
| US7, FR-025 | `/about`, `PipelineDiagram`, config links |
| US8, FR-026 | Mobile-first Tailwind layouts, stacked line items at small widths |
| FR-027, FR-028 | Radix primitives, focus styles, `StatusBadge` (D8) |
| FR-029 | Token-based theming (D9) |
| FR-030 | `lib/config.ts` reads only `NEXT_PUBLIC_*` values |

---

## Testing Strategy

| Level | Tooling | What it covers |
|---|---|---|
| **Unit** | Vitest | `lib/format`, `lib/validation/*`, `lib/status`, error normalization |
| **Component** | Vitest + RTL + MSW | `Dropzone` rejections, `ResultCard` states, `ValidationChecks`, `ReviewEditForm` |
| **End-to-end (P1)** | Playwright with MSW or a mocked backend | US1 sample flow, US2 upload flow, US3 failed-check display, US4 cold start (delayed `/health`) |
| **End-to-end (P2)** | Playwright | US5 review edit and approve, US6 history filters |
| **Accessibility** | `axe` checks in Playwright | No serious violations on every route |
| **Performance** | Lighthouse CI | Scores of 90+ on the home page |
| **Manual** | Real phone, incognito window | Camera capture, 375px layout, actual cold start against the deployed backend |

**Cold-start test**: mock `/health` to respond after 20s and assert the banner appears, actions queue, and the banner clears on success without a refresh.

---

## Deployment & CI

1. **CI (GitHub Actions)** on every pull request: install, lint, `tsc --noEmit`, unit and component tests, build, Playwright P1 tests, Lighthouse CI.
2. **Deploy** the `frontend/` directory to the chosen host with environment variables set in the host dashboard. Use preview deployments for pull requests.
3. **Backend CORS**: add the production and preview origins to the backend's allowed list. Preview URLs change, so decide whether to allow a wildcard pattern for previews or test previews against localhost only.
4. **Schema sync**: a script (`npm run gen:api`) regenerates `schema.d.ts` from the backend's `/openapi.json`. CI fails if the generated file is out of date.
5. **Post-deploy checks**: open the live URL in incognito on desktop and phone, let the backend sleep, and run the sample flow end to end.

---

## Implementation Phases (input for `/speckit-tasks`)

1. **Foundation**: Create the Next.js project, configure Tailwind, shadcn/ui, and design tokens, set up the config module, CI, and the MSW mock layer. Generate the API client from the OpenAPI snapshot.
2. **Cold start and shell**: `BackendStatusProvider`, `WakeUpBanner`, layout, navigation, `PrivacyNotice`, and the About page (static, so it can ship early).
3. **P1 core flow**: `SamplePicker`, `Dropzone`, `CameraButton`, upload and sample hooks, `ProcessingStepper`, `ResultCard`, `ValidationChecks`, `StatusBadge`, and error states. Playwright tests for US1 to US4.
4. **P2 features**: History table with filters, review queue and detail page, edit form with re-validation, approve and reject, and Google Sheet link.
5. **Polish**: Mobile pass at 375px, dark mode review, accessibility audit, Lighthouse tuning, and empty and error state review.
6. **Ship**: Deploy, set backend CORS, run post-deploy checks, record the demo video, and add the live link and screenshots to the README.

---

## Risks & Mitigations

| Risk | Impact | Mitigation |
|---|---|---|
| Backend cold start exceeds the wait window | Visitor sees a failed demo | Ping on page load, queue actions, long timeout with retry, backup demo video link |
| LLM quota exhausted or rate limited | Uploads fail for visitors | 429 messaging, sample receipts served from cache, per-IP limits on the backend |
| API contract drift between repos | Runtime errors | Generated types, CI drift check |
| Shared public demo data gets vandalized | Review queue shows junk | Resolve the open question on a passcode or reset job; backend retention policy |
| Visitors upload sensitive documents | Privacy exposure | Visible notice, short retention, no accounts or stored identities |
| CORS misconfiguration on preview deployments | Preview environments fail | Decide an explicit allowed-origin strategy up front |
| Free-tier host terms change | Deployment surprise | Verify current limits at deploy time; keep the frontend portable (no host-specific APIs) |

---

## Complexity Tracking

No constitution violations. Items worth flagging as deliberate additions beyond the minimum:

| Addition | Why it is justified | Simpler alternative rejected because |
|---|---|---|
| TanStack Query | Polling, retries, caching, and mutations are central to the app | Hand-rolled `useEffect` fetching would duplicate this logic and be harder to test |
| Generated API types | Prevents contract drift between two separately deployed repos | Hand-written types will silently go stale |
| MSW | Enables deterministic tests of cold start and failure states | Hitting a real backend makes cold-start and rate-limit tests impractical |

---

## Open Items Carried From the Spec

- Review queue access (public versus passcode)
- Upload retention period
- Session-scoped versus global history
- PDF size and page limits

Resolve these before generating `tasks.md`, since each affects the contract and some components.
