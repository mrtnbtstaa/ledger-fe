# Feature Specification: Receipt Processor Frontend

**Feature Branch**: `001-receipt-frontend`
**Created**: 2026-11-04
**Status**: Draft
**Input**: Build a public web frontend for an LLM-powered receipt and invoice processor. A visitor (for example, a recruiter or interviewer) must be able to open a live link, try the product in under two minutes, and see extracted data, validation results, and a human review queue.

> This spec describes **what** the frontend does and **why**. Stack and architecture choices live in [Implementation Constraints](#implementation-constraints-input-for-speckit-plan) and should be carried into `/speckit-plan`.

---

## Context & Goals

The backend (FastAPI + Groq) turns receipt photos and PDFs into validated, structured JSON and logs approved rows to a Google Sheet. The frontend is the only part most visitors will ever see, so it must:

1. Let anyone try the product without signing up or owning a real receipt.
2. Make the AI pipeline visible: extraction, validation checks, confidence, and what happens when it fails.
3. Stay usable on a free-tier backend that sleeps when idle (cold start of roughly 30 to 60 seconds).
4. Protect a limited free LLM quota from abuse.

**Primary audience**: interviewers and hiring managers spending about two minutes on the demo.
**Secondary audience**: small business owners and freelancers who would use the tool for real bookkeeping.

---

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Try a sample receipt instantly (Priority: P1)

A visitor lands on the page with no receipt at hand. They click "Try a sample receipt", pick one of a few pre-loaded examples, and watch it get processed and displayed as structured data.

**Why this priority**: This is the interviewer's first and possibly only interaction. If it fails, the project fails.

**Independent Test**: Open the home page in a fresh incognito window, click a sample, and confirm a complete result appears with no other setup.

**Acceptance Scenarios**:

1. **Given** the home page is loaded, **When** the visitor clicks a sample receipt, **Then** processing starts and a progress state is shown.
2. **Given** processing completes, **When** the result arrives, **Then** vendor, date, line items, subtotal, tax, total, currency, and category are displayed in a readable layout.
3. **Given** the visitor has not uploaded anything, **When** they use a sample, **Then** no file picker, login, or permission prompt is required.

---

### User Story 2 - Upload my own receipt (Priority: P1)

A visitor uploads a receipt photo or PDF, by file picker, drag and drop, or phone camera, and receives structured results.

**Why this priority**: This is the core product value and proves the system handles real, messy input.

**Independent Test**: Upload a JPG, PNG, and PDF receipt and confirm each returns a result or a clear error.

**Acceptance Scenarios**:

1. **Given** a visitor selects a supported file (JPG, PNG, or PDF within the size limit), **When** they submit it, **Then** the file is uploaded and a processing state appears.
2. **Given** a visitor is on a phone, **When** they tap the upload control, **Then** they can choose between taking a photo and picking an existing file.
3. **Given** a visitor selects an unsupported or oversized file, **When** they try to submit, **Then** a clear message explains the problem and nothing is uploaded.
4. **Given** the visitor drags a file onto the drop zone on desktop, **When** they release it, **Then** it behaves the same as selecting through the picker.

---

### User Story 3 - See why the result can be trusted (Priority: P1)

A visitor viewing a result can see the validation checks the system ran (for example, line items sum to the subtotal, subtotal plus tax equals total) and a confidence indicator, so they understand the output is verified and not just generated.

**Why this priority**: This is the main differentiator versus a basic LLM wrapper and is the strongest interview talking point.

**Independent Test**: Process a sample with a known arithmetic error and confirm the failed check is visible and the result is marked as needing review.

**Acceptance Scenarios**:

1. **Given** a result is displayed, **When** the visitor looks at it, **Then** each validation check is shown with a pass or fail state.
2. **Given** all checks pass and confidence is high, **When** the result is displayed, **Then** it is labeled as auto-approved.
3. **Given** any check fails or confidence is low, **When** the result is displayed, **Then** it is labeled "Needs review" with the reason visible.

---

### User Story 4 - Handle the sleeping backend gracefully (Priority: P1)

The backend may be asleep. The visitor sees a friendly waking-up state instead of an error or a frozen page.

**Why this priority**: On a free tier, most first visits hit a cold start. A broken first impression would cost the whole demo.

**Independent Test**: Let the backend sleep, load the page, and confirm the wake-up message appears and resolves without user action.

**Acceptance Scenarios**:

1. **Given** the page loads, **When** it starts, **Then** it immediately pings the backend health endpoint to begin waking it.
2. **Given** the backend has not responded yet, **When** the visitor interacts with the page, **Then** a message like "Waking up the server, about 30 seconds" is shown with a visible progress indicator.
3. **Given** the backend becomes ready, **When** the health check succeeds, **Then** the message disappears and actions become available without a manual refresh.
4. **Given** the backend is unreachable after a long timeout, **When** the wait ends, **Then** a clear error is shown with a retry button and a link to a backup demo video.

---

### User Story 5 - Review and correct low-confidence results (Priority: P2)

A reviewer opens the review queue, sees receipts that failed validation, edits the extracted fields, and approves or rejects them.

**Why this priority**: It demonstrates the human-in-the-loop design, but the demo is still valuable without it.

**Independent Test**: Process a receipt that fails validation, open the review queue, correct a field, approve, and confirm the status changes.

**Acceptance Scenarios**:

1. **Given** receipts are flagged "Needs review", **When** the visitor opens the review queue, **Then** the flagged receipts are listed with vendor, date, total, and failure reason.
2. **Given** a visitor opens one flagged receipt, **When** the detail view loads, **Then** the original image or PDF appears beside editable extracted fields.
3. **Given** the visitor edits a field, **When** they save, **Then** validation re-runs and the new check results are shown.
4. **Given** the visitor approves a receipt, **When** the action succeeds, **Then** its status changes to approved and it leaves the queue.
5. **Given** the visitor rejects a receipt, **When** the action succeeds, **Then** its status changes to rejected and it leaves the queue.

---

### User Story 6 - Browse processed receipts and see the live output (Priority: P2)

A visitor can see a table of previously processed receipts and a link to the public Google Sheet where approved rows appear.

**Why this priority**: It proves the automation actually produces a real downstream result.

**Independent Test**: Process a sample, then confirm it appears in the history table and the Google Sheet link opens.

**Acceptance Scenarios**:

1. **Given** receipts have been processed, **When** the visitor opens the history page, **Then** a table lists them with date, vendor, total, category, and status.
2. **Given** the table is displayed, **When** the visitor filters by status or category, **Then** only matching rows are shown.
3. **Given** the visitor clicks a row, **When** the detail opens, **Then** the full extracted data and validation results are shown.
4. **Given** the visitor clicks "Open Google Sheet", **When** the link is followed, **Then** the public read-only sheet opens in a new tab.

---

### User Story 7 - Understand the project and its accuracy (Priority: P2)

A visitor can read a short "About" page covering the problem, how it works, and measured accuracy from the evaluation set.

**Why this priority**: It converts a working demo into a persuasive case study.

**Independent Test**: Open the About page and confirm the problem statement, pipeline diagram, accuracy figures, and repository link are present.

**Acceptance Scenarios**:

1. **Given** the visitor opens the About page, **When** it loads, **Then** it shows the problem, the pipeline steps, and headline accuracy figures.
2. **Given** the page is displayed, **When** the visitor looks for source code, **Then** links to the GitHub repository and the demo video are visible.

---

### User Story 8 - Use it comfortably on a phone (Priority: P3)

A visitor on a mobile device can complete the full upload-to-result flow with a layout built for small screens.

**Why this priority**: Receipts are naturally photographed on phones, and interviewers may open the link from one.

**Independent Test**: Run the upload flow at a 375px viewport and confirm there is no horizontal scrolling and all controls are tappable.

**Acceptance Scenarios**:

1. **Given** a viewport of 375px width, **When** any page loads, **Then** no content is cut off or requires sideways scrolling.
2. **Given** a mobile visitor, **When** they view a result, **Then** line items stack readably instead of overflowing.

---

### Edge Cases

- **Cold start in progress**: The visitor clicks upload while the backend is still waking. The action is queued or blocked with a clear message, and never fails silently.
- **Rate limit reached (per-IP or LLM quota)**: Show a friendly message explaining the limit and when to retry, and point the visitor to sample receipts and the demo video.
- **LLM returns invalid or incomplete data**: Show the result as "Needs review" with the failed fields highlighted, not a crash.
- **Blurry or unreadable image**: Show a specific message suggesting a clearer photo, with an option to retry.
- **Multi-page PDF or very large file**: Enforce the limit before upload and explain it.
- **Network drops mid-upload**: Show a retry option without losing the selected file.
- **Duplicate upload (same file hash)**: Show the cached result and say it was already processed.
- **Receipt with no line items or no tax**: Display absent fields as "Not found" and not as blank or zero.
- **Multiple currencies or unusual date formats**: Display the extracted currency code and the original and normalized date.
- **JavaScript slow or disabled**: The shell and About page still render meaningful content.
- **Visitor uploads sensitive or personal documents**: A visible notice asks them to use sample or non-sensitive receipts only.
- **Backend returns an unexpected error shape**: The UI shows a generic error and logs details, never raw stack traces.

---

## Requirements *(mandatory)*

### Functional Requirements

**Landing and onboarding**

- **FR-001**: The home page MUST present a one-sentence value proposition and two primary actions: "Try a sample receipt" and "Upload your own".
- **FR-002**: The system MUST offer at least three pre-loaded sample receipts, including one that triggers a validation failure.
- **FR-003**: The home page MUST show a notice asking visitors not to upload sensitive documents.

**Upload**

- **FR-004**: Users MUST be able to upload JPG, PNG, and PDF files via file picker, drag and drop, and mobile camera capture.
- **FR-005**: The system MUST validate file type and size on the client before upload and show a specific error on failure.
- **FR-006**: The system MUST show upload and processing progress, with distinct states for uploading, extracting, validating, and done.
- **FR-007**: The system MUST allow a failed upload to be retried without re-selecting the file.

**Results display**

- **FR-008**: The system MUST display extracted vendor, date, line items, subtotal, tax, total, currency, and category.
- **FR-009**: The system MUST display each validation check with a pass or fail state and a human-readable description.
- **FR-010**: The system MUST display a status of Auto-approved, Needs review, Approved, or Rejected.
- **FR-011**: The system MUST display a confidence indicator for the overall result.
- **FR-012**: The system MUST show the original uploaded file next to the extracted data where the file is retained.
- **FR-013**: Fields that were not found MUST be shown as "Not found".

**Review queue**

- **FR-014**: The system MUST provide a list of receipts awaiting review.
- **FR-015**: Users MUST be able to edit extracted fields and line items on a flagged receipt.
- **FR-016**: The system MUST re-run and display validation after an edit.
- **FR-017**: Users MUST be able to approve or reject a flagged receipt.

**History and output**

- **FR-018**: The system MUST provide a history table with filtering by status and category and sorting by date and total.
- **FR-019**: The system MUST provide a link to the public Google Sheet of approved receipts.

**Resilience and cold start**

- **FR-020**: The frontend MUST call the backend health endpoint on first page load to trigger a wake-up.
- **FR-021**: The frontend MUST display a waking-up state while the backend is not ready and MUST enable actions automatically once it is.
- **FR-022**: The frontend MUST apply timeouts and show retry options for every network request.
- **FR-023**: The frontend MUST show a user-friendly message for rate-limit responses.
- **FR-024**: The frontend MUST never display raw server errors or stack traces.

**About and credibility**

- **FR-025**: The About page MUST present the problem statement, a pipeline diagram, evaluation accuracy figures, and links to the repository and a demo video.

**Cross-cutting**

- **FR-026**: All pages MUST be responsive from 360px to desktop widths.
- **FR-027**: All interactive elements MUST be keyboard accessible and have visible focus states.
- **FR-028**: Status information MUST NOT rely on color alone (use icons or text too).
- **FR-029**: The frontend MUST support light and dark color schemes based on the visitor's system setting.
- **FR-030**: The frontend MUST NOT expose any API keys or secrets in client code.

### Key Entities

- **Receipt**: One processed document. Attributes: id, original filename, file type, upload time, status (auto-approved, needs review, approved, rejected), confidence, file reference.
- **Extracted Data**: The structured output for a receipt. Attributes: vendor, date, currency, subtotal, tax, total, category, raw text availability.
- **Line Item**: One row on a receipt. Attributes: description, quantity, unit price, line total.
- **Validation Check**: One rule applied to a receipt. Attributes: rule name, description, passed or failed, details.
- **Sample Receipt**: A built-in example. Attributes: id, label, thumbnail, expected behavior (clean or fails validation).
- **Backend Status**: The frontend's view of server readiness. Values: unknown, waking, ready, unreachable.

---

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A first-time visitor can go from page load to a displayed result in under 90 seconds, including a cold start, using a sample receipt.
- **SC-002**: With a warm backend, a sample result appears within 10 seconds of the click.
- **SC-003**: At least 95% of visitors who click a sample reach a displayed result without needing to refresh.
- **SC-004**: The home page is interactive in under 3 seconds on a mid-range phone over a typical mobile connection.
- **SC-005**: Lighthouse scores of at least 90 for Performance, Accessibility, and Best Practices on the home page.
- **SC-006**: Every user-facing error state listed in Edge Cases displays a specific, actionable message (verified by manual test).
- **SC-007**: The full upload-to-result flow works at 375px width with no horizontal scrolling.
- **SC-008**: An interviewer unfamiliar with the project can state what it does and how it verifies results after using it for two minutes (verified by informal user test with at least three people).

---

## Assumptions

- The backend exposes REST endpoints for: health check, upload, sample processing, receipt listing and detail, field update, and approve/reject. Exact paths and payloads are defined in the backend's OpenAPI document.
- The backend returns validation checks and a confidence value with each result, so the frontend displays them and does not recompute them.
- No user accounts or login are required. All visitors share the same demo data, and the review queue is open to anyone.
- Because demo data is shared and public, uploads are auto-deleted by the backend after a retention period, and the UI says so.
- The backend enforces file size limits and per-IP rate limits. The frontend duplicates basic checks only for faster feedback.
- The public Google Sheet link and demo video URL are provided as configuration values.
- Telegram bot integration is out of scope for this frontend.

---

## Out of Scope

- User accounts, authentication, and per-user data
- Billing, plans, or usage dashboards
- Exporting to accounting software beyond the Google Sheet link
- Multi-language UI
- Offline support
- Bulk upload of many receipts at once (candidate for a later version)

---

## Open Questions

- [NEEDS CLARIFICATION: Should the review queue be public to all visitors, or hidden behind a simple shared passcode to prevent vandalism of demo data?]
- [NEEDS CLARIFICATION: How long should uploaded files and results be retained before auto-deletion (for example, 1 hour, 24 hours)?]
- [NEEDS CLARIFICATION: Should visitors see only their own uploads (session-scoped) or all demo receipts in the history table?]
- [NEEDS CLARIFICATION: Maximum file size and page count accepted for PDFs?]

---

## Implementation Constraints (input for `/speckit-plan`)

These are decisions already made, listed here so the planning step starts from them.

- **Framework**: Next.js (App Router) with TypeScript
- **Styling**: Tailwind CSS; a component library such as shadcn/ui is acceptable
- **Data fetching**: A typed API client generated from or aligned with the backend OpenAPI schema; TanStack Query or SWR for server state and polling
- **Forms and validation**: React Hook Form with Zod for the review/edit form and client-side file checks
- **Hosting**: Vercel, Netlify, or Cloudflare Pages (free tier). The backend runs separately on Render and the frontend reads its base URL from `NEXT_PUBLIC_API_URL`
- **Rendering strategy**: Static or server-rendered shell for the home and About pages so they load instantly while the backend is asleep. Client-side fetching for processing, history, and review
- **Testing**: Vitest and React Testing Library for components, Playwright for the P1 user stories end to end
- **Quality gates**: ESLint, TypeScript strict mode, and Lighthouse CI on pull requests
- **Configuration values**: `NEXT_PUBLIC_API_URL`, `NEXT_PUBLIC_SHEET_URL`, `NEXT_PUBLIC_DEMO_VIDEO_URL`, `NEXT_PUBLIC_REPO_URL`
- **Security**: No secrets in client code; backend CORS restricted to the deployed frontend origin

---

## Suggested Pages

| Route | Purpose | Related stories |
|---|---|---|
| `/` | Landing, sample picker, upload, result view | 1, 2, 3, 4 |
| `/review` | Review queue list | 5 |
| `/review/[id]` | Review detail and edit | 5 |
| `/history` | Processed receipts table | 6 |
| `/about` | Problem, pipeline, accuracy, links | 7 |

---

## Review & Acceptance Checklist

- [ ] No implementation details leak into requirements (stack choices are confined to Implementation Constraints)
- [ ] Every user story is independently testable and has a priority
- [ ] All `[NEEDS CLARIFICATION]` items are resolved
- [ ] Requirements are testable and unambiguous
- [ ] Success criteria are measurable
- [ ] Scope and out-of-scope items are clear
