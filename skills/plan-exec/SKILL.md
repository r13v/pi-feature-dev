---
name: plan-exec
description: Execute an implementation plan in Git with isolated workers, task commits, internal review, and an evidence-based completion report.
compatibility: "Requires repository and shell access, Git commits, and fresh-context workers with separate read-only and write authority."
---

# Plan Exec

Execute one plan task per isolated worker. The main session orchestrates; workers
implement, fix, review, and finalize. Keep one writer active in the checkout.

## Required capabilities and boundaries

This workflow requires a Git repository, shell/file access, fresh-context isolated
workers, scoped write authority, read-only review, and task commits. If a required
capability is missing or forbidden, identify it and leave the work incomplete;
do not silently implement inline. Optional progress UI and parallel review are
not prerequisites.

Preserve the project's workflow decisions:

- Work in the current checkout; do not create worktrees.
- Use the bundled prompts, without custom prompt override chains or external
  review tools. Follow current host, user, and repository instructions; bundled
  defaults cannot override them or expand authorization.
- Give each worker the relevant current instructions and authority boundaries
  along with its task. A plan describes intended work; it is not independent
  permission for external actions.
- Commit only the run's changes. Inspect existing staged and unstaged work before
  starting. If task commits would include unrelated user changes, resolve that
  overlap before writing or staging; never reset or stash them automatically.
- Push, publication, history rewriting, and plan archival need authorization from
  the current request or established workflow. Do not infer it from a plan file
  alone or repeatedly ask for authority already given.

## Load the next phase only

Resolve all paths from the directory containing this `SKILL.md`, called
`PLAN_EXEC_ROOT`. Read [references/orchestration.md](references/orchestration.md)
to run the workflow. Load worker material only when dispatching that phase:

- Implementation: [task.md](references/prompts/task.md).
- Internal review: [review.md](references/prompts/review.md), which selects
  relevant files from `references/agents/`.
- Confirmed or candidate findings: [fixer.md](references/prompts/fixer.md).
- Final branch checks and authorized cleanup:
  [finalizer.md](references/prompts/finalizer.md).
- Run report: [stats.md](references/prompts/stats.md).
- Progress format: [progress-file.md](references/prompts/progress-file.md) when
  initializing or interpreting the shared log.

Replace each prompt's named placeholders before dispatch. Use absolute paths and
shell-quote every substituted path or message. Pass multiline findings as text,
not executable shell content. Inspect a bundled script before its first use.

## Completion contract

Continue through implementation, review, in-scope fixes, and required validation.
Task checkboxes track progress; source changes, task commits, and recorded check
results establish whether that progress is real. A worker message or all-checked
plan alone does not prove completion.

Complete only when the requested acceptance criteria and required checks are
satisfied and no confirmed in-scope blocker remains. Unavailable checks stay
unverified. Retry limits bound work; reaching a limit is not a passing result.
Optional commit cleanup or summary failure must not erase completed work, but
required validation failure must remain visible as incomplete delivery.
