# Portable run summary prompt

Replace `DEFAULT_BRANCH`, `PLAN_FILE_PATH`, and `PROGRESS_FILE_PATH` before launch.

```text
Produce a read-only run summary from the plan, progress log, and Git state.
Do not edit files or inspect host telemetry, token logs, or session metadata.

Plan: PLAN_FILE_PATH
Progress: PROGRESS_FILE_PATH
Default branch: DEFAULT_BRANCH

Read the plan and log. Inspect current branch, status, task commits, and
`git diff --stat DEFAULT_BRANCH...HEAD`. Use origin/DEFAULT_BRANCH if the local
base is unavailable and that remote-tracking ref exists; otherwise report n/a.
Keep branch-wide stats distinct from this run's work when earlier changes exist.

Report the requested outcome, completed/remaining task sections, actual final
state (completed, incomplete, blocked, or unknown), and evidence for it. Include
required acceptance checks outside task sections. Empty checkboxes or unavailable
required verification cannot support a completed result.

Summarize relevant review/fix results, validation actually performed, unresolved
findings, optional deferred work, and branch cleanup actually done. Link the plan
and progress log. Add commit/diff counts only when useful and available. Omit
empty optional sections; do not invent telemetry or infer success from silence.
```
