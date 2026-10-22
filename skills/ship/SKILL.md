---
name: ship
description: Take a non-trivial feature from a raw request to validated, cleaned-up changes in one run. Settle the right target and the decisions with the user, implement with design approval, remove the bloat the work added, and check for missed requirements. Use when the user asks to ship a feature end to end or to run the whole pipeline; skip mechanical edits, small fixes, and work with no implementation.
---

# Ship

Take one non-trivial implementation request through the full pipeline:

```text
[elevate] → grill → [deepen] → feature-dev → deslop → [final-check]
```

This skill only orchestrates. Each stage follows its own skill. This skill
selects the stages, passes each result to the next stage, and keeps the
approval points of each stage. Ship ends with validated changes in the working
tree. Do not commit, push, publish, or deploy unless the user asks.

## Check the request first

Use ship only for non-trivial implementation. If the request is a mechanical
edit, a small fix, or work with no implementation, such as a report or an
analysis, do not run the pipeline. Name the shorter path that fits, such as a
direct edit or one skill, and stop.

## Choose the stages

Always run `grill`, `feature-dev`, and `deslop`. Select the optional stages
before the first stage starts. If the user includes or skips a stage, do what
the user says.

- **`elevate`:** Run it when the task names an artifact or a one-off action,
  when the task repeats, or when the task feeds a meeting or a decision. Skip
  it when the feature is already specified and agreed, when a fixed deadline
  or scope must not grow, or when the change is mechanical.
- **`deepen`:** Run it when the goal is clear but the work is easy to do
  shallowly, such as debugging or work that depends on data or analysis.
- **`final-check`:** Run it after implementation by default.
- **`creator-vibe`:** This is a lens, not a separate stage. Apply it when the
  request carries an intended feeling, voice, or human experience, such as a
  UI, onboarding, copy, error messages, or developer experience. Skip it for
  backend, migration, and mechanical work.

State the selected stages in one line. Give a reason for each skipped stage.
Keep a short stage ledger in the conversation. Update it when each stage
ends.

## Run the stages

Each stage takes the result of the previous stage as its request. The approval
points of each stage stay in effect. A ship request does not approve them.

1. **Elevate.** The rewritten request changes the scope. Wait for the user to
   approve it. If the user declines, continue with the original request.
2. **Record the baseline.** Do this before grill, because grill is the first
   stage that can write files. Record the current branch, its merge base,
   `git status`, and the files that already have changes. The baseline
   separates earlier work from the changes of this task. Glossary and ADR
   updates from grill are changes of this task. For each file that already
   has changes, keep its staged and unstaged diff in the conversation. Also
   keep the content of each untracked file. Do not commit, stash, reset, or
   write a snapshot file to make the baseline.
3. **Grill.** Run the interview rounds and the final confirmation as the grill
   skill describes. Use the confirmed `Grill Result` as the input for all
   later stages. If grill changes the goal, tell the user and ask whether to
   continue with the new goal. Do not run elevate again without telling the
   user.
4. **Deepen.** A ship request counts as a request to proceed. Continue with
   the rewritten request without a separate stop. Stop if deepen lists
   blockers. Stop if deepen proposes a different deliverable. Add the external
   validation from deepen to the acceptance criteria of feature-dev.
5. **Feature-dev.** Implement the confirmed scope. When a design trigger of
   feature-dev applies, present the architecture approaches with a
   recommendation, as feature-dev describes. If the Grill Result already
   selected an approach, recommend that approach. Wait for the user's choice.
   A ship request is not a request to proceed without design approval. Skip
   the wait only if the user explicitly asked to skip design approval.
   Validate against the success criteria in the Grill Result and against the
   deepen validation, if there is one.
6. **Deslop.** A ship request approves cleanup of the changes of this task
   only. Give deslop that scope explicitly: the files and hunks that changed
   after the baseline. Do not change work that existed before the baseline,
   also in the same files. If you cannot separate a hunk from earlier work,
   do not clean it up, and report it. After cleanup, run the affected checks
   again.
7. **Final-check.** Compare the result with the original request, the Grill
   Result, and the acceptance criteria. Fix the confirmed gaps in scope.

## Creator-vibe lens

When the lens applies, read the `creator-vibe` skill. Use it in three stages.
Do not add a stage or an approval point for it.

- **Grill.** Turn the intended feeling into observable qualities, such as
  "a first-time user finds the next action without help". Add them to the
  success criteria of the Grill Result. If the feeling is too vague to guide
  a choice, ask one question about it in a grill round.
- **Feature-dev design.** Compare the approaches also by how well each one
  carries the intended experience: defaults, the path to a first result, and
  behavior on failure. Include this comparison in the recommendation.
- **Final-check.** Try the result against the observable qualities, for
  example as a first-time user or after a failure. Fix the confirmed gaps in
  scope. If the user skipped final-check, do this check during the
  feature-dev validation.

The lens does not change the goal, the scope, or the deliverable.

## Documentation

If the task adds or changes documentation, such as a README, a guide,
`CONTEXT.md`, or an ADR, write and review that text with the `ste` skill in
clarity mode.

## Output

- The stage ledger: each stage that ran or was skipped, with the reason.
- The accepted objective from the Grill Result.
- The changes, the files touched, and the key decisions.
- The validation that ran, and the items that remain unverified.
- Blockers and follow-ups, if any.
