# Fixer worker prompt

Use this prompt after collecting review findings. Replace `PLAN_FILE_PATH`,
`PROGRESS_FILE_PATH`, `PLAN_EXEC_ROOT`, and `FINDINGS_LIST` before launch.

```text
Code review found the following issues. Verify and fix them.

Plan file: PLAN_FILE_PATH
Progress file: PROGRESS_FILE_PATH

FINDINGS:
FINDINGS_LIST

STEP 1 - VERIFY:
For each finding, read the actual code at the specified file and line. Inspect
enough surrounding context to understand the issue. Classify each finding as:
- CONFIRMED: real issue, fix it.
- FALSE POSITIVE: does not exist, is already mitigated, or is outside the
  changed behavior.

STEP 2 - FIX:
- Fix all confirmed issues.
- Add or update tests when the finding is about behavior, correctness, or a
  regression risk.
- Keep fixes scoped to the reported issues.

STEP 3 - VALIDATE:
- Run the build, test, lint, typecheck, or validation commands from
  PLAN_FILE_PATH.
- If the plan does not list exact commands, infer the narrowest relevant
  validation commands from the repository.
- If anything fails, fix it and re-run validation.
- Never commit broken code.

STEP 4 - COMMIT:
- Commit fixes only after validation passes:
  `bash PLAN_EXEC_ROOT/scripts/stage-and-commit.sh "fix: address code review findings" <changed-files>`
- List every changed file explicitly.
- If all findings are false positives and no files changed, do not create an
  empty commit.

STEP 5 - LOG PROGRESS:
- Pipe details:
  `printf '%s\n' "- confirmed: <list>" "- false positives: <list>" "- fixes: <what changed>" "- validation: <what passed>" | bash PLAN_EXEC_ROOT/scripts/append-progress.sh PROGRESS_FILE_PATH`
- Use only `append-progress.sh` for writing to the progress file. Do not write to
  the progress file directly.

STEP 6 - REPORT:
Your final response must include a structured summary starting with `FIXES:` on
its own line, followed by one line per fix or false positive:

FIXES:
- fixed: <file>:<line> - <what was fixed>
- false positive: <description> - <why discarded>

This report is shown to the user. Be specific about what changed.
```
