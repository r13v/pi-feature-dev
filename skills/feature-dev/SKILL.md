---
name: feature-dev
description: Structured feature development workflow for Pi. Use for non-trivial feature work requiring codebase exploration, clarification, architecture trade-offs, implementation approval, subagent review, and final summary.
compatibility: "Pi. Best with pi-subagents, @juicesharp/rpiv-todo, and @juicesharp/rpiv-ask-user-question installed; optional context-mode, pi-web-access, and pi-intercom improve the workflow."
---

# Feature Dev for Pi

Run a guided, Pi-native feature development workflow. This skill replaces the Claude Code `feature-dev` command/agents with Pi tools:

- `todo` for phase/progress tracking
- `subagent` from `pi-subagents` for scout/planner/worker/reviewer fanout
- `ask_user_question` for structured decisions and multiple-choice clarification
- `web_search`, `code_search`, and `fetch_content` for external context when needed
- `intercom` only when coordinating with separate live Pi sessions or subagent escalations

This skill is for the parent/orchestrator session. Child subagents should receive concrete role-specific tasks; do not ask child agents to run this workflow or spawn their own subagents.

## Operating Rules

1. **Clarify before coding.** Do not implement until scope, acceptance criteria, constraints, and non-goals are clear enough.
2. **Explore before designing.** Inspect relevant existing code and patterns before proposing architecture.
3. **Ask before implementation.** Present the preferred architecture and wait for explicit user approval before editing.
4. **Keep writes single-threaded.** Use the parent session or one `worker` subagent as the writer. Never run parallel writers in the same checkout.
5. **Review after implementation.** Use fresh-context reviewers to inspect the diff, synthesize findings, then apply only approved/worthwhile fixes.
6. **Use available tools only.** If a recommended tool is unavailable, continue with the closest Pi-native alternative and state the fallback briefly.
7. **For large outputs.** If context-mode tools are available, use them for test/build/log/git output. Otherwise run focused commands and summarize concise output.

Before executing any subagent, call `subagent({ action: "list" })` and only use executable/non-disabled agents from the result.

## Recommended Agent Mapping

Use built-in `pi-subagents` roles by default:

| Need | Pi role |
| --- | --- |
| Codebase exploration | `scout` or `context-builder` |
| Architecture planning | `planner` |
| Implementation handoff | `worker` |
| Quality review | `reviewer` |
| External evidence | `researcher` |
| Decision consistency/advisory review | `oracle` |

Do not create custom agents unless the user explicitly wants persistent role overrides. This package intentionally works with built-in Pi subagents.

## Workflow

### Phase 1 — Discovery

Goal: understand what needs to be built.

Actions:

1. Create phase todos with `todo` for Discovery, Exploration, Clarification, Architecture, Implementation, Review, and Summary/Validation. Keep exactly one todo `in_progress` at a time.
2. If the feature request is unclear, ask concise questions before doing deep work:
   - What problem should this solve?
   - What should the user-visible behavior be?
   - What constraints, deadlines, compatibility requirements, or non-goals matter?
3. Summarize your understanding and call out assumptions.

Use `ask_user_question` only for questions with 2-4 clear choices. For open-ended requirements, ask normally in chat.

### Phase 2 — Codebase Exploration

Goal: understand relevant code and project patterns at high and low levels.

Default subagent fanout for non-trivial features:

```ts
subagent({
  action: "list"
})

subagent({
  tasks: [
    {
      agent: "scout",
      task: "Find features similar to <feature> and trace their implementation. Return key entry points, data flow, conventions, risks, and 5-10 essential files to read. Do not edit files."
    },
    {
      agent: "context-builder",
      task: "Map the architecture, abstractions, module boundaries, and integration points relevant to <feature>. Return file:line references and 5-10 essential files to read. Do not edit files."
    },
    {
      agent: "scout",
      task: "Identify tests, validation patterns, UI/API patterns, configuration, and extension points relevant to <feature>. Return concrete files and gaps. Do not edit files."
    }
  ],
  concurrency: 3,
  context: "fresh"
})
```

