---
name: design-review
description: Review rendered UI against a design contract and anti-slop guardrails. Use when a UI change is being verified, before shipping, or when output looks generic or machine-made. Do not use for code-only reviews or security audits.
metadata:
  audience: ui-reviewer
  workflow: review
---

# Design Review Skill

## What I do

I provide a structured checklist for judging rendered interface quality: hierarchy, typography, spacing, color discipline, states, realism, and the mechanical tells of generated UI. I do not review application logic or security; use the `code-review` and `security-audit` skills for those.

## When to use me

- The `ui-reviewer` agent is invoked on a UI change.
- A page or component is about to ship.
- Something "works" but feels generic, cramped, or machine-made.
- A design contract or preset needs to be checked against the implementation.

## Review procedure

Work through each section against the actual pixels. Report findings as **Blocker / Nit / Question / Praise** with screen, viewport, and state references.

### 1. Contract adherence
- [ ] Colors, type, spacing, and radii come from the tokens, not one-off values.
- [ ] The slop budget in `_guardrails.md` is respected (accents, families, radii, shadows, gradients).
- [ ] The signature element appears where the contract says it should, and is reused consistently.
- [ ] Any approved exception is recorded in the contract with a product reason.

### 2. Hierarchy
- [ ] One obvious primary action per view.
- [ ] The eye lands on the most important information first, then follows a sensible scan path.
- [ ] Secondary actions are visually quieter; destructive actions are separated.
- [ ] Hierarchy comes from spacing, alignment, contrast, and type scale, not decoration.
- [ ] No more than three type sizes above body text in one view.

### 3. Typography
- [ ] Font families are within budget; fallbacks render acceptably.
- [ ] The scale is consistent; body text is readable at the stated sizes.
- [ ] Line length is roughly 45–75 characters for long-form text.
- [ ] Line height, weight, and tracking are consistent and intentional.
- [ ] No display font used for body, no body font stretched into a display role.

### 4. Spacing and alignment
- [ ] Spacing follows the token scale; no arbitrary one-off gaps.
- [ ] Repeated elements share consistent padding and alignment.
- [ ] Section rhythm is consistent; whitespace groups content instead of filling the page.
- [ ] Edges align to a visible grid; nothing looks accidentally indented.
- [ ] Density suits the platform and workflow.

### 5. Color
- [ ] Accent use is within budget and reserved for meaning or action.
- [ ] Text and UI contrast meet WCAG AA at the rendered sizes.
- [ ] Semantic colors are used consistently and are distinguishable without color alone.
- [ ] No default framework palette standing in for a brand decision.
- [ ] Dark and light surfaces, if both exist, are equally legible.

### 6. Shape and elevation
- [ ] Radius values come from the scale; ordinary buttons and cards are not pill-shaped by default.
- [ ] One shadow style at most, used to communicate real elevation.
- [ ] No glow, glassmorphism, decorative gradients, or floating orbs.
- [ ] Borders and dividers are used for grouping, not sprinkled for texture.

### 7. Layout and responsiveness
- [ ] No horizontal overflow, clipping, or broken wrapping at 390, 768, and 1280–1440 px.
- [ ] Long labels, long names, and large numbers do not break layout.
- [ ] Tables and dense data remain scannable; columns do not collapse into noise.
- [ ] Navigation behaves according to platform convention.
- [ ] Mobile touch targets are at least 44×44 px; no hover-only affordances.

### 8. States
- [ ] Default, hover, focus-visible, active, and disabled are all designed.
- [ ] Loading, empty, error, and success states exist where data is involved.
- [ ] Empty states explain what to do next instead of showing a blank region.
- [ ] Focus indicators are visible and not suppressed.
- [ ] Errors are actionable and placed near the problem.

### 9. Content realism
- [ ] No lorem ipsum, "John Doe", "Acme Corp", fake logos, fake testimonials, or invented metrics.
- [ ] Copy reads like the product's real language.
- [ ] Numbers, dates, and units are realistic and consistently formatted.
- [ ] No controls or navigation items that do nothing.

### 10. Mechanical AI tells
- [ ] No purple/blue gradient hero or CTA.
- [ ] No glassmorphism, glow, blobs, or decorative grid overlays.
- [ ] No emoji used as icons or status markers.
- [ ] No card around every section; no nested decorative cards.
- [ ] No badge/pill/divider soup.
- [ ] No oversized hero type or heavy display weights used to manufacture impact.
- [ ] No raw hex values or pixel font sizes outside the token file.
- [ ] No decorative animation on static content.

### 11. Human-expert bar
- [ ] Could a senior product designer sign this off without asking for a redesign?
- [ ] Does the interface have one identifiable, product-specific idea?
- [ ] Would it be recognizable as this product rather than any product?
- [ ] Is the weakest part known and either fixed or deliberately justified?

## Output format

For each finding:

```text
[Blocker|Nit|Question|Praise] Short title
Where: screen or component, viewport, state
Observed: what is actually visible
Contract: token, rule, or guardrail violated
Fix: smallest change that resolves it
```

Close with:

- **Verdict:** SHIP or REVISE
- **Blockers:** count, or "none"
- **Slop budget:** the counts you checked
- **Not verified:** viewports, states, or content you could not inspect

Do not edit files. Do not report a viewport or state you did not actually see.
