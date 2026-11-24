---
status: active
mode: full
run_id: 20261124-1400-invoice-currency
branch: {{BRANCH}}
start_commit: {{BASE}}
started: 2026-11-24T14:00
---

# Drive run

Original request: add ISO-4217 currency to invoices across the public API,
billing calculation, and persisted invoice store.

## Stages

- elevate: skipped: the request states the outcome
- grill: done: Grill Result below
- deepen: skipped: each criterion has a test
- feature-dev: done: added currency across api, billing, and store
- feature-dev review: done (subagent): 0 findings
- final-check: done (subagent)
- deslop: done: nothing to remove
- retro: skipped: smooth run
- deferred ideas: pending

## Grill Result

Objective: require an ISO-4217 `currency` on invoice creation, return it from
the public API, and persist it in the invoice store.

Acceptance criteria:
1. `handleCreateInvoice` requires a 3-letter uppercase `currency`.
2. `serializeInvoice` persists `currency`.

## Friction



## Deferred ideas

