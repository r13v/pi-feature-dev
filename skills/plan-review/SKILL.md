---
name: plan-review
description: Review implementation plans against the actual repository before execution, combining plan-quality checks with an evidence-backed technical pre-mortem and a PASS / REVISE / BLOCK verdict. Use after a plan is created or when the user asks to validate a plan for correctness, scope, over-engineering, missing tests, project-convention fit, blast radius, rollback, migration risk, contract risk, authorization risk, production-config risk, or what could break. Review plan files such as docs/plans/*.md or a user-provided plan path. Prefer isolated read-only review when the host and policy support it.
---

# Plan Review

Review the plan before implementation. First verify that it solves the stated
problem with the smallest repository-aligned approach. Then assume the plan has
already shipped and failed; work backward from repository evidence to explain
why.

**Remain read-only. Analyze and report; never implement or edit the plan.**

**Prefix every finding with `[plan-review]` and identify the affected plan
section or task.**

## Isolate the Review

Prefer an isolated reviewer when the host agent and active policy support
fresh-context, read-only workers or equivalent delegation.

Give the isolated reviewer only:

- The plan path or plan text.
- The original user request, if available.
- The repository root.
- Any explicit review focus from the user.

Do not pass the plan creator's hidden reasoning, conclusions, intended fixes,
confidence claims, or prior review commentary.

If isolation is unavailable, perform the review locally. Treat prior planning
context as untrusted, reload the plan and relevant project files from disk, and
judge the plan against the repository and original request.

## Resolve the Review Target

1. Review the user-provided plan path or plan text when present.
2. Otherwise, list plans in `docs/plans/`, excluding `completed/`.
3. If exactly one current plan exists, review it.
4. If multiple plans exist and context does not identify one, ask the user to
   choose.
5. If no plan is available, ask for its path or text.

## Build Repository Evidence

Read applicable project guidance such as `AGENTS.md`, `CLAUDE.md`, nearby
README files, and contributor documentation. Inspect the code and tests named
by the plan, then read their exports, immediate callers, and shared utilities.
Trace relevant data and control flow to repository boundaries.

Inspect migrations, schemas, configuration, deployment paths, authorization,
jobs, queues, caches, and operational documentation only when the planned
change can reach them. Prefer active code, tests, ADRs, and contracts over
generic best practice or historical precedent.

## Run the Plan-Quality Pass

Check that the plan:

- States the actual problem, requested outcome, assumptions, non-goals, and
  acceptance criteria.
- Records the relevant repository context, affected files, systems, and
  workflows, the selected approach, and why it fits active patterns.
- Proposes a solution that can produce the outcome without missing steps and
  handles relevant domain edge cases and failure paths.
- Keeps scope neither too broad nor too narrow: include all work required for
  the outcome and exclude unrelated work.
- Follows all user and repository instructions, current code patterns, naming
  and comment conventions, and preferred existing libraries.
- Produces readable, maintainable code through appropriate decomposition; do
  not accept cleverness or layering that the problem does not require.
- Orders dependencies correctly and divides work into concrete, atomic tasks
  with descriptive names and exact files, symbols, and commands.
- Gives every code-change task separate test work that protects the intended
  rule, including exact test-file locations and relevant success, error, and
  edge cases.
- Requires relevant tests to pass before the next task, names exact verification
  commands, and records any external, credentialed, manual, or
  environment-dependent step needed for completion.

If `plan-make` created the plan, also check its self-contained plan contract.
Do not require its exact headings when the same information is clear elsewhere.

### Reject Over-Engineering and YAGNI Violations

Actively look for:

- Unnecessary abstractions or interfaces without a current use.
- Premature generalization and flexibility added "just in case."
- Pattern abuse where direct code meets the requirement.
- Excessive layers, indirection, configuration, or extension points.
- New dependencies or custom utilities that duplicate repository or standard
  capabilities.
- Features and infrastructure not required by the requested outcome.

Require the simpler alternative when it satisfies the current requirement and
repository constraints. Do not flag complexity inherent to the domain.

Resolve uncertainty from repository evidence first. If a user decision could
change behavior, scope, approach, or verdict, ask instead of guessing. If the
review must conclude before the user answers, report the decision as `UNKNOWN`
and return `BLOCK` rather than inventing an assumption.

## Run the Technical Pre-Mortem Pass

Assume the planned change was merged, deployed, and failed. Investigate the
failure as an accomplished fact instead of asking abstractly what might go
wrong.

Reconstruct the blast radius:

1. Identify what the plan changes.
2. Trace what depends on each changed surface.
3. Trace what state, identity, contract, configuration, or infrastructure those
   dependents share.

Use these as relevance-gated leads, not a coverage quota. Skip what the change
cannot touch, and follow evidence beyond this list:

- Historical, partial, and in-flight rows; migration ordering and
  reversibility.
- Indirect contract consumers, strict schemas, and mixed-version coexistence.
- The sole producer of an identity, code, or foreign key.
- Authorization, ownership, tenancy, row scope, and secrets.
- Concurrency, idempotency, shared state, and partial failure.
- Deploy order, configuration defaults, and manual operational steps.
- Rollback: whether the documented lever still reverts the change and what
  state survives in data, caches, queues, or jobs.
- Whether the system records the value that actually took effect, so a no-op
  release remains distinguishable from a real one.
- Claims that a path is dormant, unused, or safe; verify them independently.
- Tests that mock the changed boundary, assert an implementation path instead
  of an effect, or can pass after removing the assertion that protects the
  rule.
- Mechanical fallout such as unused imports, dead code, lint failures, or type
  errors caused by removing or replacing a branch.

## Admit Findings Only With Proof

Before reporting a finding or requiring a plan edit, try to disprove it against
the repository. Admit it only when you can name the artifact that establishes
its premise and explain the causal link to the consequence. A `path:line`
citation alone is not evidence.

For every finding, provide:

- The failure symptom.
- The causal mechanism and supporting `path:line` evidence.
- One operation that would prove the finding false: a query, test, or file to
  inspect.
- The smallest plan edit that prevents or contains the failure.

Report a claim as `UNKNOWN` only when the missing fact could change the verdict;
otherwise omit it. Keep verified facts separate from assumptions.

Treat repository ADRs, invariants, and active public or domain contracts as
constraints. Prescribe the mechanism the repository sanctions today, never one
it retires or forbids. If the plan genuinely requires a deviation, return
`BLOCK` for an owner decision instead of presenting the deviation as a routine
mitigation.

Do not invent findings to fill categories. Do not flag necessary domain
complexity, used test infrastructure, or repository-standard patterns without
evidence of harm.

## Report the Result

Order findings by harm. Prefix each finding with `[plan-review]`, cite the plan
section or task, and include symptom, mechanism, falsifier, and smallest required
edit. Do not emit empty severity sections or follow a fixed finding quota.

After the findings, report:

- **Blast radius**: verified dependents and shared surfaces affected by the
  plan.
- **Rollback**: the actual rollback lever, residual state, and any
  verdict-changing unknowns.
- **Verdict**:
  - **PASS** — implementable as written.
  - **REVISE** — implementable only after the named plan edits; state those
    edits as requirements, not advice.
  - **BLOCK** — do not implement until an unmitigated blocking risk, forbidden
    mechanism, or owner decision is resolved.

Report and stop. Do not implement.
