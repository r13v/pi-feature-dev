---
name: feature-dev
description: Structured feature development workflow for coding assistants. Use for non-trivial feature work requiring codebase exploration, clarification, architecture trade-offs, implementation approval, review, and final summary.
compatibility: "Portable across coding assistant environments. Optional task tracking, structured-question, delegation, search, and browser tools can improve the workflow, but are not required."
---

# Feature Dev

Run a guided, tool-agnostic feature development workflow. Adapt each step to the capabilities of the current environment:

- Track phase/progress state with any available planning mechanism, or keep a concise written checklist in chat.
- Ask clarification and decision questions in normal chat; use structured-choice UI/tools only if available.
- Use search, documentation, browser, or repository tools for external context when needed.
- For broad work, optionally delegate read-only exploration, planning, or review to independent helpers if the environment supports it.

This workflow is for the main orchestrating session. Keep responsibilities clear: one writer owns file edits, while any optional helpers stay read-only unless the user explicitly approves a different handoff.

## Operating Rules

1. **Clarify before coding.** Do not implement until scope, acceptance criteria, constraints, and non-goals are clear enough.
2. **Explore before designing.** Inspect relevant existing code and patterns before proposing architecture.
3. **Ask before implementation.** Present the preferred architecture and wait for explicit user approval before editing.
4. **Keep writes single-threaded.** Use the main session or one dedicated writer. Never run parallel writers in the same checkout.
5. **Review after implementation.** Inspect the diff from fresh perspectives, synthesize findings, then apply only approved/worthwhile fixes.
6. **Use available tools only.** If a recommended capability is unavailable, continue with the closest alternative and state the fallback briefly.
7. **For large outputs.** Use any available large-output/log-processing tools. Otherwise run focused commands and summarize concise output.

## Workflow

### Phase 1 — Discovery

Goal: understand what needs to be built.

Actions:

1. Establish lightweight phase tracking for Discovery, Exploration, Clarification, Architecture, Implementation, Review, and Summary/Validation. Keep exactly one phase active at a time when your environment supports explicit progress state.
2. If the feature request is unclear, ask concise questions before doing deep work:
   - What problem should this solve?
   - What should the user-visible behavior be?
   - What constraints, deadlines, compatibility requirements, or non-goals matter?
3. Summarize your understanding and call out assumptions.

Use structured-choice prompts only for questions with 2-4 clear choices. For open-ended requirements, ask normally in chat.

### Phase 2 — Codebase Exploration

Goal: understand relevant code and project patterns at high and low levels.

For non-trivial features, perform these read-only exploration passes. Use independent helpers only if available; otherwise do the passes yourself:

1. Find features similar to the requested feature and trace their implementation. Return key entry points, data flow, conventions, risks, and 5-10 essential files to read.
2. Map architecture, abstractions, module boundaries, and integration points relevant to the feature. Return file:line references and 5-10 essential files to read.
3. Identify tests, validation patterns, UI/API patterns, configuration, and extension points relevant to the feature. Return concrete files and gaps.

Use two passes for medium work; three for broad features. Skip delegation for trivial single-file changes, but still inspect relevant files yourself.

After exploration:

1. Read the essential files identified.
2. Follow imports/callers/tests/config as needed.
3. Present a concise findings summary: similar patterns, relevant files, likely integration points, risks, and unknowns.

### Phase 3 — Clarifying Questions

Goal: resolve ambiguity before architecture.

Review the feature request plus exploration findings. Identify gaps in:

- scope boundaries and non-goals
- user-visible behavior and acceptance criteria
- edge cases and error handling
- data model/API/schema changes
- migration/backward compatibility
- performance/security/accessibility requirements
- tests and validation expectations
- rollout/feature flags/documentation needs

Ask all necessary questions in one organized batch. Use structured-choice prompts for discrete decisions when available; otherwise ask a numbered free-form list. Wait for answers before architecture design.

If the user says “whatever you think is best,” state your recommendation and get explicit confirmation unless the decision is low-risk and reversible.

### Phase 4 — Architecture Design

Goal: compare viable implementation approaches and get approval.

For complex work, run 2-3 planning passes with different trade-off lenses. These can be separate self-review passes or delegated read-only planning if available:

1. **Minimal-change implementation** — smallest safe diff using existing patterns.
2. **Clean-architecture implementation** — prioritize maintainability, testability, and clear boundaries.
3. **Pragmatic balanced implementation** — balance implementation cost, maintainability, and risk.

Each pass should include:

- files to change
- build sequence
- risks and trade-offs
- validation plan

Then synthesize:

- brief summary of each approach
- concrete file/component differences
- trade-offs
- your recommendation and reasoning
- validation plan

Ask the user which approach to use. A structured choice is helpful when available, with options like Minimal, Pragmatic, Clean.

### Phase 5 — Implementation

Goal: build the approved feature.

Do not start without explicit approval.

Implementation options:

- **Main session writes directly** for small/medium scoped changes where enough context is already available.
- **One dedicated writer** for larger changes after approval, if the environment supports handoff. Provide requirements, chosen approach, files/areas, non-goals, acceptance criteria, validation, and escalation rules.

Writer handoff shape:

```text
Implement the approved <feature> plan.

Clarified requirements:
- ...

Chosen approach:
- ...

Likely files/areas:
- ...

Non-goals:
- ...

Acceptance criteria:
- ...

Validation expected:
- ...

Use one writer thread only. Ask before unapproved product, API, or architecture changes. Summarize files changed and validation results.
```

During implementation:

1. Follow existing patterns discovered earlier.
2. Keep changes focused on the approved scope.
3. Add or update tests when appropriate.
4. Update progress tracking as each implementation subtask finishes when such tracking is available.
5. If a new major decision appears, stop and ask.

### Phase 6 — Quality Review

Goal: catch correctness, test, and maintainability issues.

After implementation, review the current diff. For non-trivial changes, inspect it from these independent perspectives yourself or with read-only review helpers if available:

1. Correctness, regressions, edge cases, and security.
2. Tests and validation quality.
3. Simplicity, maintainability, duplication, and project convention fit.

Each review perspective should inspect changed files directly and report only evidence-backed issues with file/line references.

Synthesize review output into:

- blockers / must-fix now
- fixes worth doing now
- optional improvements
- feedback to ignore/defer

If the user already approved auto-fixing review findings, apply the “must-fix” and “worth doing now” items with one writer. Otherwise ask whether to fix now, defer, or proceed as-is.

### Phase 7 — Validation and Summary

Goal: prove the feature is complete and document outcomes.

Actions:

1. Run focused validation: tests, typecheck, lint, build, or manual checks appropriate to the project.
2. If validation fails, keep the current phase active, explain the blocker, and fix or ask for direction.
3. When validation passes or the user accepts known limitations, mark the workflow complete in whatever progress tracking is available.
4. Summarize:
   - what was built
   - key decisions made
   - files modified
   - validation performed and results
   - known limitations
   - suggested next steps

## Lightweight Mode

Use a reduced workflow for small but non-trivial changes:

1. Clarify scope briefly.
2. Inspect relevant files directly.
3. Present one recommended implementation approach.
4. Ask for approval.
5. Implement with one writer.
6. Run focused validation.
7. Summarize.

Still do not skip clarification, approval before edits, or validation.

## When Not to Use

Avoid this full workflow for:

- single-line fixes
- mechanical renames
- formatting-only changes
- urgent hotfixes where the user explicitly asks for the fastest safe patch

For those, use normal focused coding behavior and optionally borrow only the clarification/review parts.
