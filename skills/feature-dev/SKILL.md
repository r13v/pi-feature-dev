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
without asking the user to approve the same decision again. The only default
checkpoint is design approval when a design trigger applies. If the user
requests another approval checkpoint, present a concrete proposal and wait there.

## Discovery and exploration

Define the expected behavior, constraints, non-goals, and evidence of completion.
Inspect the affected entry points, exports, immediate callers, shared utilities,
and nearby tests. Follow dependencies far enough to understand the change's
impact; a full repository map or fixed file count is unnecessary.

Use lightweight progress tracking for work spanning several steps. Optional
read-only workers can investigate independent questions when delegation is
available and permitted; ask them for file:line entry points, the execution flow,
risks, and the essential files, then read those files yourself before designing.
For a large feature, run two or three such passes in parallel, each with a
different focus: similar existing features, the architecture and abstractions of
the affected area, or user-facing and testing patterns. Otherwise work locally.
Keep one writer in a checkout.

## Clarification

Resolve material unknowns using repository evidence and focused questions. Keep
independent work moving while a question is pending. Do not add a question phase
when the request and code already establish the answer.

Before design, check the request and findings for gaps in scope boundaries, edge
cases, error handling, integration points, backward compatibility, and
performance or security needs. Ask about the gaps that change the design, in one
organized batch; assume and state the rest.

## Design

Describe the intended implementation and validation briefly before editing; for
multi-file changes, name the files to change and the build order.

Present alternatives when the change does any of these:

- changes a public contract: API, CLI, configuration, file format, or event;
- changes a data model, schema, or persisted state;
- spans several modules or layers;
- introduces a new abstraction, dependency, or extension point.

Then give two or three approaches that differ in structure, not in naming. Use
these lenses as prompts, not a quota: minimal change with maximum reuse, clean
boundaries for maintainability, and a pragmatic balance. For each approach, give
the files and components it touches, its trade-offs and risks, and how it would
be validated. Recommend the approach that best fits this task's scale, urgency,
complexity, and conventions, and explain why. Then wait for the user's choice,
unless the user asked you to proceed without design approval or already chose
an approach.

When none of these triggers applies, state the single approach and proceed.

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
convention fit, and unnecessary complexity or duplication. Use independent review
only when its benefit justifies it and the host permits it; there is no
review-worker quota.

Verify findings against the code. Keep only findings caused by the change that
break behavior or a stated project rule, each with file:line, impact, and a fix;
drop speculation and style points no rule covers. Fix confirmed issues within
the authorized scope. Report unrelated issues separately without expanding
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

Summarize what changed, files touched, key decisions with the chosen approach
and its rationale, assumptions made, validation actually performed, material
limitations, and follow-ups. Do not claim a check passed if
it was skipped.
