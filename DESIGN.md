---
version: alpha
name: Ledger
description: A calm, paper-and-ink interface for turning receipts into verified data. Warm neutrals, one committed green, monospaced figures.

colors:
  # Light ("paper") theme
  paper: "#F6F3EC"
  surface: "#FFFDF8"
  surface-sunken: "#EDE9DF"
  ink: "#1B1A17"
  ink-muted: "#5C584E"
  line: "#D9D3C5"
  accent: "#1E5B45"
  accent-deep: "#154634"
  accent-soft: "#E3EFE8"
  success: "#1E5B45"
  success-soft: "#E3EFE8"
  warning: "#8A5300"
  warning-soft: "#FBEFD5"
  danger: "#A32A1F"
  danger-soft: "#FBE4E0"
  info: "#234E78"
  info-soft: "#E1ECF6"
  # Dark ("ink") theme. Extension keys; consumers should tolerate them.
  dark-paper: "#14130F"
  dark-surface: "#1D1B17"
  dark-surface-sunken: "#0F0E0B"
  dark-ink: "#F1EDE2"
  dark-ink-muted: "#B2AC9D"
  dark-line: "#3A362E"
  dark-accent: "#6FCB9F"
  dark-accent-soft: "#17302A"
  dark-warning: "#F0B85A"
  dark-warning-soft: "#33260F"
  dark-danger: "#FF9C8F"
  dark-danger-soft: "#3A1B17"
  dark-info: "#8DBBEA"
  dark-info-soft: "#14263A"

typography:
  display:
    fontFamily: "Newsreader, Georgia, 'Times New Roman', serif"
    fontSize: "clamp(2rem, 5vw, 3.25rem)"
    fontWeight: 500
    lineHeight: 1.1
    letterSpacing: "-0.01em"
  headline:
    fontFamily: "Newsreader, Georgia, 'Times New Roman', serif"
    fontSize: "1.75rem"
    fontWeight: 500
    lineHeight: 1.2
    letterSpacing: "-0.005em"
  title:
    fontFamily: "Geist, system-ui, -apple-system, 'Segoe UI', sans-serif"
    fontSize: "1.125rem"
    fontWeight: 600
    lineHeight: 1.35
  body:
    fontFamily: "Geist, system-ui, -apple-system, 'Segoe UI', sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.55
  body-sm:
    fontFamily: "Geist, system-ui, -apple-system, 'Segoe UI', sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontFamily: "Geist, system-ui, -apple-system, 'Segoe UI', sans-serif"
    fontSize: "0.75rem"
    fontWeight: 600
    lineHeight: 1.3
    letterSpacing: "0.06em"
  button:
    fontFamily: "Geist, system-ui, -apple-system, 'Segoe UI', sans-serif"
    fontSize: "0.9375rem"
    fontWeight: 600
    lineHeight: 1.2
  figure:
    fontFamily: "'Geist Mono', ui-monospace, 'SF Mono', Menlo, Consolas, monospace"
    fontSize: "0.9375rem"
    fontWeight: 500
    lineHeight: 1.4
    fontFeature: "'tnum' 1, 'zero' 1"
  figure-lg:
    fontFamily: "'Geist Mono', ui-monospace, 'SF Mono', Menlo, Consolas, monospace"
    fontSize: "1.75rem"
    fontWeight: 500
    lineHeight: 1.2
    fontFeature: "'tnum' 1, 'zero' 1"

rounded:
  none: "0px"
  sm: "4px"
  md: "8px"
  lg: "12px"
  full: "999px"

spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "40px"
  2xl: "64px"

