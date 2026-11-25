---
name: drive
description: Take a non-trivial feature from a raw request to validated, cleaned-up changes in one run. Settle the right target and the decisions with the user, implement with design approval, remove the bloat the work added, check for missed requirements, learn from the friction of the run, and defer the ideas outside the scope to the backlog. Use when the user asks to drive a feature end to end, to run the whole pipeline, or to start from a backlog item; in the quick mode, it runs only feature-dev, final-check, and deslop. Skip mechanical edits, small fixes, and work with no implementation.
---

# Drive

Take one non-trivial implementation request through the full pipeline:

```text
[elevate] → grill → [deepen] → feature-dev → [final-check] → deslop → [retro]
```

This skill only orchestrates. Each stage follows its own skill. This skill
selects the stages, passes each result to the next stage, and keeps the
approval points of each stage. Drive ends with validated changes in the working
tree. Do not commit, push, publish, or deploy unless the user asks. When the
user asks to commit, push, open a pull or merge request, merge, check the
deploy, or update the ticket, run the `land` skill with these steps after you
set `status: finished`.

When a stage starts, load the skill of that stage and follow it, even when
an earlier run in the same session loaded it. A stage that ran from memory
is not done. Talk to the user in the language of the request. The formats in
the skills fix the structure, not the words.

## Check the request first

Use drive only for non-trivial implementation. If the request is a mechanical
edit, a small fix, or work with no implementation, such as a report or an
analysis, do not run the pipeline. Name the shorter path that fits, such as a
direct edit or one skill, and stop. If the host started drive without the user
asking for it, propose drive and wait.

If the request is a backlog item, the path of a file or the key of a ticket,
read the item as the `backlog` skill describes. Check its `where` and its
evidence against the current code. Measure the claim of the evidence again
before you call the item stale. If only its `where` is out of date, update it
and continue. If the item is stale or the idea is already done, offer to drop
it as the `backlog` skill describes, and then stop. If its `worth` is `no`,
give the reason from the item and ask whether to continue. Otherwise, use the
item as the original request. It is an idea to grill, not a settled
specification. Write the path or the key of the item in the progress file.
Delete an item file during feature-dev, as a change of this task. A ticket item
is the ticket of this task.

If the host instructions require a ticket for each change, find the ticket
of the task, or create one before the first edit. The title names the
problem, not the fix. A new ticket posts to a service outside the
repository, so ask the user before you create it, also when the decisions
are delegated. Write the key of the ticket in the progress file.

## Keep a progress file

Keep the state of the pipeline in a progress file, not only in the
conversation. The file prevents skipped stages and lets the work continue
after the context is compacted or in a new session in the same checkout.

Put the file in the `drive` directory inside the directory that `git
rev-parse --path-format=absolute --git-common-dir` prints, as `<run-id>.md`.
All worktrees of the repository share this directory. Make the run ID from the
start date and time and a short task slug, such as `20261022-1530-add-export`.
Create the directory if it does not exist. Git does not track this directory,
so the file does not change the working tree or the diff of the task. If the
host does not let you write there, tell the user and ask where to keep the
file. Do not continue without a progress file.

Before the first stage, look for a progress file with `status: active` on the
current branch. If it matches this task, read it and continue from the first
stage that has no result. A file that an older version of drive wrote can
miss an entry or a section that this version writes. Add each missing one
with the value that this version gives at that point of the run: a missing
`mode` is `full`, and an `elevate` entry with no result is `skipped: not
requested`, unless the user asked for elevate. If you cannot tell whether it
matches, ask the user. When the branch is `detached`, a file of another worktree
can also match, so ask the user before you resume. Do not resume a file with
`status: finished`.

Otherwise, start a new run. Fetch the remote first. If the branch is behind
its upstream or the default branch, tell the user and ask whether to update
it before you write the start commit. If the fetch fails, say so in one line
and continue. If a file `<run-id>.md` already exists,
choose another run ID. Start the file with YAML frontmatter:

