# Plan Template

Adapt this template to the actual change. Omit irrelevant sections, replace all
placeholders, and use repository-verified paths and commands. The task headings
and checkbox syntax are the `plan-exec` execution interface; the other headings
are defaults, not a required document length.

```markdown
# [Plan title]

## Overview
[Original request, problem, desired behavior, and acceptance criteria.]

## Context
- Relevant files and symbols: [paths and responsibilities]
- Existing patterns and contracts: [concrete references]
- Constraints and dependencies: [applicable project guidance and environment]

## Review Handoff
- Selected approach and rationale: [decision and meaningful trade-offs]
- Non-goals: [excluded work]
- Assumptions and unresolved decisions: [state, or none]
- Authorization: [requested implementation and any external actions or gates]

## Implementation Steps

### Task 1: [Specific outcome]
**Why:** [How this task contributes to the requested result]
**Files:** [Exact paths to create or modify, with relevant symbols]
**Depends on:** [Earlier tasks, or none]

- [ ] [Concrete implementation action]
- [ ] [Behavioral evidence: existing check or a justified new/updated test]
- [ ] [Exact relevant validation command and expected result]

### Task 2: Verify acceptance criteria
- [ ] [Remaining integration, runtime, visual, or project-required final check]

## Technical Details
[Only non-obvious invariants, contracts, formats, or ordering the executor needs.]

## Required External or Manual Verification
[For each required check: acceptance criterion, procedure, owner/environment,
authorization, and the evidence needed before the overall result is complete.]

## Post-Completion
[Optional follow-up outside the acceptance criteria. No executable checkboxes.]
```

Add as many task sections as the dependency structure needs. Include doc updates
only when the change affects documentation. Plan archival is optional unless the
user or repository workflow requires it.

During execution, check an item only after its outcome is verified. Record a
blocked item as unchecked with a `BLOCKED:` reason. Update decisions and scope
when they change so a fresh worker sees the current contract. If a later task
must precede a check, record that dependency instead of pretending the check
passed.
