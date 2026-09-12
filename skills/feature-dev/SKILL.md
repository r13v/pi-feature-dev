---
name: feature-dev
description: Develop non-trivial features that need repository exploration and design decisions, through implementation, review, and validation. Skip mechanical edits and small fixes.
compatibility: "Portable across coding assistants; delegation and progress tools are optional."
---

# Feature Dev

Deliver the requested feature using the project's existing patterns. Scale the
workflow to the change; the phases below are checkpoints, not mandatory separate
turns, reports, or agent passes.

## Scope and decisions

The user's request and existing authorization take precedence over workflow
defaults. A request to implement authorizes implementation and fixes needed to
complete that scope. A request for design or review alone does not.

Ask when a missing decision materially changes product behavior, a public
contract, scope, or an irreversible action. Research discoverable facts first.
State routine implementation assumptions and proceed; honor delegated choices
without asking the user to approve the same decision again. If the user requests
an approval checkpoint, present a concrete proposal and wait there.

## Discovery and exploration

Define the expected behavior, constraints, non-goals, and evidence of completion.
Inspect the affected entry points, exports, immediate callers, shared utilities,
and nearby tests. Follow dependencies far enough to understand the change's
impact; a full repository map or fixed file count is unnecessary.

Use lightweight progress tracking for work spanning several steps. Optional
read-only workers can investigate independent questions when delegation is
available and permitted. Otherwise work locally. Keep one writer in a checkout.

## Clarification and design

Resolve material unknowns using repository evidence and focused questions. Keep
independent work moving while a question is pending. Do not add a question phase
when the request and code already establish the answer.

Describe the intended implementation and validation briefly before editing.
Compare alternatives only when they have meaningful differences in behavior,
cost, compatibility, or maintenance. Recommend the smallest approach that meets
the requirements and follows current conventions; do not manufacture three
architectures for an obvious change.

## Implementation

Implement the authorized scope with one writer. If handing off to an isolated
worker, supply the request, relevant files, decisions, constraints, acceptance
criteria, validation commands, and authority boundaries.

Reuse existing code and match project conventions. Add or update tests when they
protect a changed requirement or regression risk. Reuse adequate existing checks
for mechanical or low-impact edits. Update documentation when the feature changes
what a reader needs to know.

If evidence invalidates the approach, revise it within scope. Ask only when the
revision needs a material user decision or authority not already granted.

## Review and validation

Inspect the actual diff for correctness, requirement coverage, meaningful tests,
and convention fit. Use independent review only when its benefit justifies it
and the host permits it; there is no review-worker quota.

Verify findings against the code. Fix confirmed issues caused by the change
within the authorized scope. Report unrelated issues separately without expanding
the task or asking permission to fix ordinary defects in the requested work.

Run the relevant project checks and any required final checks. After a failure,
fix its in-scope cause and rerun affected checks. Broaden or repeat validation
only for new changes, failures, or an unresolved risk. If runtime or visual
inspection is part of the requested result, perform it before completion.

## Completion

Continue until the acceptance criteria are met, required checks pass, and no
confirmed in-scope blocker remains. A first implementation or a clean-looking
diff is not completion. If blocked by missing access, a user decision, or an
unrelated baseline failure, state the evidence and what remains unverified.

Summarize what changed, why the approach fits, validation actually performed,
and material limitations. Do not claim a check passed if it was skipped.