components:
  button-primary:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.surface}"
    typography: "{typography.button}"
    rounded: "{rounded.sm}"
    padding: "10px 18px"
    height: "44px"
  button-primary-hover:
    backgroundColor: "{colors.accent-deep}"
    textColor: "{colors.surface}"
  button-secondary:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    typography: "{typography.button}"
    rounded: "{rounded.sm}"
    padding: "10px 18px"
    height: "44px"
  button-ghost:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.accent}"
    typography: "{typography.button}"
    rounded: "{rounded.sm}"
    padding: "10px 12px"
    height: "44px"
  input:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    rounded: "{rounded.sm}"
    padding: "10px 12px"
    height: "44px"
  receipt-card:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
    padding: "24px"
  panel-sunken:
    backgroundColor: "{colors.surface-sunken}"
    textColor: "{colors.ink-muted}"
    rounded: "{rounded.md}"
    padding: "16px"
  dropzone:
    backgroundColor: "{colors.surface-sunken}"
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    rounded: "{rounded.md}"
    padding: "40px 24px"
  table-header:
    backgroundColor: "{colors.surface-sunken}"
    textColor: "{colors.ink-muted}"
    typography: "{typography.label}"
    padding: "8px 12px"
  badge-auto-approved:
    backgroundColor: "{colors.accent-soft}"
    textColor: "{colors.accent}"
    typography: "{typography.label}"
    rounded: "{rounded.sm}"
    padding: "2px 8px"
  badge-approved:
    backgroundColor: "{colors.success-soft}"
    textColor: "{colors.success}"
    typography: "{typography.label}"
    rounded: "{rounded.sm}"
    padding: "2px 8px"
  badge-needs-review:
    backgroundColor: "{colors.warning-soft}"
    textColor: "{colors.warning}"
    typography: "{typography.label}"
    rounded: "{rounded.sm}"
    padding: "2px 8px"
  badge-rejected:
    backgroundColor: "{colors.danger-soft}"
    textColor: "{colors.danger}"
    typography: "{typography.label}"
    rounded: "{rounded.sm}"
    padding: "2px 8px"
  badge-processing:
    backgroundColor: "{colors.info-soft}"
    textColor: "{colors.info}"
    typography: "{typography.label}"
    rounded: "{rounded.sm}"
    padding: "2px 8px"
  banner-wakeup:
    backgroundColor: "{colors.info-soft}"
    textColor: "{colors.info}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.sm}"
    padding: "12px 16px"
  banner-error:
    backgroundColor: "{colors.danger-soft}"
    textColor: "{colors.danger}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.sm}"
    padding: "12px 16px"
---

## Overview

**Creative north star: "The Audited Receipt."**

This product takes a messy piece of paper and returns something checked, structured, and trustworthy. The interface should feel like a well-kept ledger: warm paper, dark ink, one deliberate green, and numbers set in a monospaced face that line up. It should look like it was designed by someone who has handled real bookkeeping, not generated from a template.

**What the interface should communicate**

- *Precision.* Figures align, units are explicit, and nothing is approximated visually.
- *Verification.* Every result shows its checks. Trust is earned on screen, not claimed in copy.
- *Calm.* A bookkeeping tool should lower stress. Quiet surfaces, generous space, and almost no decoration.
- *Honesty.* Missing data says "Not found". Failures say what failed.

**Signature elements** (use these consistently; they are what makes the product recognizable)

1. **The receipt card.** The extracted result is rendered as a receipt: paper surface, hairline border, monospaced figures right-aligned, dotted leaders connecting item names to prices, and a subtle perforated (zigzag) bottom edge. This is the one "illustrative" element in the product, so use it only for the result view.
2. **Monospaced, tabular figures** for every amount, date, and quantity.
3. **Audit rows.** Validation checks appear as a ruled list beneath the receipt, each with an icon, a plain-language rule, and a pass or fail state.
4. **One accent.** "Ledger green" is the only brand color. Everything else is neutral or a semantic status color.

**Voice** (applies to all interface text)

Plain, specific, and calm. No exclamation marks, no hype, no "magic" or "AI-powered" language in the UI. Say what happened and what the person can do next.

- Good: "Line items add up to $42.10, but the subtotal reads $41.10."
- Bad: "Oops! Something went wrong. Please try again later."

## Colors

The palette is warm neutrals plus one green. Backgrounds are never pure white or pure black.

