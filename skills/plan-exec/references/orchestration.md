# Plan execution orchestration

Use this playbook in the main session. It controls workers; it does not authorize
implementation, debugging, or review fixes by the orchestrator.

## Resolve the run

Use a supplied plan path. Otherwise inspect Markdown plans directly under
`docs/plans/`, excluding `completed/`. Use the sole current plan; ask for a choice
only when the target is ambiguous or absent.

Read the plan, including acceptance criteria and required external/manual checks.
Confirm that executable items use `### Task N:` or `### Iteration N:` sections.
Resolve missing requirements before dependent work. Count sections for progress.

Inspect Git status and the index. Establish which existing changes belong to this
run and ensure unrelated work cannot enter task commits. Determine the default
branch with `scripts/detect-branch.sh`; verify that it resolves before using it
as `DEFAULT_BRANCH` in comparisons. Do not rely on its fallback name as evidence.

Use the current non-default branch. On the default branch, use
`scripts/create-branch.sh PLAN_FILE_PATH` if its derived branch name matches host
and project conventions. Otherwise create the feature branch with the required
name through Git. Check for an existing destination branch before switching;
do not silently enter an unrelated branch or detach from the user's work.

Create a unique temporary progress file for this run, for example with `mktemp`,
then initialize it using:

```text
bash PLAN_EXEC_ROOT/scripts/init-progress.sh PROGRESS_FILE_PATH PLAN_FILE_PATH BRANCH_NAME
```

Read [prompts/progress-file.md](prompts/progress-file.md) for log semantics. Share
its absolute path with the user and workers. Append through
`scripts/append-progress.sh`. Use host progress UI if available, otherwise a short
chat checklist. Track tasks and the review/validation work actually needed.

## Execute tasks

For each task, re-read the plan and select the first section with unchecked
items. Announce its outcome briefly and launch one implementation worker using
[prompts/task.md](prompts/task.md). Workers own implementation and plan updates.

After the worker returns, inspect the task's checkbox state, commit, changed-file
summary, and validation evidence. A skipped requirement is still unfinished.
If completion is unsupported, send the discrepancy to a fresh worker; do not
repair it in the orchestrator.

Retry a failed task only when another attempt has a plausible path to progress.
Allow one retry by default (`task_retries=1`). Missing credentials, absent
capabilities, or an unanswered decision are not fixed by relaunching the same
prompt. Log the blocker and report the incomplete task when no progress is
possible. Cap the task loop at 50 launches unless the user configured another
limit; if more work remains, report the limit as an incomplete run.

## Internal review and fixes

After implementation, use [prompts/review.md](prompts/review.md). Start with a
comprehensive review of the actual changes. Select lenses for the change's risks;
there is no required five-worker launch or mandatory sequence of repeated clean
reviews. Reviews remain isolated and read-only.

Collect findings with their evidence and reviewer attribution. Deduplicate exact
duplicates without dropping distinct concerns. Log the findings and pass them to
a fixer using [prompts/fixer.md](prompts/fixer.md). The fixer verifies the premises,
fixes confirmed in-scope issues, and explains false positives or deferred items.
The orchestrator must not silently dismiss or reclassify findings.

After fixes, recheck affected code and requirements with an isolated reviewer.
Use critical mode for correctness/requirement rechecks; include any other lens
whose confirmed issue was changed. Broaden review only when the fix changed the
scope or introduced a new risk. Stop once relevant findings are resolved and
checks pass. If a fixer rejects a finding and makes no changes, resolve any
remaining evidence dispute instead of mechanically repeating the full review.

Default `review_iterations=5` is a ceiling on review/fix cycles, not a target.
If confirmed blockers remain at that limit, log and report incomplete delivery.
Optional suggestions can be recorded as deferred; do not turn them into scope or
claim all findings were fixed. A failed reviewer is an unavailable review, not a
clean result; retry if useful or report the missing required review.

## Finalize and summarize

When reviews are resolved, launch [prompts/finalizer.md](prompts/finalizer.md) by
default (`finalize_enabled=true`). Its normal purpose is to confirm final Git and
validation state. Fetch/rebase/squash only when authorized; skipping optional
history cleanup does not block completion. If finalization changes code, recheck
the affected behavior and review before declaring completion.

If finalization is disabled, verify that worker evidence already covers required
final checks on the current code. Dispatch a worker for any missing required
validation; disabling optional cleanup does not waive acceptance criteria.

Log the actual final state before launching the read-only summary worker with
[prompts/stats.md](prompts/stats.md): `completed`, `incomplete`, or `blocked`, with
remaining checks, findings, and reasons. Include required manual/external checks
outside task sections in that decision.

Deliver a concise report with task progress, review and validation results,
branch, plan, and progress-log paths. If the summary worker fails, use those
known facts directly. Claim branch cleanup only if it occurred. Do not push,
publish, or move the plan unless already authorized.
