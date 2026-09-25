---
name: plan-make
description: Create a self-contained implementation plan in docs/plans/ when the user asks for a plan or staged task checklist before coding.
---

# Implementation Plan Creation

Create `docs/plans/YYYYMMDD-title.md` using the current date and a descriptive
slug, unless the user supplies a destination. A fresh executor must be able to
use the plan and repository without the earlier chat.

## Discover and decide

Read applicable project guidance and the code, callers, shared utilities, and
tests relevant to the requested change. For a bug, establish the reproduction
and owning path; for a migration, inspect compatibility and rollout constraints.
Load broader architecture or operational docs only when the change reaches them.

State the requested outcome and material assumptions. Ask only for missing
decisions that could change behavior, scope, or risk. Do not ask the user to pick
a title, restate known requirements, or choose a testing style without a reason.
Group independent questions when useful; defer questions whose prerequisites
are unsettled.

Compare alternatives when there is a real trade-off and lead with a
recommendation and its reason. When code would repeat, weigh duplication (less
coupling) against a shared abstraction (less repetition, more indirection).
Use the user's chosen approach or delegated judgment. Writing the requested plan does not require an
extra approval turn. An unresolved material decision must stay visible rather
than becoming an invented requirement.

## Self-contained plan contract

Include enough information to execute and review the work:

- The original request, desired outcome, acceptance criteria, and non-goals.
- Decisions, assumptions, unresolved questions, and why the selected approach
  fits the repository.
- Concrete file paths, relevant symbols, contracts, existing patterns, and
  dependencies discovered during planning.
- Ordered tasks with a purpose, files to change, implementation actions, and
  observable verification. Identify task dependencies.
- Exact relevant validation commands, required environments, credentials,
  manual steps, or external-system actions, including their authorization state.

Read [references/plan-template.md](references/plan-template.md) when writing the
file. Adapt its sections to the change; preserve `### Task N:` headings and
checkboxes when the plan will be consumed by `plan-exec`.

Name the helper or behavior instead of writing "as discussed" or "use the
existing helper." Replace template placeholders before delivery. When discovery
must happen during execution, give it a concrete question and completion condition
instead of guessing a symbol or command.

## Verification and completion criteria

Choose checks that protect the intended outcome. New or changed behavior may
need a regression test; a mechanical edit can use an existing check. Do not add
unit tests to every task or prescribe a full-suite/E2E run solely because tools
exist. Include checks required by the project and identify the risks they cover.

Make success, failure, and unavailable verification distinct. Required manual or
external checks remain completion prerequisites even when listed outside the
automated task loop. Optional follow-up belongs in Post-Completion and must not
hide unfinished acceptance criteria.

Before delivery, check that a fresh agent can identify what to change, why, what
authority it has, and how to tell when the work is complete. Fix omissions that
discovery can resolve; label remaining blockers explicitly.

## Handoff

Link the plan and summarize its approach and unresolved decisions. A plan-only
request ends with the plan. If the user already requested planning followed by
review or implementation, continue that authorized work without asking again.
Do not start implementation merely because a plan now exists.