```yaml
---
status: active
mode: full
run_id: 20261022-1530-add-export
branch: f/export
start_commit: 14da9c8
started: 2026-10-22T15:30
---
```

Use `quick` for `mode` in the quick mode, and `full` otherwise. Use `git branch
--show-current` for `branch`, or `detached` if it prints nothing. Use `git
rev-parse --short HEAD` for `start_commit`, or `none` on a branch with no
commits. In the body, write:

- the original request;
- one entry for each stage: `selected`, `skipped: <reason>`, or, for deepen,
  `selection pending after grill`, and for retro, `selection pending after
  deslop`;
- an entry `feature-dev review: pending`, after the feature-dev entry;
- an entry `deferred ideas: pending`;
- an empty `Friction` section;
- an empty `Deferred ideas` section.

Before a stage starts, read the file. Do not start a stage until each earlier
stage has an entry with `done` or `skipped: <reason>`. An entry with
`selection pending` does not count. The `feature-dev review` entry counts as
an earlier stage of final-check. A missing `feature-dev review` entry counts
as done when final-check or deslop has a result. If deslop has a result and
final-check has none, run final-check, and then run deslop on the files that
its fixes changed. If feature-dev is skipped, set the review entry to
`skipped: feature-dev skipped`. When a stage ends, write its status and its
result: the approved elevated request, the Grill Result, the
acceptance criteria, the selected design, and the checks that ran. Write each
user decision when the user makes it. A subagent can report a wrong claim
about real data, such as a count or the effect of a deploy. Before such a
claim goes into the progress file, query the data again yourself. If you
cannot query it, write the claim as unverified.

When drive ends, set `status: finished`, and give the path of the file in the
output. Do not set `status: finished` while the `deferred ideas` entry is
`pending`.

## Record friction

Add a friction entry to the `Friction` section of the progress file when one
of these happens:

- a check fails when the agent expected it to pass;
- the diff review or final-check finds a problem in the scope, and you
  confirm it;
- deslop removes bloat that this task added (test bloat, verification
  theater, defensive or fallback bloat, or repeated comment noise), not a
  one-line comment edit;
- the user corrects a statement or an action of the agent. An answer to a
  question is not a correction;
- the user rejects a recommendation, rejects or reshapes a round or a
  deliverable, or states the goal again in other words;
- the user asks a question that shows the agent left out context that it
  had, such as the meaning of a term in a round;
- the user runs a skill or a check by hand that a stage of this run covers,
  or finds a defect in the result;
- a stage gets `reopened: <reason>`;
- the agent cannot find a file or a fact that it needs, and asks the user or
  searches more than once without a result.

Write one line for each entry: the stage, what happened, and the evidence,
such as the command, the file, the finding, or the user's words. Do not write
entries for other moments. The `retro` skill reads these entries.

After drive ends, keep recording in the same session. When one of these
moments happens about the result of the run, add the entry to the progress
file, even when its status is `finished`. Start the line with `post-run:`.
A later retro reads it.

## Changes of the task

All changes in the working tree after the start commit are changes of this
task. This includes uncommitted changes that existed before drive started and
changes that the user makes during the run. If the working tree has
uncommitted changes at the start, say in one line that they become part of
the task.

When a stage needs the changes of the task, run `git diff <start_commit>` and
`git ls-files --others --exclude-standard`. On a branch with no commits, all
files are changes of the task. Do not copy diffs or file content into the
progress file. Read the current changes from git when a stage needs them.

## Choose the stages

Run `grill`, `feature-dev`, and `deslop` by default. Calibrate planning to
the cost of rework: when the user asks for `drive` without `quick`, the
objective is already clear, and the change is local and cheap to reverse
(no public contract, persisted schema, or cross-module boundary), offer the
quick mode in one line before starting `grill`. If the user delegated
the decisions and current specifications settle the material questions, skip
the grill interview and design approval. First verify those specifications
against the task and code. Record the delegated authority, specification paths,
and accepted objective, decisions, constraints, and acceptance checks in the
progress file as the `Grill Result`; mark grill `skipped: settled specification
and delegated decisions`. Use that result in later stages. Documentation alone
does not grant authority. If material questions remain, resolve only those
within the delegated scope, asking about decisions outside it.

