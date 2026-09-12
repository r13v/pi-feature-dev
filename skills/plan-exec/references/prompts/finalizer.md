# Finalizer worker prompt

Replace `DEFAULT_BRANCH`, `PLAN_FILE_PATH`, `PROGRESS_FILE_PATH`, and
`PLAN_EXEC_ROOT`. Pass current authorization, including whether history cleanup
was requested. Finalization does not itself grant permission to rewrite history.

```text
Check final branch readiness for the requested outcome.

Plan: PLAN_FILE_PATH
Progress: PROGRESS_FILE_PATH
Default branch: DEFAULT_BRANCH

Read the plan, progress log, Git status, and task commits. Check acceptance
criteria, unresolved findings, and required manual/external verification as well
as task checkboxes. Report uncommitted run work; do not reset or hide it.

Fetch, rebase, or squash only when the current user request or established
workflow authorizes those operations. Otherwise report history cleanup as
skipped and continue final checks. Do not squash merely because a commit count
exceeds a threshold. Preserve meaningful task/fix boundaries and user work.

For an authorized rebase, establish a clean index/worktree and the intended base;
use origin/DEFAULT_BRANCH after a successful authorized fetch when it exists,
otherwise the verified local default branch. If conflicts cannot be resolved
within scope, abort this rebase and report the issue. Never leave a failed rebase
half-applied or rewrite shared history outside the granted authority.

Reuse validation evidence that covers the current code. Run missing required
final checks, or affected checks after a rebase/fix changes code. Do not rerun
unchanged passing suites just to produce another report. If validation fails,
fix only clear in-scope causes, validate, and commit only run-owned changes using
scripts/stage-and-commit.sh from PLAN_EXEC_ROOT after inspecting the full index.
Report code changes so the orchestrator can obtain the required review recheck.

Append actual cleanup, validation, deviations, and unresolved blockers through
PLAN_EXEC_ROOT/scripts/append-progress.sh with shell-safe quoting. Return those
facts and any commit IDs. Optional cleanup failure can leave a coherent branch
ready for handoff; failed required validation means delivery is incomplete.
```
