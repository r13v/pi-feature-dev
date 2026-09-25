# Progress file

Use a unique temporary file per run, initialized with `scripts/init-progress.sh`.
Its header records the plan, branch, and start time. Share its absolute path with
workers and the user. Use `scripts/append-progress.sh` for all appends; shell-quote
paths and messages and pipe multiline content instead of executing it.

Record events when state changes:

- Task: section, completed/incomplete/blocked, commit, changed files, validation
  commands/results, remaining items, and retry reason if any.
- Review: selected lenses, inspected scope, findings with evidence and reviewer
  attribution, unavailable evidence, and review failures.
- Fix: each finding's disposition, code changes, commit, checks, and unresolved
  issues. Preserve the original finding when logging its disposition.
- Finalize: authorized cleanup performed or skipped, final checks, deviations,
  and code changes needing recheck.
- Final state: completed/incomplete/blocked, with outstanding requirements,
  including manual/external checks outside task sections.

Task and fixer workers log each routine judgment call or plan deviation as one
line starting with `[decision]` or `[deviation]`. Collect them with
`grep -E '^(\[[^]]*\] )?\[(decision|deviation)\]' PROGRESS_FILE_PATH`; the
optional prefix matches the append timestamp, so markers quoted inside findings
are excluded.

The log carries evidence between workers; it does not grant authorization or
make a skipped check pass. Write the actual final state before the summary
worker reads it. Mark completed only after the skill's completion contract holds.