Select `final-check` before the first stage starts. Select `deepen` after
grill, when the acceptance criteria are known. Select `retro` after deslop.
If the user includes or skips a stage, do what the user says.

- **`elevate`:** Run it only when the user asks for it. Otherwise, skip it
  with the reason `not requested`.
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
  When a run condition and a skip condition both hold, run it.
- **`final-check`:** Run it after implementation by default.
- **`retro`:** Run it when the `Friction` section has at least one entry.
  Skip it with the reason `smooth run` when the section is empty.

A cost inside a budget that the user stated is approved. Do not drop an
acceptance check against the real system or a real model to save cost. If the
check costs more than the budget, ask.

State the selected stages in one line. Give a reason for each skipped stage.

## Quick mode

Use the quick mode when the user asks for it, such as "drive quick", or
asks for feature-dev with the checks and the cleanup but without the
interview. The request must already state what to build. If a material
question about the goal or the scope remains, ask it once, or offer the
full pipeline.

```text
feature-dev → final-check → deslop
```

- When a quick request changes a public contract, persisted schema, or
  security boundary, and the design is not already settled or delegated,
  warn before starting feature-dev that rework will be costly and offer
  `grill` first.
- Set elevate, grill, deepen, and retro to `skipped: quick mode`, and set
  the `deferred ideas` entry to `skipped: quick mode`. If the user includes
  one of these stages, run it as in the full pipeline.
- Feature-dev keeps its design approval. After discovery, and before the
  first edit, write the expected behavior, the non-goals, and the
  acceptance criteria to the progress file. They replace the Grill Result
  in the later stages.
- Run feature-dev, its diff review, final-check, and deslop in this order,
  as the section "Run the stages" describes. Do not combine the diff review
  with final-check. Run each check in a fresh context, as the section "Run
  checks in a fresh context" describes. These checks are the reason for the
  quick mode: do not skip one because the change is small.
- Record friction as usual. A later retro reads it.
- Add the ideas outside the scope to the `Deferred ideas` section, and list
  them in the output. Do not call the `backlog` skill unless the user asks.

## Run the stages

Each stage takes the result of the previous stage as its request. The approval
points of each stage stay in effect. A drive request does not approve them.

1. **Elevate.** The rewritten request changes the scope. Wait for the user to
   approve it. If the user declines, continue with the original request.
2. **Grill.** Unless skipped under the delegated-specification rule, run the
   interview rounds and the final confirmation as the grill skill describes.
   Use the confirmed `Grill Result` as the input for all
   later stages. Glossary and ADR updates from grill are changes of this
   task. If grill changes the goal, tell the user and ask whether to continue
   with the new goal. Run elevate again only when the user asks. If
   the user accepted every recommendation and feature-dev needs a design
   choice, explore first, and then ask for the final confirmation of grill
   and the design choice in one message.
3. **Deepen.** A drive request counts as a request to proceed. Continue with
   the rewritten request without a separate stop. Stop if deepen lists
   blockers. Add each target and external validation from deepen to the
   acceptance criteria. If deepen proposes a different deliverable, stop and
   offer to run elevate with it. If the user accepts, write the new
   deliverable to the progress file. Set the elevate, grill, and deepen
   entries to `reopened: <reason>`, which does not count as a result. Keep the
   start commit. Then run elevate, and run grill again for the decisions that
   the new deliverable changes.
