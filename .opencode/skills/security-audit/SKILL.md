---
name: security-audit
description: Run a structured security audit on code, dependencies, and configuration. Use when reviewing PRs, auditing a new module, or responding to a security concern.
metadata:
  audience: security-auditor
  workflow: review
  opencode/slash: "true"
---

# Security Audit Skill

## What I do
I provide a structured, repeatable checklist for auditing code, dependencies, and configuration for security issues. I do **not** replace a full penetration test — I catch the common, high-impact issues that slip through code review.

## When to use me
Load this skill when:
- The `security-auditor` agent is invoked on a PR or module.
- The user asks to "review for security" or "check for vulnerabilities."
- A new dependency or integration is added.
- Auth, crypto, input handling, or secret management code is touched.

Do **not** load me for general code-style reviews or performance work — use the `code-review` skill for that.

## Audit Procedure

Work through each section in order. Report findings as **Critical / High / Medium / Low**, with file:line references and a concrete fix.

### 1. Secrets & Credentials
- [ ] No hardcoded API keys, tokens, passwords, or private keys in source.
- [ ] `.env`, `*.pem`, `*.key` are gitignored.
- [ ] Secrets are read from env vars or a secret manager, not config files committed to repo.
- [ ] No secrets in logs, error messages, or stack traces.

### 2. Input Handling & Injection
- [ ] All user input is validated and sanitized at the boundary.
- [ ] SQL queries use parameterized statements (no string concatenation).
- [ ] Shell commands avoid user-controlled interpolation; use argument arrays.
- [ ] HTML output is escaped (XSS); no raw `innerHTML` with user data.
- [ ] File paths from user input are canonicalized and checked against traversal (`../`).
- [ ] Deserialization of untrusted data is avoided or strictly typed.

### 3. Authentication & Authorization
- [ ] Every sensitive endpoint checks authentication **and** authorization.
- [ ] No "client-side only" auth checks.
- [ ] Session tokens are random, sufficiently long, and rotated on login.
- [ ] Password hashing uses a modern algorithm (bcrypt, argon2, scrypt) with proper cost.
- [ ] Rate limiting exists on login, signup, and password reset.
- [ ] Authorization checks are centralized, not copy-pasted per route.

### 4. Cryptography
- [ ] No custom crypto; use vetted libraries.
- [ ] No deprecated algorithms (MD5, SHA-1 for security, DES, RC4).
- [ ] Random values use a CSPRNG (`crypto.randomBytes`, `secrets.token_*`), not `Math.random`.
- [ ] TLS verification is not disabled.
- [ ] Keys are rotated and not shared across environments.

### 5. Dependencies
- [ ] Run the project's audit command (e.g. `npm audit`, `pip-audit`, `cargo audit`).
- [ ] Flag any **Critical** or **High** CVEs with no patch.
- [ ] Check for unmaintained or suspicious packages (typosquatting).
- [ ] Lockfiles are committed.

### 6. Configuration & Infrastructure
- [ ] Debug mode is off in production configs.
- [ ] CORS is not `*` for authenticated endpoints.
- [ ] Security headers present (CSP, HSTS, X-Content-Type-Options, etc.).
- [ ] Error responses don't leak stack traces or internal paths.
- [ ] Least-privilege IAM / DB roles.
- [ ] Logging does not include PII or secrets.

### 7. Data Protection
- [ ] PII is identified and encrypted at rest where required.
- [ ] Sensitive data is not cached in logs, telemetry, or error trackers.
- [ ] Data retention and deletion paths exist.

## Output Format

For each finding, produce:

```text
[SEVERITY] Short title
Location: path/to/file.ext:LINE
Issue: What is wrong and why it matters.
Fix: Concrete code change or action.
```

Close with a short summary ordered by severity, and state explicitly which checks could not be completed and why. Do not modify files while auditing.