---
name: grill
description: Relentlessly stress-test an idea, plan, requirement, architecture, or domain model through dependency-aware interview rounds. Use when the user asks to be grilled, challenged, interviewed, or pushed toward shared understanding; when assumptions and decision branches must be exhausted before action; or when domain terminology and durable architectural decisions should be sharpened and recorded in CONTEXT.md and ADRs.
---

# Grill

Interview the user until both sides share an explicit, evidence-backed understanding. Model the topic as a decision tree, research discoverable facts, challenge the domain language, and record settled terminology and durable decisions as they crystallize.

Do not implement the resulting plan or design during or immediately after the grill. Capturing agreed terminology and accepted ADRs is part of the session. The skill ends after reporting the confirmed result; planning or implementation requires a separate user request.

## Core distinctions

- Treat a **fact** as something discoverable from the environment, artifacts, documentation, or code. Find it yourself.
- Treat a **decision** as a choice among viable alternatives. Put it to the user with a recommendation.
- Treat a **prerequisite** as a fact or decision that must settle before a downstream question can be answered without guessing.
- Treat the **frontier** as every unresolved decision whose prerequisites are settled now.

Never turn a discoverable fact into homework for the user. Never silently turn an unresolved decision into an assumption.

## Resolve bundled resources

Before invoking a read for any relative reference in this skill, resolve it against the directory containing the selected `grill/SKILL.md`. Use that resolved path for the read. Never use the global skills directory, the current working directory, or the repository root as the base.

## Workflow

### 1. Establish the subject

Restate the outcome being explored, the requested deliverable, and any explicit constraints. Mark interpretations as provisional until the user confirms them.

Build a mental decision tree rooted in that outcome. Add only branches that can materially change the result, such as:

- scope and non-goals
- actors, responsibilities, and boundaries
- domain terms and invariants
- lifecycle, states, and failure behavior
- data ownership and integration points
- usability, security, performance, or operational constraints
- trade-offs, validation, rollout, and reversibility

Tailor the branches to the subject. Do not ask ceremonial questions that cannot affect a decision.

### 2. Research the facts

Inspect the relevant workspace, code, tests, documentation, prior decisions, and external sources before questioning the user. Distinguish direct evidence, reasonable inference, and remaining unknowns.

Use read-only tools or isolated research workers when the host provides them and current instructions permit them. If research runs asynchronously, treat its result as an unsettled prerequisite: defer only the dependent questions and continue with the rest of the frontier. If delegation is unavailable, research directly.

When code, documentation, and the user's statement disagree, surface the conflict with concrete evidence. Do not average contradictory models. Ask which model is authoritative and identify the losing model as cleanup or migration work when relevant.

### 3. Load and challenge the domain language

Look for `CONTEXT-MAP.md` and the relevant `CONTEXT.md` before inventing terminology:

- If `CONTEXT-MAP.md` exists, use it to locate the applicable bounded context and its ADR directory.
- If only a root `CONTEXT.md` exists, treat the repository as a single context.
- If neither exists, wait until the first domain term is explicitly resolved before creating a root `CONTEXT.md`.

Call out glossary conflicts immediately. Replace fuzzy or overloaded words with a proposed canonical term and ask the user to choose. Stress-test relationships and boundaries with concrete scenarios, especially edge cases that distinguish similar concepts.

Do not force domain documentation into a conversation-only session or a workspace where file writes are out of scope. Keep a concise decision and terminology ledger in the conversation instead.

### 4. Ask one frontier round

Compute the full current frontier. Exclude:

- questions answerable through research
- questions whose prerequisites are unresolved
- questions whose answers cannot change the outcome

Ask every frontier question in one numbered round. For each question:

1. State the decision precisely.
2. Give a recommended answer and a brief reason.
3. Present meaningful alternatives or invite a free-form answer when the choice is not bounded.

Format each question exactly like this:

```md
❓ **Q1** - **<decision title>**: <question body; may include multiple paragraphs or choices>

➡️ <recommended answer and brief reason>
```

Then stop and wait for the user's answers. A question that depends on another question in the same round belongs to a later round.

### 5. Process answers and advance the tree

After each response:

1. Convert answers into explicit decisions without adding unstated meaning.
2. Resolve contradictions or ambiguity before depending on the answer.
3. Confirm delegated choices: when the user says "you decide," state the chosen recommendation and its trade-off, then ask the user to accept or revise it.
4. Update the terminology and decision ledger.
5. Recompute the tree and ask the next complete frontier round.

Continue until no unresolved branch can materially affect the result. Respect an explicit request to stop or defer a branch, but record the resulting unresolved decision and its impact.

## Record decisions during the grill

When a project term is explicitly resolved, update the applicable `CONTEXT.md` immediately. Resolve [CONTEXT-FORMAT.md](./CONTEXT-FORMAT.md) from the selected `grill/SKILL.md` directory, then read and follow it before the first update. Keep `CONTEXT.md` a glossary only: no implementation details, requirements, scratch notes, or architectural decisions.

Offer an ADR only when all three conditions hold:

1. The decision is hard or costly to reverse.
2. The choice would be surprising without its context.
3. Genuine alternatives were considered and rejected for specific reasons.

If any condition is missing, do not create an ADR. If all three hold, ask the user whether to record it, then resolve [ADR-FORMAT.md](./ADR-FORMAT.md) from the selected `grill/SKILL.md` directory and read and follow it. Create directories and files lazily.

## Finish with a confirmed session result

The grill is complete when research is settled enough for the decision, the frontier is empty, and no material branch remains silently assumed.

Present a candidate shared-understanding summary containing:

- objective and success criteria
- settled decisions and their main trade-offs
- canonical domain language
- constraints, invariants, and explicit non-goals
- unresolved facts, deferred decisions, and risks
- documentation created or updated

Ask the user to confirm that this is the shared understanding. If they correct or reopen anything, add the affected branches and resume the rounds.

After the user confirms, show a final `Grill Result` that records the accepted objective, decisions, canonical language, constraints, non-goals, unresolved items, and documentation changes. Then stop and return control to the user. Do not create a plan, write implementation code, launch an implementation handoff, or treat confirmation as permission to act.