4. **Feature-dev.** Implement the confirmed scope. When a design trigger of
   feature-dev applies, present the architecture approaches with a
   recommendation, as feature-dev describes. When the approaches change a public
   contract, persisted data, or several modules, include a `visual-recap` in
   `Plan` mode. If the Grill Result already selected an approach, use it.
   Otherwise wait for the user's choice, unless the user delegated it or waived
   design approval. A drive request alone does not delegate design decisions.
   Validate against the success criteria in the Grill Result and against the
   deepen validation, if there is one. When the changed code has a runnable
   interface (CLI, HTTP endpoint, UI, or worker) that works in this environment,
   exercise the main path and one key edge case against the real runtime
   yourself before finishing feature-dev, and record the observed result in the
   progress file. Feature-dev ends when each acceptance criterion is met, or is
   not met with evidence and a blocker that feature-dev allows. Before you set
   feature-dev to `done`, write each criterion in the progress file with its
   evidence: the test, the command and its output, or the file and line. A
   criterion with no evidence is not met. Add a new direction that the work
   shows to the deferred ideas. Ask whether to extend the scope only when the
   accepted objective cannot be met without it. Then run the diff review in a
   fresh context, as described below, and set the `feature-dev review` entry to
   `done (<runner>): <N> findings` or `skipped: <reason>`. When the user asks
   for a commit after each group of changes, commit each group as step 1 of the
   `land` skill describes, and review the whole range once before final-check.
5. **Final-check.** Compare the result with the original request, the Grill
   Result, and the acceptance criteria. Report each deepen target as met, not
   met, or not measured. Fix the confirmed gaps in scope, and run the
   affected checks again. Set final-check to `done (<runner>)`.
6. **Deslop.** A drive request approves cleanup of the changes of this task
   only. Give deslop that scope explicitly: the hunks in `git diff
   <start_commit>` and the untracked files that are not ignored, including
   the fixes of final-check. After cleanup, run the affected checks again.
   Offer the `deep` mode of deslop for the touched files when the task
   changes more than about 500 lines, when the diff review flags overgrown
   abstractions in those files, or when past runs recorded friction in the
   same file.

   When the result has a user interface or behavior that the user can try,
   start it in a clean state before the output: no test stubs, patches, or
   stopped servers. Give the user the address and the observable qualities to
   try.
7. **Retro.** Run the `retro` skill in this context, not in a subagent,
   because the friction of the run is in this context. Set the retro entry
   to `done: <N> candidates`.
8. **Deferred ideas.** Offer the collected ideas as the next section
   describes.

## Defer ideas

A finding in the code that this task changes, a step that the result of the
task needs, or the topic that the user discusses now is part of the task,
unless it is a confirmed non-goal. A request that does not name the work
does not make it a non-goal. Do it in the current stage. If it needs a
decision, such as a change of the architecture, ask the user now: do it in
this run, or drop it. Do not defer it, and do not offer to defer it.

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

In the quick mode, do not do the rest of this section. Otherwise, when the
retro entry is `done` or `skipped: <reason>`, give the ideas of the
section to the `add` mode of the `backlog` skill. It asks the user about the
ideas in one batch. Ask it to add the option "do now" only for an idea that
does not change the accepted objective and is not a confirmed non-goal. Do
not add "do now" to the `retro:` ideas. A `retro` idea is a
separate change, so it passes the first condition of the filing bar. If no
ideas are left for the `backlog` skill, do not call it. Write each decision
next to its idea in the progress file. Do not skip the batch because you
guess that the user is away. If the user does not answer, leave the
`deferred ideas` entry `pending`.

If the user delegated the decisions in this run, such as "do everything" or
"decide yourself", do not ask. Decide each idea yourself: "do now" for a small
idea that passes the "do now" conditions, file an idea or debt that passes
the filing bar of its kind, and drop the rest. Give these decisions to the
`add` mode as delegated decisions, so that it writes them without asking.
Report each decision with its reason in the output.

