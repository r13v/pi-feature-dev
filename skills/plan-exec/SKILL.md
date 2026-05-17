---
name: plan-exec
description: Execute implementation plan files task by task with isolated workers, task commits, internal reviews, finalize, and a portable run summary.
compatibility: "Portable across coding assistant environments that support fresh-context isolated workers, repository file access, shell commands, and Git commits. If isolated workers are unavailable, stop instead of running inline."
---

# Plan Exec

Execute a plan file one task section at a time. The main session is the
orchestrator. Implementation, fixing, finalization, and summary work happens in
fresh-context isolated workers.

This skill is agent-agnostic, but not lowest-common-denominator. It requires a
host agent that can launch isolated workers with repository access.

## Required Capabilities

Before starting, verify that the current host agent supports all required
capabilities:

- Read and edit files in the repository.
- Run shell commands in the repository.
- Launch fresh-context isolated workers.
- Give implementation and fixer workers write authority.
- Give review and summary workers read-only authority.
- Commit selected files with Git.

If any required capability is missing, stop and explain which capability is not
available. Do not perform implementation work in the main orchestrating session.

## Compatibility Boundaries

- Git only. Stop if the current directory is not inside a Git repository.
- In-place execution only. Do not create Git worktrees.
- No prompt overrides. Always use the bundled prompt and reviewer files shipped
  inside this skill.
- No custom rules loading. Follow the host agent, user, and repository
  instructions that are already in effect.
- No external review tools. All reviews are performed by isolated workers in the
  current host agent.
- Do not push, open pull requests, or move the plan file unless the plan itself
  explicitly requires it.

## Arguments

- Optional plan path. If omitted, choose from `docs/plans/`.

## Bundled Files

Set `PLAN_EXEC_ROOT` to the absolute path of the directory containing this
`SKILL.md`. Read bundled files directly from:

- `PLAN_EXEC_ROOT/references/prompts/task.md`
- `PLAN_EXEC_ROOT/references/prompts/review.md`
- `PLAN_EXEC_ROOT/references/prompts/fixer.md`
- `PLAN_EXEC_ROOT/references/prompts/finalizer.md`
- `PLAN_EXEC_ROOT/references/prompts/stats.md`
- `PLAN_EXEC_ROOT/references/agents/*.txt`
- `PLAN_EXEC_ROOT/scripts/*.sh`

After reading a bundled prompt, replace all placeholders before passing it to a
worker:

- `PLAN_FILE_PATH`
- `PROGRESS_FILE_PATH`
- `DEFAULT_BRANCH`
- `PLAN_EXEC_ROOT`
- `FINDINGS_LIST` when using the fixer prompt
- `REVIEW_PHASE` when using the review playbook

## Process

### Step 1. Resolve Plan File

If a plan path was provided, use it. Otherwise, list markdown files in
`docs/plans/`, excluding `docs/plans/completed/`.

- If exactly one plan is found, use it.
- If multiple plans are found, ask the user to choose one.
- If no plan is found, stop and ask for a plan path.

Read the plan file. Count all `### Task N:` and `### Iteration N:` sections so
the run has a visible scope.

Determine the default branch:

```bash
bash PLAN_EXEC_ROOT/scripts/detect-branch.sh
```

Capture the result as `DEFAULT_BRANCH`.

### Step 2. Create Or Update Progress Tracking

Use any host-provided task/progress UI when available. Otherwise keep a concise
checklist in chat. Track one item per plan task plus these fixed phases:

- Review phase 1: comprehensive and critical re-checks
- Review phase 2: code smells
- Review phase 3: critical only
- Finalize
- Run summary

### Step 3. Create Or Reuse Feature Branch

Run in the current checkout only. Do not create or enter a worktree.

Create a feature branch when currently on the default branch, or keep using the
current branch when already on a non-default branch:

```bash
bash PLAN_EXEC_ROOT/scripts/create-branch.sh PLAN_FILE_PATH
```

The script derives a branch name from the plan filename by stripping a leading
date prefix. Capture the branch name it prints.

### Step 4. Initialize Progress File

Create a progress file in `/tmp` using the plan filename stem, for example
`/tmp/progress-fix-issues.txt`:

```bash
bash PLAN_EXEC_ROOT/scripts/init-progress.sh /tmp/progress-<plan-name>.txt PLAN_FILE_PATH <branch-name>
```

Report the full progress file path to the user.

After initialization, append only through:

```bash
bash PLAN_EXEC_ROOT/scripts/append-progress.sh PROGRESS_FILE_PATH "message"
```

or by piping multiline content into that script.

### Step 5. Task Loop

Repeat until no unchecked checkboxes remain in any `### Task N:` or
`### Iteration N:` section.

1. Re-read the plan file. Workers may have modified it.
2. Find the first task or iteration section containing `[ ]`.
3. If no such section exists, continue to review phase 1.
4. Announce the task to the user before launching the worker:

   ```text
   --- Task N: <title> ---
   - [ ] <unchecked item>
   - [ ] <unchecked item>
   ```

5. Spawn one isolated implementation worker with the bundled `task.md` prompt.
   Substitute `PLAN_FILE_PATH`, `PROGRESS_FILE_PATH`, and `PLAN_EXEC_ROOT`.