| Role | Light token | Dark token | Use |
|---|---|---|---|
| Page background | `paper` `#F6F3EC` | `dark-paper` `#14130F` | App background |
| Surface | `surface` `#FFFDF8` | `dark-surface` `#1D1B17` | Cards, inputs, receipt |
| Sunken surface | `surface-sunken` `#EDE9DF` | `dark-surface-sunken` `#0F0E0B` | Dropzone, table headers, secondary panels |
| Text | `ink` `#1B1A17` | `dark-ink` `#F1EDE2` | Primary text |
| Muted text | `ink-muted` `#5C584E` | `dark-ink-muted` `#B2AC9D` | Secondary text, captions |
| Hairline | `line` `#D9D3C5` | `dark-line` `#3A362E` | Borders and dividers |
| Accent | `accent` `#1E5B45` | `dark-accent` `#6FCB9F` | Primary buttons, links, focus ring, key highlights |
| Accent hover | `accent-deep` `#154634` | `dark-accent` lightened 8% | Hover and pressed states |

**Status colors** (always paired with an icon and a text label, never color alone)

| Status | Light (text on tint) | Dark (text on tint) | Icon |
|---|---|---|---|
| Auto-approved | `accent` on `accent-soft` | `dark-accent` on `dark-accent-soft` | `badge-check` |
| Approved | `success` on `success-soft` | `dark-accent` on `dark-accent-soft` | `check` |
| Needs review | `warning` on `warning-soft` | `dark-warning` on `dark-warning-soft` | `triangle-alert` |
| Rejected | `danger` on `danger-soft` | `dark-danger` on `dark-danger-soft` | `x` |
| Processing | `info` on `info-soft` | `dark-info` on `dark-info-soft` | `loader` (static when reduced motion is on) |

**Rules**

- Text and background pairs MUST meet WCAG AA contrast (4.5:1 for body text, 3:1 for large text and UI boundaries).
- Use the accent sparingly: at most one primary action per view, plus links and the focus ring. If everything is green, nothing is.
- Theme follows the system setting (`prefers-color-scheme`). Expose tokens as CSS variables on `:root` and redefine them for dark. Never hard-code hex values in components.
- In dark mode, the receipt card keeps its `dark-surface` background and a slightly brighter hairline so it still reads as a distinct object.

## Typography

Three families, each with a job.

| Family | Role | Source |
|---|---|---|
| **Newsreader** (serif) | Page titles and section headlines only | Google Fonts via `next/font` |
| **Geist** (sans) | All interface text: body, labels, buttons, tables | `next/font` |
| **Geist Mono** | All figures: amounts, dates, quantities, IDs, confidence values | `next/font` |

Always define fallback stacks as listed in the tokens. If a font fails to load, the layout must not shift noticeably.

**Scale**

| Token | Size | Use |
|---|---|---|
| `display` | 32 to 52px (fluid) | Home page headline only |
| `headline` | 28px | Page and section titles |
| `title` | 18px | Card titles, row titles |
| `body` | 16px | Default text |
| `body-sm` | 14px | Captions, helper text, table cells |
| `label` | 12px, uppercase, +6% tracking | Table headers, badges, field labels |
| `figure` | 15px mono | Inline amounts and dates |
| `figure-lg` | 28px mono | The receipt total |

**Rules**

- Use `tnum` (tabular numerals) and slashed or dotted zeros on every figure so columns align.
- Right-align all currency columns. Keep the currency symbol or code in a fixed position.
- Maximum line length for prose is about 65 characters.
- Weights stay between 400 and 600 for sans, 500 for serif and mono. No ultra-bold or ultra-light.
- Do not use the serif for UI controls, tables, or small text.
- Do not set long text in all caps. Uppercase is for `label` only.

## Layout

**Principles**: single focus per screen, generous whitespace, and a predictable left alignment. Content is asymmetrical and document-like, not a centered marketing hero.

- **Grid**: 4px base unit. Spacing tokens: 4, 8, 16, 24, 40, 64.
- **Container**: max width 1080px for app pages, 680px for prose (About). Horizontal padding 16px on mobile, 24px on tablet, 32px on desktop.
- **Breakpoints**: 640px (tablet), 1024px (desktop). Design mobile-first from 360px.
- **Safe areas**: respect device safe-area insets on phones.

**Page patterns**