Do not give the `retro-skill:` ideas to the `backlog` skill, because the
skill lives in another repository. Append each of them to the skill feedback
file: the file that the `SKILL_FEEDBACK_FILE` environment variable names, or
else `~/.agents/skill-feedback.md`. Create the file if it does not exist.
Write one line for each idea: the date, the repository, the name of the
skill, the idea, and the moment. Write `sent to feedback file` next to each
idea as its decision. If you cannot write the file, show the ideas in the
output, and write `shown in output` as the decision.

Implement each "do now" idea in this run. Then run final-check again for
the new hunks, or the feature-dev validation if the user skipped
final-check, and then run deslop on them. Run a slow check, such as an
end-to-end suite, only once, after this pass. Mark each step next to the
idea when it ends. Give the ideas that this second pass finds to the `add`
mode without the "do now" option. Record the friction of the second pass, but
do not run retro again. A later retro reads it from the past runs.

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
`CONTRIBUTING.md`, give its path too, and tell the subagent to check the
changes against each rule of the document in turn. Tell it to search the
whole repository, including the documentation, the glossary, and the pages
that explain the process to users, for the old wording of each contract,
term, or behavior that the task changes. Do not give it the conversation. Tell
it to report findings and not to edit files, and to list the findings outside
the scope separately. For a finding about wrong behavior, tell it to give the
input, the expected result, and the actual result. For the feature-dev diff
review, also ask it to flag structural slop: new branches, wrappers, or
workarounds layered onto an abstraction or file that is already overgrown and
should be simplified instead. Put out-of-scope simplification candidates into
`Deferred ideas`.

If the host cannot run subagents, run the checks yourself, and read the
standards document first. When the host can run subagents, a diff review or
a final-check that the writing agent ran itself is not done. If the subagent
fails, set the entry to `skipped: <reason>`.

In the `done` entry of each of these checks, write who ran it as
`<runner>`: `subagent`, or `self` when the host cannot run subagents.

Before you fix a finding, open the code that it cites and confirm it. Confirm
a finding about wrong behavior with a test or a command that fails before the
fix, and keep the test. A reviewer can be wrong about the expected result:
check it against the request, the acceptance criteria, or a direct
computation. If you cannot reproduce the finding, it is not confirmed. Do
not change the code for it, and report it as unconfirmed. Make all fixes
yourself, so that one agent writes the code.

Before you fix the findings of a check, save the state of the task when all
its checks pass, because a later fix can break code that was correct. Save
the working tree to a tree object, without a change to the index:

```bash
tmp=$(mktemp -u) && GIT_INDEX_FILE=$tmp git add -A &&
  GIT_INDEX_FILE=$tmp git write-tree; rm -f "$tmp"
```

Write the ID that it prints in the progress file, below the entry of the
stage, as `green state: <id>`. This line is not a stage entry. If a fix makes
a check fail that passed in the saved state, or a finding comes back after
you fixed it, do not try again. Restore the saved state with `git
restore --source=<id> --worktree -- .`, delete the files that the fixes
added, and run the checks again. Record a friction entry and ask the user.

## Documentation

If the task adds or changes documentation, such as a README, a guide,
`GLOSSARY.md`, or an ADR, write and review that text with the `ste` skill in
clarity mode.

## Output

- A `visual-recap` in `Recap` mode when the task changes a public contract,
  persisted data, several modules, or more than about 200 lines, so the
  reviewer sees the blast radius, risk, and top review hotspots first.
- Each stage that ran or was skipped, with the reason.
- The accepted objective from the Grill Result, or, in the quick mode,
  the acceptance criteria from feature-dev.
- The changes, the files touched, and the key decisions.
- The validation that ran, and the items that remain unverified.
- The path of the progress file.
- The backlog items that this run created, changed, or deleted.
- The `retro-skill:` ideas, if any, and where they went.
- Blockers and follow-ups, if any.
- One next step toward the accepted objective, with its evidence.
- One question: whether to run the `land` skill to commit the changes and
  open a pull request or a merge request, unless the user already said what
  to do with them.
