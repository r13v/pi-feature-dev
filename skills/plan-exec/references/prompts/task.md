# Task worker prompt

Use this prompt when spawning each implementation worker. Replace
`PLAN_FILE_PATH`, `PROGRESS_FILE_PATH`, and `PLAN_EXEC_ROOT` before launch.

```text
Read the plan file at PLAN_FILE_PATH. Find the FIRST Task section
(`### Task N:` or `### Iteration N:`) that has uncompleted checkboxes (`[ ]`).

If a task section has `[ ]` checkboxes you cannot complete because they require
manual testing, deployment verification, credentials, or external systems, mark
them `[x]` with a note like `[x] manual test (skipped - not automatable)` and
continue.

CRITICAL CONSTRAINT: Complete ONE task section per worker run.
A task section is a `### Task N:` or `### Iteration N:` heading with all
checkboxes underneath it. Complete all checkboxes in that section, then stop.
Do not continue to the next section.

STEP 1 - IMPLEMENT:
- Read the plan's Overview, Context, Review Handoff, Development Approach,
  Testing Strategy, and Technical Details sections when present.
- Implement all items in the current task section.
- Write or update tests for the implementation.

STEP 2 - VALIDATE:
- Run the test, lint, typecheck, build, or validation commands specified in the
  plan.
- If the plan does not list exact commands, infer the narrowest relevant
  validation commands from the repository.
- Fix any failures and repeat validation until it passes.

STEP 3 - COMPLETE:
- Edit PLAN_FILE_PATH and change `[ ]` to `[x]` for every checkbox you completed
  in the current task section.
- If all task sections are complete and higher-level success criteria checkboxes
  are now satisfied, mark those `[x]` too.
- Commit all changed files with:
  `bash PLAN_EXEC_ROOT/scripts/stage-and-commit.sh "feat: <brief task description>" file1 file2 ...`
- List every changed file explicitly, including source files, tests, and the plan
  file.

STEP 4 - LOG PROGRESS:
- Append a header:
  `bash PLAN_EXEC_ROOT/scripts/append-progress.sh PROGRESS_FILE_PATH "task N: <title>"`
- Then pipe details:
  `printf '%s\n' "- modified: <files>" "- implemented: <what was done>" "- tests: <what tests were added or why skipped>" "- validation: <what commands passed>" | bash PLAN_EXEC_ROOT/scripts/append-progress.sh PROGRESS_FILE_PATH`
- Use only `append-progress.sh` for writing to the progress file. Do not write to
  the progress file directly.

STOP after committing and logging progress.

If any phase fails after reasonable fix attempts, log the failure to
PROGRESS_FILE_PATH and report what failed.

One task section per run. After commit and progress log, stop.
```
