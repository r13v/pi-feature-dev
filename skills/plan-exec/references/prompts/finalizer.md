# Finalizer worker prompt

Use this prompt after all reviews pass. Replace `DEFAULT_BRANCH`,
`PLAN_FILE_PATH`, `PROGRESS_FILE_PATH`, and `PLAN_EXEC_ROOT` before launch.

```text
Post-completion finalize step. Organize the branch for merge.

Plan file: PLAN_FILE_PATH
Default branch: DEFAULT_BRANCH
Progress file: PROGRESS_FILE_PATH

STEP 1 - REBASE:
- Run `git fetch origin`.
- If `origin/DEFAULT_BRANCH` exists, rebase onto it:
  `git rebase origin/DEFAULT_BRANCH`
- Otherwise, rebase onto the local default branch:
  `git rebase DEFAULT_BRANCH`
- If conflicts occur, resolve them and continue when safe.
- If rebase cannot be completed safely, abort with `git rebase --abort`, report
  the issue, and continue to the report step.

STEP 2 - CLEAN UP COMMITS:
- Inspect commits with `git log --oneline DEFAULT_BRANCH..HEAD`.
- If there are 5 or more commits, squash related fix commits into their parent
  feature commits when this can be done safely.
- Keep meaningful boundaries: feature task commits separate from review-fix
  commits.
- If safe non-interactive cleanup is not practical, leave commits as-is and
  report why.

STEP 3 - VERIFY:
- Run validation commands from the plan file.
- If the plan does not list exact commands, infer the narrowest relevant
  validation commands from the repository.
- If validation fails, fix and re-run when the fix is clearly within scope.

STEP 4 - LOG PROGRESS:
- Append:
  `bash PLAN_EXEC_ROOT/scripts/append-progress.sh PROGRESS_FILE_PATH "finalize: completed"`
- Then pipe details:
  `printf '%s\n' "- rebase: <success/failed/skipped>" "- commits before: <N>, after: <M>" "- squashed: <list or none>" "- validation: <passed/failed>" | bash PLAN_EXEC_ROOT/scripts/append-progress.sh PROGRESS_FILE_PATH`
- Use only `append-progress.sh` for writing to the progress file.

STEP 5 - PLAN DEVIATION ANALYSIS:
- Read PROGRESS_FILE_PATH in full.
- Compare it against PLAN_FILE_PATH.
- Report deviations from the original plan, obstacles or blockers, incomplete
  delivery, cut corners, or review findings that went beyond the original plan.

STEP 6 - REPORT:
Report what was done: number of commits before and after, whether rebase
succeeded, validation results, and plan deviation analysis.

This step is best-effort. If rebase or commit cleanup fails, explain why and
leave the branch in a coherent state.
```
