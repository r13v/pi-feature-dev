---
name: ship
description: Take a non-trivial feature from a raw request to validated, cleaned-up changes in one run. Settle the right target and the decisions with the user, implement with design approval, remove the bloat the work added, check for missed requirements, learn from the friction of the run, and defer the ideas outside the scope to the backlog. Use when the user asks to ship a feature end to end, to run the whole pipeline, or to start from a backlog item; skip mechanical edits, small fixes, and work with no implementation.
---

# Ship

Take one non-trivial implementation request through the full pipeline:

```text
[elevate] → grill → [deepen] → feature-dev → deslop → [final-check] → [retro]
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

If the request is the path of a backlog item under `docs/backlog/`, read the
item as the `backlog` skill describes. Check its `where` and its evidence
against the current code. If the item is stale or the idea is already done,
offer to drop it as the `backlog` skill describes, and then stop. If its `worth`
is `no`, give the
reason from the item and ask whether to continue. Otherwise, use the item as
the original request. It is an idea to grill, not a settled specification.
Write the path of the item in the progress file. Delete the item file during
feature-dev, as a change of this task.

## Keep a progress file

Keep the state of the pipeline in a progress file, not only in the
conversation. The file prevents skipped stages and lets the work continue
after the context is compacted or in a new session in the same checkout.

Put the file in the directory that `git rev-parse --path-format=absolute
--git-path ship` prints, as `<run-id>.md`. Make the run ID from the start date
and time and a short task slug, such as `20261022-1530-add-export`. Create the
directory if it does not exist. Git does not track this directory, so the file
does not change the working tree or the diff of the task. If the host does not
let you write there, tell the user and ask where to keep the file. Do not
continue without a progress file.

Before the first stage, look for a progress file with `status: active` on the
current branch. If it matches this task, read it and continue from the first
stage that has no result. If the file has no `Friction` section or no retro
entry, add an empty section and `retro: selection pending after final-check or
deslop`. If you cannot tell whether it matches, ask the user. Do not resume a
file with `status: finished`.

Otherwise, start a new run. If a file `<run-id>.md` already exists, choose
another run ID. Start the file with YAML frontmatter:

```yaml
---
status: active
run_id: 20261022-1530-add-export
branch: f/export
start_commit: 14da9c8
started: 2026-10-22T15:30
---
```

Use `git branch --show-current` for `branch`, or `detached` if it prints
nothing. Use `git rev-parse --short HEAD` for `start_commit`, or `none` on a
branch with no commits. In the body, write:

- the original request;
- one entry for each stage: `selected`, `skipped: <reason>`, or, for deepen,
  `selection pending after grill`, and for retro, `selection pending after
  final-check or deslop`;
- an entry `deferred ideas: pending`;
- an empty `Friction` section;
- an empty `Deferred ideas` section.

Before a stage starts, read the file. Do not start a stage until each earlier
stage has an entry with `done` or `skipped: <reason>`. An entry with
`selection pending` does not count. When a stage ends, write its
status and its result: the approved elevated request, the Grill Result, the
acceptance criteria, the selected design, and the checks that ran. Write each
user decision when the user makes it.

When ship ends, set `status: finished`, and give the path of the file in the
output. Do not set `status: finished` while the `deferred ideas` entry is
`pending`.

## Record friction

Add a friction entry to the `Friction` section of the progress file when one
of these happens:

- a check fails when the agent expected it to pass;
- the diff review or final-check finds a problem in the scope, and you
  confirm it;
- the user corrects a statement or an action of the agent. An answer to a
  question is not a correction;
- a stage gets `reopened: <reason>`;
- the agent cannot find a file or a fact that it needs, and asks the user or
  searches more than once without a result.

Write one line for each entry: the stage, what happened, and the evidence,
such as the command, the file, or the finding. Do not write entries for other
moments. The `retro` skill reads these entries.

## Changes of the task

All changes in the working tree after the start commit are changes of this
task. This includes uncommitted changes that existed before ship started and
changes that the user makes during the run. If the working tree has
uncommitted changes at the start, say in one line that they become part of
the task.

When a stage needs the changes of the task, run `git diff <start_commit>` and
`git ls-files --others --exclude-standard`. On a branch with no commits, all
files are changes of the task. Do not copy diffs or file content into the
progress file. Read the current changes from git when a stage needs them.

## Choose the stages

Always run `grill`, `feature-dev`, and `deslop`. Select `elevate` and
`final-check` before the first stage starts. Select `deepen` after grill,
when the acceptance criteria are known. Select `retro` after final-check, or
after deslop when final-check is skipped. If the user includes or skips a
stage, do what the user says.

- **`elevate`:** Run it when one of these is true:
  - the request names an artifact or a one-off action and does not say what
    it is for, such as "fix this crash" or "write an export script";
  - the repository history, the tickets, or the conversation show the same
    kind of request before;
  - the result feeds a meeting or a decision that the request names.

  Skip it when the request already states the outcome and the acceptance
  criteria, when the user set a fixed deadline or scope, or when the change
  is mechanical.
- **`deepen`:** Run it when one of these is true:
  - the result depends on a claim that raw data can confirm or refute, such
    as the cause of a bug, a performance bottleneck, a metric, or the
    behavior of data in a migration;
  - for some acceptance criterion, the Grill Result does not name a concrete
    check that can decide it, such as a test to write, a reproduction, or a
    command;
  - an acceptance criterion depends on data outside the repository.

  Skip it when the Grill Result names a concrete check for each acceptance
  criterion and the change follows an existing pattern in the repository.
- **`final-check`:** Run it after implementation by default.
- **`retro`:** Run it when the `Friction` section has at least one entry.
  Skip it with the reason `smooth run` when the section is empty.
- **`creator-vibe`:** This is a lens, not a separate stage. Apply it when the
  request carries an intended feeling, voice, or human experience, such as a
  UI, onboarding, copy, error messages, or developer experience. Skip it for
  backend, migration, and mechanical work.

If a run condition and a skip condition both hold, skip elevate, because it
grows the scope, and run deepen, because it keeps the goal.

State the selected stages in one line. Give a reason for each skipped stage.

## Run the stages

Each stage takes the result of the previous stage as its request. The approval
points of each stage stay in effect. A ship request does not approve them.

1. **Elevate.** The rewritten request changes the scope. Wait for the user to
   approve it. If the user declines, continue with the original request.
2. **Grill.** Run the interview rounds and the final confirmation as the grill
   skill describes. Use the confirmed `Grill Result` as the input for all
   later stages. Glossary and ADR updates from grill are changes of this
   task. If grill changes the goal, tell the user and ask whether to continue
   with the new goal. Do not run elevate again without telling the user.
3. **Deepen.** A ship request counts as a request to proceed. Continue with
   the rewritten request without a separate stop. Stop if deepen lists
   blockers. If deepen proposes a different deliverable, stop and offer to run
   elevate with it. If the user accepts, write the new deliverable to the
   progress file. Set the elevate, grill, and deepen entries to `reopened:
   <reason>`, which does not count as a result. Keep the start commit. Then
   run elevate, and run grill again for the decisions that the new
   deliverable changes. Add the external validation from deepen to the
   acceptance criteria of feature-dev.
4. **Feature-dev.** Implement the confirmed scope. When a design trigger of
   feature-dev applies, present the architecture approaches with a
   recommendation, as feature-dev describes. If the Grill Result already
   selected an approach, recommend that approach. Wait for the user's choice.
   A ship request is not a request to proceed without design approval. Skip
   the wait only if the user explicitly asked to skip design approval.
   Validate against the success criteria in the Grill Result and against the
   deepen validation, if there is one.
5. **Deslop.** A ship request approves cleanup of the changes of this task
   only. Give deslop that scope explicitly: the hunks in `git diff
   <start_commit>` and the untracked files that are not ignored. After
   cleanup, run the affected checks again.
6. **Final-check.** Compare the result with the original request, the Grill
   Result, and the acceptance criteria. Fix the confirmed gaps in scope.
7. **Retro.** Run the `retro` skill in this context, not in a subagent,
   because the friction of the run is in this context. Set the retro entry
   to `done: <N> candidates`.
8. **Deferred ideas.** Offer the collected ideas as the next section
   describes.

## Defer ideas

When a stage finds an idea outside the confirmed scope, do not do it. Add one
line to the `Deferred ideas` section of the progress file: the idea, its
evidence, and the stage that found it. Do not ask the user about each idea
when it appears. Ideas come from:

- grill: non-goals and deferred decisions that are real ideas, not only
  limits of this task;
- feature-dev: findings of the diff review that are outside the scope;
- final-check: gaps that are real but outside the scope;
- retro: changes to the environment of the agent, in lines that start with
  `retro:`, and changes to skills, in lines that start with `retro-skill:`.

When the retro entry is `done` or `skipped: <reason>`, give the ideas of the
section to the `add` mode of the `backlog` skill. It asks the user about the
ideas in one batch. Ask it to add the option "do now" only for an idea that
does not change the accepted objective and is not a confirmed non-goal. Do
not add "do now" to the `retro:` ideas. A `retro` idea is a
separate change, so it passes the first condition of the filing bar. Do not
give the `retro-skill:` ideas to the `backlog` skill. Show them in the output,
and write `shown in output` next to each of them as its decision. If no ideas
are left for the `backlog` skill, do not call it. Write each decision next to
its idea in the progress file.

Implement each "do now" idea in this run. Then run deslop on the new hunks,
and run final-check again for them, or the feature-dev validation if the user
skipped final-check. Mark each step next to the idea when it ends. Give the
ideas that this second pass finds to the `add` mode without the "do now"
option. Record the friction of the second pass, but do not run retro again.
A later retro reads it from the past runs.

Set the `deferred ideas` entry to `done` when the section is empty, or when
each idea has a decision and each "do now" idea has passed its checks.

## Run checks in a fresh context

The agent that wrote the code is the weakest judge of its gaps. When the host
can run subagents, run these checks in a subagent with a fresh context:

- the review of the diff in feature-dev;
- final-check.

Give the subagent the path of the progress file, the acceptance criteria, and
the commands that show the changes of this task. If the repository has a
standards document for review, such as `CODING_STANDARDS.md` or
`CONTRIBUTING.md`, give its path too. Do not give it the conversation. Tell
it to report findings and not to edit files, and to list the findings outside
the scope separately.

Before you fix a finding, open the code that it cites and confirm it. Make
all fixes yourself, so that one agent writes the code. If the host cannot run
subagents, run the checks yourself, and read the standards document first.

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

- Each stage that ran or was skipped, with the reason.
- The accepted objective from the Grill Result.
- The changes, the files touched, and the key decisions.
- The validation that ran, and the items that remain unverified.
- The path of the progress file.
- The backlog items that this run created, changed, or deleted.
- The `retro-skill:` ideas, if any.
- Blockers and follow-ups, if any.
