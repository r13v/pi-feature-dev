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

## Keep a progress file

Keep the state of the pipeline in a progress file, not only in the
conversation. The file prevents skipped stages and lets the work continue
after the context is compacted or in a new session in the same checkout.

Put the file in the directory that
`git rev-parse --path-format=absolute --git-path ship` prints, as
`<run-id>.md`. Make the run ID from the start date and time and a short task
slug, such as `20261022-1530-add-export`. Create the directory if it does not exist. Git does not
track this directory, so the file does not change the working tree or the
diff of the task. If the host does not let you write there, tell the user and
ask where to keep the file. Do not continue without a progress file.

Before the first stage, look for a progress file with `status: active` on the
current branch. If it matches this task, read it and continue from the first
stage that has no result. If you cannot tell whether it matches, ask the user.
Do not resume a file with `status: finished`.

Otherwise, start a new run. Before you create the file, make sure that no file
`<run-id>.md` and no ref `refs/ship/<run-id>` exist. Check the ref with
`git show-ref --verify --quiet refs/ship/<run-id>`. If one exists, choose
another run ID. Then create the file with:

- `status: active`, the current branch (or `detached`), the `HEAD` commit if
  there is one, and the start time;
- the original request;
- the baseline;
- one entry for each stage: `selected`, `skipped: <reason>`, or, for deepen,
  `selection pending after grill`.

Before a stage starts, read the file. Do not start a stage until each earlier
stage has an entry with `done` or `skipped: <reason>`. A deepen entry with
`selection pending after grill` does not count. When a stage ends, write its status
and its result: the approved elevated request, the Grill Result, the
acceptance criteria, the selected design, and the checks that ran. Write each
user decision when the user makes it.

When ship ends, set `status: finished`, and give the path of the file in the
output.

## Record the baseline

Record the baseline when you create the progress file, before any stage can
write files. The baseline separates earlier work from the changes of this
task. It includes staged, unstaged, and untracked files that are not ignored.

Take a snapshot of the working tree through a temporary index. This does not
change the index or the working tree, and it also works on a branch with no
commits:

```sh
tmp=$(mktemp) && rm -f "$tmp" || exit 1
idx=$(git rev-parse --path-format=absolute --git-path index) || exit 1
if [ -f "$idx" ]; then cp "$idx" "$tmp" || exit 1; fi
tree=$(GIT_INDEX_FILE="$tmp" git add -A && GIT_INDEX_FILE="$tmp" git write-tree)
rc=$?
rm -f "$tmp"
[ "$rc" -eq 0 ] && [ "$(git cat-file -t "$tree" 2>/dev/null)" = tree ] || exit 1
echo "$tree"
```

The block prints a tree ID. If it exits with a nonzero status, stop and tell
the user.

1. Write the tree ID to the progress file as the baseline.
2. Pin it, so that garbage collection does not remove it:
   `git update-ref refs/ship/<run-id> <tree>`.
3. When ship ends, delete the pin with `git update-ref -d
   refs/ship/<run-id>`.

When a stage needs the changes of this task, take a new snapshot the same way
and run `git diff <baseline> <snapshot>`. This shows new, changed, deleted, and
renamed files, also files that were untracked at the baseline. Do not commit,
stash, or reset to make a snapshot. Do not copy the baseline diffs or file
content into the conversation or the progress file. Read the current diff from
git when a stage needs it.

## Choose the stages

Always run `grill`, `feature-dev`, and `deslop`. Select `elevate` and
`final-check` before the first stage starts. Select `deepen` after grill,
when the acceptance criteria are known. If the user includes or skips a stage,
do what the user says.

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
   <reason>`, which does not count as a result. Keep the baseline, so that the
   earlier grill changes stay changes of this task. Then run elevate, and run
   grill again for the decisions that the new deliverable changes. Add the external
   validation from deepen to the acceptance criteria of feature-dev.
4. **Feature-dev.** Implement the confirmed scope. When a design trigger of
   feature-dev applies, present the architecture approaches with a
   recommendation, as feature-dev describes. If the Grill Result already
   selected an approach, recommend that approach. Wait for the user's choice.
   A ship request is not a request to proceed without design approval. Skip
   the wait only if the user explicitly asked to skip design approval.
   Validate against the success criteria in the Grill Result and against the
   deepen validation, if there is one.
5. **Deslop.** A ship request approves cleanup of the changes of this task
   only. Give deslop that scope explicitly: the hunks in `git diff <baseline>
   <snapshot>`. Do not change work that existed before the baseline. If you
   cannot separate a hunk from earlier work, do not clean it up, and report
   it. After cleanup, run the affected checks again.
6. **Final-check.** Compare the result with the original request, the Grill
   Result, and the acceptance criteria. Fix the confirmed gaps in scope.

## Run checks in a fresh context

The agent that wrote the code is the weakest judge of its gaps. When the host
can run subagents, run these checks in a subagent with a fresh context:

- the review of the diff in feature-dev;
- final-check.

Give the subagent the path of the progress file, the acceptance criteria, and
the commands that show the changes of this task: the snapshot commands and
`git diff <baseline> <snapshot>`. Do not give it the
conversation. Tell it to report findings and not to edit files.

Before you fix a finding, open the code that it cites and confirm it. Make
all fixes yourself, so that one agent writes the code. If the host cannot run
subagents, run the checks yourself.

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
- Refs under `refs/ship/` that other runs left, if `git for-each-ref
  refs/ship/` lists any.
- Blockers and follow-ups, if any.
