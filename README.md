# Ledger — receipt processor frontend

A public, no-login demo of an LLM receipt processor: upload a photo or PDF, see the extracted fields, the
arithmetic checks behind them, and a review queue for results that fail.

Design and product decisions live in [spec.md](./spec.md), [plan.md](./plan.md) and [DESIGN.md](./DESIGN.md).

## Run it

```bash
npm install
cp .env.example .env.local   # optional: leave NEXT_PUBLIC_API_URL empty to use the mock backend
npm run dev                  # http://localhost:3000
```

With `NEXT_PUBLIC_API_URL` empty the app runs against `src/lib/api/mock.ts`, an in-browser stand-in that
returns the same shapes as `contracts/openapi.json`. That is also what the Playwright suite uses, so the
demo and the tests work without a deployed backend. Set the variable to talk to the real API.

### Environment

| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_API_URL` | Backend base URL. Empty = mock backend. |
| `NEXT_PUBLIC_SHEET_URL` | Public read-only Google Sheet of approved rows. |
| `NEXT_PUBLIC_DEMO_VIDEO_URL` | Shown when the backend stays unreachable. |
| `NEXT_PUBLIC_REPO_URL` | Source link in the footer and on About. |
| `NEXT_PUBLIC_USE_MOCK` | `1` forces the mock backend even when an API URL is set. |

All values are public by design; no secret belongs in this app.

## The contract

`contracts/openapi.json` is the contract the frontend compiles against. It was hand-authored from
`plan.md` and **must be reconciled with the backend's exported schema** before launch:

```bash
curl https://your-app.onrender.com/openapi.json > contracts/openapi.json
npm run gen:api        # regenerates src/lib/api/schema.d.ts
```

CI fails when the generated file is stale.

## Checks

```bash
npm run lint
npm run typecheck
npm test          # Vitest: lib helpers, validation, checks, cold-start provider, audit rows
npm run e2e       # Playwright: P1 stories against the mock backend (installs no browsers)
```

`npm run e2e` needs browsers once: `npx playwright install chromium`.

## Deploy

1. Deploy the repository root to Vercel, Netlify, or Cloudflare Pages; set the environment variables there.
2. Add the deployed origin (and any preview origins) to the backend's CORS allow-list.
3. Open the live URL in incognito on desktop and on a phone, let the backend sleep, and run a sample.

## Deliberate limits

- **Retention 24 hours.** `config.retentionHours` and the footer copy must match the backend's cleanup job.
- **5 MB, first PDF page only.** Enforced by the backend; mirrored in `lib/validation/file.ts` for instant feedback.
- **Public review queue.** Anyone can approve or reject shared demo rows; there is no passcode.
- **Accuracy figures are unset.** `config.eval` holds `null` until the evaluation set runs; the About page
  renders "Not published yet" rather than an invented number.
- **No Lighthouse CI job.** Scores are checked manually against the deployed URL; budgets should come from a
  real measurement, not a guess in CI.
