---
name: code-review
description: Perform a structured code review on a diff, PR, or module. Use when reviewing code quality, bugs, edge cases, or performance. Do not use for security-only audits or documentation writing.
metadata:
  audience: review
  workflow: review
---

# Code Review Skill

## What I do
I provide a structured checklist for reviewing code quality, correctness, and maintainability. I do **not** handle security audits (use the `security-audit` skill) or documentation (use the `docs-writer` agent).

## When to use me
Load this skill when:
- The user asks to review a PR, diff, or file.
- The `code-reviewer` agent is invoked.
- Code is being merged into a main branch.
- A refactor needs a second pass.

Do **not** load me for:
- Security-focused audits (use `security-audit`).
- Writing new documentation (use `docs-writer`).
- Performance profiling (different skill needed).

## Review Procedure

Work through each section. Report findings as **Blocker / Nit / Question / Praise**, with file and line references.

### 1. Correctness
- [ ] Does the code do what the PR description says?
- [ ] Are edge cases handled (empty arrays, null, 0, negative, huge inputs)?
- [ ] Are errors caught and handled meaningfully (not swallowed)?
- [ ] Are async operations awaited correctly? Any unhandled promise rejections?
- [ ] Are loops/recursion guaranteed to terminate?

### 2. Logic & Control Flow
- [ ] Is the logic readable without needing comments to explain it?
- [ ] Are conditionals unambiguous (avoid nested ternaries)?
- [ ] Is there dead code, unreachable branches, or copy-paste errors?
- [ ] Are return values consistent across branches?

### 3. Naming & Readability
- [ ] Do names describe intent, not implementation (`getUserById` not `fetchData`)?
- [ ] Are booleans named as questions (`isValid`, `hasPermission`)?
- [ ] Are functions short and doing one thing?
- [ ] Are magic numbers/strings named constants?

### 4. Structure & Maintainability
- [ ] Is there duplicated logic that should be extracted?
- [ ] Are responsibilities well-separated (no 500-line functions)?
- [ ] Are dependencies injected, not hardcoded?
- [ ] Is the change consistent with existing patterns in the codebase?

### 5. Performance
- [ ] Any obvious N+1 queries or repeated expensive calls in loops?
- [ ] Any unnecessary re-renders, re-fetches, or re-computations?
- [ ] Are large lists paginated or virtualized?
- [ ] Are expensive operations cached where appropriate?

### 6. Tests
- [ ] Are new code paths covered by tests?
- [ ] Are edge cases tested, not just the happy path?
- [ ] Do tests assert on behavior, not implementation details?
- [ ] Are test names descriptive of the scenario?

## Output Format

For each finding:

```text
[TAG] Short title
Location: path/to/file.ext:LINE
Observation: What the code does now.
Suggestion: Concrete improvement.
```

Close with a short summary: blockers first, then nits, then open questions, then genuine praise where it is deserved. Do not modify files while reviewing.
