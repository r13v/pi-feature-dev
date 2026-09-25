---
name: final-check
description: Check the current task for missed requirements, defects, or verification gaps when the user invokes final-check.
---

# Final Check

What else have we missed? Compare the requested outcome with the current work
and validation evidence. Inspect only the affected scope and dependencies needed
to resolve a concrete concern; do not start an unrelated repository audit.

Fix confirmed in-scope gaps when implementation is already authorized. If the
request is review-only, report findings without editing. Reuse passing checks;
rerun or broaden them only after changes, failures, or a newly identified risk.

Finish when acceptance criteria are supported and no known in-scope blocker
remains. Report material findings, fixes, checks actually run, and unverified
requirements. When the repository already keeps `docs/backlog/` items or the
user asks, offer to record real deferred gaps there, one file per item. If
nothing further is needed, say so without inventing work.
