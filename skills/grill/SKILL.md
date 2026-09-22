---
name: grill
description: Stress-test an idea or domain model through evidence-backed interview rounds when the user asks to be challenged or grilled. Record agreed terminology and durable decisions.
---

# Grill

Interview the user until both sides share an explicit, evidence-backed understanding. Model the topic as a decision tree, research discoverable facts, challenge the domain language, and record settled terminology and durable decisions as they crystallize.

Keep the interview separate from implementation. Capturing agreed terminology and accepted ADRs is part of the session. An interview-only request ends with the confirmed result. If the user already requested planning or implementation afterward, continue that work after the interview resolves its prerequisites; do not require them to repeat the request.

## Core distinctions

- Treat a **fact** as something discoverable from the environment, artifacts, documentation, or code. Find it yourself.
- Treat a **decision** as a choice among viable alternatives. Put it to the user with a recommendation.
- Treat a **prerequisite** as a fact or decision that must settle before a downstream question can be answered without guessing.
- Treat the **frontier** as every unresolved decision whose prerequisites are settled now.

Never turn a discoverable fact into homework for the user. Never silently turn an unresolved decision into an assumption. When the user delegates a decision, state the chosen option and trade-off and treat that delegation as sufficient.

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
- If neither exists, create a root `CONTEXT.md` after the first domain term is resolved by the user or within an explicitly delegated terminology choice.

Call out glossary conflicts immediately. Replace fuzzy or overloaded words with a proposed canonical term and ask the user to choose. Stress-test relationships and boundaries with concrete scenarios, especially edge cases that distinguish similar concepts.

Do not force domain documentation into a conversation-only session or a workspace where file writes are out of scope. Keep a concise decision and terminology ledger in the conversation instead.

### 4. Ask one frontier round

Compute the full current frontier. Exclude:

- questions answerable through research
- questions whose prerequisites are unresolved
- questions whose answers cannot change the outcome

Ask independent frontier questions together, using the host's question interface when available. Split a large frontier into manageable rounds and retain the remaining questions in the ledger. Every question must include explicit answer options and a recommendation. This requirement also applies to clarification questions, ADR-recording questions, and the final shared-understanding confirmation. For each question:

1. State the decision precisely.
2. List at least two distinct, meaningful answer options. For a confirmation, spell out both confirming and correcting or declining; do not assume yes/no is implicit in the question.
3. Recommend one of the listed options by label and give a brief reason. The recommendation never substitutes for the options.
4. Allow a free-form answer. For an unbounded choice, offer concrete starting options plus a way to supply a different answer; do not replace all options with an invitation to respond freely.

When using the host's question interface, populate its options field and identify the recommended option. When asking in chat, use this required format for every question, with consecutive question numbers and additional option lines as needed:

```md
❓ **Q1** - **<decision title>**: <question body>

- **A — <option>**: <meaning or trade-off>
- **B — <alternative>**: <meaning or trade-off>

➡️ **Recommend A** — <brief reason>

You can choose an option or give a different answer.
```

Before sending a round, check that every question has its own visible options and a recommendation pointing to one of them. A question followed only by a recommendation is incomplete; add the missing options before sending.

Then stop and wait for the user's answers. A question that depends on another question in the same round belongs to a later round.

### 5. Process answers and advance the tree

After each response:

1. Convert answers into explicit decisions without adding unstated meaning.
2. Resolve contradictions or ambiguity before depending on the answer.
3. For delegated choices, record the chosen recommendation and its trade-off. Ask again only if new evidence exceeds the delegated scope.
4. Update the terminology and decision ledger.
5. Recompute the tree and ask the next complete frontier round.

Continue until no unresolved branch can materially affect the result. Respect an explicit request to stop or defer a branch, but record the resulting unresolved decision and its impact.

## Record decisions during the grill

When a project term is resolved by the user or within delegated authority, update the applicable `CONTEXT.md` if documentation is in scope. Resolve [CONTEXT-FORMAT.md](./CONTEXT-FORMAT.md) from the selected `grill/SKILL.md` directory, then read and follow it before the first update. Keep `CONTEXT.md` a glossary only: no implementation details, requirements, scratch notes, or architectural decisions.

Offer an ADR only when all three conditions hold:

1. The decision is hard or costly to reverse.
2. The choice would be surprising without its context.
3. Genuine alternatives were considered and rejected for specific reasons.

If any condition is missing, do not create an ADR. If all three hold and ADR recording is not already authorized, ask whether to record it using the required question format (for example, A: record the ADR; B: keep the decision in the session ledger only). Then resolve [ADR-FORMAT.md](./ADR-FORMAT.md) from the selected `grill/SKILL.md` directory and read and follow it. Create directories and files lazily.

## Finish with a confirmed session result

The grill is complete when research is settled enough for the decision, the frontier is empty, and no material branch remains silently assumed.

Present a candidate shared-understanding summary containing:

- objective and success criteria
- settled decisions and their main trade-offs
- canonical domain language
- constraints, invariants, and explicit non-goals
- unresolved facts, deferred decisions, and risks
- documentation created or updated

Ask the user to confirm that this is the shared understanding using the required question format (A: confirm the summary; B: correct or reopen part of it). If they correct or reopen anything, add the affected branches and resume the rounds.

After the user confirms, show a final `Grill Result` that records the accepted objective, decisions, canonical language, constraints, non-goals, unresolved items, and documentation changes. End an interview-only request there. Confirmation settles the shared understanding; it does not grant additional execution authority. Continue a previously requested follow-on phase only within its established scope.