Adapt the tasks to the project. Use two agents for medium work; three for broad features. Skip subagents for trivial single-file changes, but still inspect relevant files yourself.

After subagents return:

1. Read the essential files they identified.
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

Ask all necessary questions in one organized batch. Use `ask_user_question` for structured decisions; otherwise ask a numbered free-form list. Wait for answers before architecture design.

If the user says “whatever you think is best,” state your recommendation and get explicit confirmation unless the decision is low-risk and reversible.

### Phase 4 — Architecture Design

Goal: compare viable implementation approaches and get approval.

For complex work, run 2-3 planning passes with different trade-off lenses:

```ts
subagent({
  tasks: [
    {
      agent: "planner",
      task: "Design a minimal-change implementation for <feature> using the exploration findings and clarified requirements below. Include files to change, build sequence, risks, validation. Do not edit files.\n\n<context>..."
    },
    {
      agent: "planner",
      task: "Design a clean-architecture implementation for <feature> prioritizing maintainability and testability. Include files to change, build sequence, risks, validation. Do not edit files.\n\n<context>..."
    },
    {
      agent: "planner",
      task: "Design a pragmatic balanced implementation for <feature>. Include files to change, build sequence, risks, validation. Do not edit files.\n\n<context>..."
    }
  ],
  concurrency: 3,
  context: "fresh"
})
```

Then synthesize:

- brief summary of each approach
- concrete file/component differences
- trade-offs
- your recommendation and reasoning
- validation plan

Ask the user which approach to use. `ask_user_question` is ideal here with options like Minimal, Pragmatic, Clean.

### Phase 5 — Implementation

Goal: build the approved feature.

Do not start without explicit approval.

Implementation options:

- **Parent writes directly** for small/medium scoped changes where you already have enough context.
- **One `worker` subagent** for larger changes after approval. Provide a complete handoff: requirements, chosen approach, files/areas, non-goals, acceptance criteria, validation, and escalation rules.

Worker handoff shape:

```ts
subagent({
  agent: "worker",
  task: "Implement the approved <feature> plan.\n\nClarified requirements:\n- ...\n\nChosen approach:\n- ...\n\nLikely files/areas:\n- ...\n\nNon-goals:\n- ...\n\nAcceptance criteria:\n- ...\n\nValidation expected:\n- ...\n\nUse one writer thread only. Ask before unapproved product, API, or architecture changes. Summarize files changed and validation results."
})
```

During implementation:

1. Follow existing patterns discovered earlier.
2. Keep changes focused on the approved scope.
3. Add or update tests when appropriate.
4. Update todos as each implementation subtask finishes.
5. If a new major decision appears, stop and ask.

### Phase 6 — Quality Review

Goal: catch correctness, test, and maintainability issues.

After implementation, review the current diff. Default parallel review:

```ts
subagent({
  tasks: [
    {
      agent: "reviewer",
      task: "Review the current diff for correctness, regressions, edge cases, and security issues. Inspect changed files directly. Do not edit files. Report only evidence-backed issues with file/line references."
    },
    {
      agent: "reviewer",
      task: "Review the current diff for tests and validation quality. Inspect changed files directly. Do not edit files. Report missing high-value tests or broken validation with file/line references."
    },
    {
      agent: "reviewer",
      task: "Review the current diff for simplicity, DRYness, maintainability, and project convention fit. Inspect changed files directly. Do not edit files. Report only important issues with file/line references."
    }
  ],
  concurrency: 3,
  context: "fresh"
})
```

Synthesize reviewer output into:

- blockers / must-fix now
- fixes worth doing now
- optional improvements
- feedback to ignore/defer

If the user already approved auto-fixing review findings, apply the “must-fix” and “worth doing now” items with one writer. Otherwise ask whether to fix now, defer, or proceed as-is.

### Phase 7 — Validation and Summary

Goal: prove the feature is complete and document outcomes.

Actions:

1. Run focused validation: tests, typecheck, lint, build, or manual checks appropriate to the project.
2. If validation fails, keep the current todo `in_progress`, explain the blocker, and fix or ask for direction.
3. When validation passes or the user accepts known limitations, mark todos complete.
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