6. After the worker returns, re-read the plan file and verify that the task
   section has no remaining `[ ]` items.
7. If the task is complete, report `Task N completed` and continue.
8. If the task still has unchecked items, retry with a fresh isolated worker up
   to `task_retries` times. Default `task_retries` is `1` if the host or user did
   not configure it.
9. If all retries fail, stop and report the failure.

The only success signal is the plan file state. Do not rely on the worker's
final message alone.

Orchestrator constraints:

- Do not implement code yourself.
- Do not debug or fix worker failures yourself.
- If a worker leaves compiler errors, test failures, or incomplete checkboxes,
  retry with a fresh worker and include the failure details in the prompt.
- Do not modify the plan file yourself; implementation workers own plan
  checkbox updates.

Maximum task loop iterations: 50. If reached, stop and report the safety limit.

### Step 6. Review Phase 1 - Comprehensive Then Critical Re-Checks

Report:

```text
--- Review phase 1: comprehensive ---
```

Loop up to `review_iterations` times. Default `review_iterations` is `5` if the
host or user did not configure it.

For iteration 1, use `REVIEW_PHASE=comprehensive` in the bundled `review.md`
playbook. It launches five read-only review workers:

- quality
- implementation
- testing
- simplification
- documentation

For iteration 2 and later, report:

```text
--- Review phase 1: critical re-check (iteration N) ---
```

Use `REVIEW_PHASE=critical`. It launches two read-only review workers:

- quality
- implementation

Parallel review workers are preferred when the host supports parallel isolated
workers. If parallel launch is unavailable, run the review workers sequentially,
but they must still be isolated read-only workers.

Collect the complete output from all review workers. Do not summarize, filter,
verify, dismiss, or reclassify findings. Log the collected findings to the
progress file, then pass the full unedited finding list to a fixer worker using
the bundled `fixer.md` prompt.

If all review workers report no issues, report `Review phase 1: clean` and move
to review phase 2.

After the fixer returns, show its `FIXES:` section to the user, report
`Review phase 1: iteration N fixes applied`, and loop back for a re-check.

If `review_iterations` is reached with issues still found, report
`Review phase 1: max iterations reached, moving on` and continue.

### Step 7. Review Phase 2 - Code Smells

Report:

```text
--- Review phase 2: code smells analysis ---
```

Run one read-only isolated worker with
`PLAN_EXEC_ROOT/references/agents/smells.txt`.

The smells worker must inspect the diff against `DEFAULT_BRANCH`, read changed
files for context, and report only problems.

If no issues are found, report `Smells analysis: clean` and continue.

If issues are found, log the full output to the progress file and launch a fixer
worker with the bundled `fixer.md` prompt. Pass the full smells output as
`FINDINGS_LIST`. Show the fixer's `FIXES:` section when it returns.

### Step 8. Review Phase 3 - Critical Only

Report:

```text
--- Review phase 3: critical/major only ---
```

Use the bundled `review.md` playbook with `REVIEW_PHASE=critical` for one final
single pass. Launch the quality and implementation read-only workers. Pass any
critical or major findings to a fixer worker. Ignore minor findings in this
phase.

If neither worker reports critical or major findings, report
`Review phase 3: clean`.

### Step 9. Finalize

Check `finalize_enabled`. Default is `true` if the host or user did not
configure it. If false, skip this step.

Report:

```text
--- Finalize: rebase and clean up commits ---
```

Spawn one isolated finalizer worker with the bundled `finalizer.md` prompt.
Substitute `DEFAULT_BRANCH`, `PLAN_FILE_PATH`, `PROGRESS_FILE_PATH`, and
`PLAN_EXEC_ROOT`.

Finalize is best-effort. If rebase or commit cleanup fails, the finalizer must
leave the branch in a coherent state and report the issue. Do not block the run
only because commit cleanup was not possible.

### Step 10. Portable Run Summary

Spawn one read-only isolated summary worker with the bundled `stats.md` prompt.
Substitute `DEFAULT_BRANCH`, `PLAN_FILE_PATH`, and `PROGRESS_FILE_PATH`.

The summary worker reads only the plan file, progress file, and Git state. It
must not read host-specific telemetry logs or token accounting files.

Show the summary worker's full markdown output to the user.

If the summary worker fails, report the failure but do not block completion.

### Step 11. Completion

Append completion to the progress file:

```bash
bash PLAN_EXEC_ROOT/scripts/append-progress.sh PROGRESS_FILE_PATH "completed"
```

Report:

```text
All N tasks completed, reviews passed, branch finalized
```

Do not push, create a pull request, or move the plan file unless the user or the
plan explicitly asked for that.

## Key Rules

- The main session is the orchestrator.
- Isolated workers do implementation, fixes, finalization, reviews, and summary.
- Each implementation worker handles exactly one task section.
- Each implementation or fixer worker must commit its own changes before
  reporting success.
- The plan file is the source of truth for task completion.
- The progress file carries context between phases.
- Review findings are passed in full to fixer workers.
- All prompts come from the bundled prompt set.
- Git worktrees, prompt overrides, custom rules loading, Mercurial support, and
  external review tools are out of scope.