| Page | Layout |
|---|---|
| Home (`/`) | Left-aligned headline and one-sentence value proposition. Below: two clear actions (sample, upload) side by side on desktop, stacked on mobile. The receipt card appears in place below the actions once a result exists. No hero illustration. |
| Result view | Desktop: receipt card (about 60% width) beside a sticky "audit" column with checks and confidence (40%). Mobile: receipt first, then audit. |
| Review detail | Desktop: two equal panes, original file on the left, editable fields on the right. Mobile: tabs for "Original" and "Fields". |
| History | Full-width table. On mobile, rows become stacked records, not horizontally scrolling tables. |
| About | Narrow single column, serif headlines, a simple pipeline diagram with hairline boxes. |

**Rules**

- Never nest cards inside cards. Use dividers and spacing for hierarchy.
- Line items stack on screens under 640px: description above, quantity and price on one line below.
- Sticky elements (the wake-up banner, the audit column) must not cover primary actions on small screens.
- Primary action sits where the eye finishes reading, typically bottom-right on desktop, full width on mobile.

## Elevation & Depth

The interface is **flat**. Depth comes from tone and hairlines, not shadows.

- Layering: `paper` background, `surface` for raised content, `surface-sunken` for recessed areas.
- Borders: 1px `line` on cards and inputs.
- Shadows are allowed only on overlays (menus, dialogs, toasts): a single soft shadow, for example `0 8px 24px rgba(27, 26, 23, 0.12)` in light mode, and none in dark mode (use a brighter hairline instead).
- The receipt card has no shadow. Its edge treatment (perforation) provides the sense of an object.
- No glow effects, no colored shadows, no inner shadows.

## Shapes

- Small radii: 4px for controls, 8px for cards, 12px only for dialogs. Pill shapes (`full`) are reserved for the confidence meter track and avatars, never for buttons or badges.
- Badges use the 4px radius so they read like stamps, not bubbles.
- **Perforated edge**: the bottom edge of the receipt card is a repeating zigzag or semicircle cutout (use a CSS mask or `radial-gradient`, about 10px tall). Do not use it on any other component.
- **Dotted leaders**: use a 1px dotted bottom border (or `border-bottom: 1px dotted var(--line)`) to connect item descriptions to prices.
- Icons: Lucide, 1.5px stroke, 16px inline and 20px standalone. Icons inherit text color. No emoji, no filled multicolor icons.

## Components

Follow the tokens in the front matter. The rules below cover what tokens cannot express (borders, states, motion, behavior).

**Buttons**

- Primary: filled accent, one per view. Hover uses `accent-deep`. Disabled uses 50% opacity and `cursor: not-allowed` with an explanatory tooltip or helper text when the reason isn't obvious.
- Secondary: `surface` with a 1px `line` border.
- Ghost: text-only for tertiary actions such as "Retry" and "Cancel".
- Minimum height 44px for touch. Include a loading state that keeps the button width stable.

**Focus**: every interactive element shows a 2px `accent` outline with a 2px offset on `:focus-visible`. Never remove outlines without a replacement.

**Inputs**: `surface` background, 1px `line` border, label above (never placeholder-as-label). Error state: 1px `danger` border, an icon, and a message below the field in `danger` text. Numeric fields use `figure` typography and right alignment.

**Dropzone**: `surface-sunken` with a 1.5px dashed `line` border. On drag-over, the border becomes solid `accent` and the background shifts to `accent-soft`. Contains one sentence ("Drop a receipt here, or choose a file"), the accepted types and size limit in `body-sm`, and a secondary "Take a photo" button on touch devices.

**Processing stepper**: four labeled steps (Uploading, Extracting, Validating, Done) on a thin horizontal rule. The active step uses `accent`, completed steps show a check, and pending steps stay muted. Include text, not just dots. Use a determinate progress feel, not an endless spinner.

**Receipt card**

- Header: vendor in `title`, date in `figure`, category as a small neutral tag.
- Body: line items as rows with dotted leaders. Description left in `body`, quantity and amount right in `figure`.
- Footer: subtotal and tax in `figure`, then total in `figure-lg` with a heavier top rule.
- Missing values render as "Not found" in `ink-muted`, italic, never blank or `0`.
- Bottom edge: perforation (see Shapes).

**Audit rows (validation checks)**

- Ruled list, one row per check: icon, rule in plain language, optional detail in `body-sm`.
- Pass: `check` icon in `success`. Fail: `x` icon in `danger`, with the numbers that disagree shown in `figure`.
- Failed rows appear first and are not collapsible.

