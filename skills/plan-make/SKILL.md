---
name: plan-make
description: Create structured implementation plans in docs/plans/ for feature work, bug fixes, refactors, migrations, or unclear implementation requests. Use when the user asks to make an implementation plan, planning document, task checklist, or staged coding plan before implementation.
---

# Implementation Plan Creation

Create an implementation plan in `docs/plans/YYYYMMDD-title.md` after focused discovery and user-guided scope decisions.

## Workflow

1. Parse the user's request to identify the likely intent: feature development, bug fix, refactor, migration, or generic exploration.
2. Gather context before asking questions. Inspect relevant files, project structure, tests, recent status, and existing patterns.
3. Present a concise context summary, including likely affected areas and any uncertainty.
4. Ask focused questions one at a time. Prefer multiple-choice questions with a recommended option when the answer can be bounded.
5. If there are multiple viable implementation paths, present 2-3 approaches with trade-offs and recommend one. Ask the user to choose before writing the plan. Skip this only when the path is obvious or the user already specified the approach.
6. Preserve enough context in the plan for an isolated reviewer to understand the request, decisions, assumptions, and non-goals without hidden conversation context.
7. Create the plan file under `docs/plans/` using the current date and a short slug.
8. After creating the plan, ask the user whether to review, start implementation, or stop after the plan.

## Project Guidance Discovery

Read relevant project guidance when present:
- `AGENTS.md`
- `CLAUDE.md`
- nearby README or contributor docs

Use these files to identify conventions, preferred libraries, test expectations, and existing workflow rules. Limit context loading to guidance relevant to the requested change.

## Discovery Guidance

For feature development:

- Locate related code, patterns, and nearby tests.
- Identify affected components, dependencies, and user-facing surfaces.

For bug fixing:

- Look for failing tests, logs, stack traces, reproduction clues, and likely owner code.
- Check recent changes in the problem area when available.

For refactors and migrations:

- Identify all affected files and integration points.
- Check current test coverage and compatibility requirements.

For generic or unclear requests:

- Check `git status`, top-level structure, package metadata, and primary language/framework.
- Infer the likely goal from current work, but state uncertainty explicitly.

## Question Flow

Ask only what is needed to make the plan accurate. Use one question per turn.

Typical sequence:

1. Main goal.
2. Scope or affected components.
3. Constraints or non-goals.
4. Testing preference: TDD or regular code-first with tests in each task.
5. Short plan title.

Do not ask all five if discovery already answers some of them.

## Approach Selection

When alternatives are useful, present them conversationally:

```markdown
I see three approaches:

**Option A: [name]** (recommended)
- How it works: ...
- Pros: ...
- Cons: ...

**Option B: [name]**
- How it works: ...
- Pros: ...
- Cons: ...

Which direction do you prefer?
```

If repeated code is involved, explicitly compare duplication versus abstraction and ask when both are reasonable.

## Plan Template

Use this structure and adapt it to the project:

```markdown
# [Plan Title]

## Overview
- Clear description of the feature/change.
- Problem it solves and key benefits.
- How it integrates with the existing system.

## Context
- Files/components involved: [list from discovery]
- Related patterns found: [patterns discovered]
- Dependencies identified: [dependencies]

## Review Handoff
- Original request: [user's requested outcome]
- Key decisions made during planning: [brief bullets]
- Explicit non-goals: [if any]
- Open questions or assumptions: [if any]

## Development Approach
- Testing approach: [TDD / Regular]
- Complete each task fully before moving to the next.
- Make small, focused changes.
- Every code-change task must include new or updated tests.
- All tests for a task must pass before starting the next task.
- Update this plan when scope changes during implementation.

## Testing Strategy
- Unit tests required for every code-change task.
- E2E tests required for UI flows when the project has an E2E setup.
- Cover success, error, and edge cases.

## Progress Tracking
- Mark completed items with `[x]` immediately when done.
- Add newly discovered tasks with `+` prefix.
- Document blockers with `BLOCKED:` prefix.
- Keep the plan in sync with actual work.

## What Goes Where
- Implementation Steps: tasks achievable within this codebase.
- Post-Completion: manual or external-system work, without checkboxes.

## Implementation Steps

### Task 1: [specific name]
**Files:**
- Create: `exact/path/to/new_file`
- Modify: `exact/path/to/existing_file`

- [ ] [specific code action with file reference]
- [ ] [specific test action for success cases]
- [ ] [specific test action for error/edge cases]
- [ ] Run relevant tests and confirm they pass before next task.

### Task N-1: Verify Acceptance Criteria
- [ ] Verify all Overview requirements are implemented.
- [ ] Verify edge cases are handled.
- [ ] Run full test suite: `[command]`
- [ ] Run E2E tests if applicable: `[command]`

### Task N: Final Documentation
- [ ] Update README or project docs if needed.
- [ ] Update agent/project instructions if new patterns were discovered.
- [ ] Move this plan to `docs/plans/completed/`.

## Technical Details
- Data structures and changes.
- Parameters and formats.
- Processing flow.

## Post-Completion
Items requiring manual intervention or external systems.

**Manual verification**:
- [scenario]

**External system updates**:
- [system/configuration/integration]
```

## Execution Rules

If the user chooses to start implementation from the plan:

1. Complete one task at a time.
2. Write or update tests in the same task as the code change.
3. Run the relevant test command before moving to the next task.
4. Mark task checkboxes as soon as work is completed.
5. If tests fail, fix failures before proceeding.
6. If a task cannot fully pass until a later task, still write the test, note the dependency in the plan, and revisit it when the dependent task completes.
7. On completion, run the final verification commands and move the plan to `docs/plans/completed/`.

## Next Step Prompt

After creating the file, tell the user:

```text
Created plan: docs/plans/YYYYMMDD-title.md
```

Then ask what to do next. Offer options such as:

- Review the plan.
- Start implementation.
- Stop after the plan.