**Confidence meter**: a thin segmented bar (10 segments) with the numeric value in `figure` beside it (for example `0.92`). Segment fill uses `accent` above the review threshold and `warning` below it, and the threshold is labeled in text.

**Status badge**: icon, then text, using the status table in Colors. Always include both.

**Review queue and history table**

- Header row: `table-header`. Row dividers: hairline. No zebra striping.
- Amount column right-aligned in `figure`; status column shows the badge.
- Row hover: `surface-sunken` background. Rows are keyboard focusable and open on Enter.
- Filters sit above the table as compact selects, not a sidebar.

**Review edit form**: fields in a single column, line items as an editable table that stacks on mobile. Save and "Approve" are separate actions; "Reject" is secondary and requires no confirmation unless data would be lost. After saving, the audit rows update in place and the changed checks briefly highlight.

**Wake-up banner** (`banner-wakeup`): appears at the top of the page content, not as a modal. Text example: "The server is waking up. This can take up to a minute on the first visit." Includes a slim indeterminate progress line and, after 45 seconds, a link to the demo video. Disappears when the backend is ready, with no layout jump.

**Error states** (`banner-error` or inline `ErrorState`): say what happened, what the visitor can do, and offer one action. Never show raw server messages or stack traces.

**Empty states**: one sentence and one action. For example, "No receipts yet. Try a sample." No illustrations.

**Motion**

- Duration 120 to 180ms, ease-out, only opacity and small translations (4 to 8px).
- No bouncing, spring overshoot, parallax, or looping decorative animation.
- Honor `prefers-reduced-motion`: remove translations and replace animated indicators with static equivalents.

**Accessibility**

- Keyboard reachable and operable everywhere; logical tab order.
- Status and validation are announced to screen readers (`aria-live="polite"` for processing and results).
- Touch targets at least 44 by 44px.
- Text can scale to 200% without loss of content.

## Do's and Don'ts

**Do**

- Do let the receipt be the hero. The data is the product, so give it the most space.
- Do align every number on a decimal point using tabular figures.
- Do show the evidence (checks, thresholds, differences) next to every result.
- Do use real sample data with realistic vendors, items, and totals.
- Do keep a single accent and let neutrals carry the layout.
- Do write errors that name the specific problem and the next step.
- Do test at 375px and with 200% text zoom before calling a screen done.
- Do use both light and dark themes from day one, with tokens and no hard-coded colors.

**Don't** (these are the marks of generic generated UI; avoid all of them)

- Don't use purple, blue-violet, or rainbow gradients, gradient text, or gradient buttons.
- Don't use glassmorphism, backdrop blur, glow, or neon accents.
- Don't use emoji as icons or decoration, or sparkle icons to signal "AI".
- Don't build a centered hero with floating blobs, mesh backgrounds, or stock illustrations.
- Don't use a row of three identical feature cards with icons.
- Don't put cards inside cards inside cards, or add a shadow to everything.
- Don't make every button a pill, and don't make every corner large and round.
- Don't use Inter, Roboto, or system defaults as a deliberate choice for display type.
- Don't show invented testimonials, user counts, or metrics. Only show numbers that come from the evaluation set.
- Don't use Lorem ipsum or placeholder copy in any shipped view.
- Don't communicate status with color alone.
- Don't use tooltips for essential information.
- Don't auto-play, loop, or bounce anything.
- Don't copy another brand's palette or typography wholesale.

## Implementation Notes

- Declare the tokens as CSS variables in `globals.css`, with dark values under `@media (prefers-color-scheme: dark)`. Map them into the Tailwind theme so utilities (`bg-surface`, `text-ink`, `border-line`) resolve to variables.
- Load fonts with `next/font` and apply the variables at the root layout. Subset to Latin to keep the payload small.
- Build the status map (label, icon, tone) in one place (`lib/status.ts`) and reuse it in badges, tables, and the audit list.
- Run `npx @google/design.md lint DESIGN.md` after edits, since the format is still in alpha and the schema may change.
- When the UI and this file disagree, update the file in the same commit so it never drifts.
