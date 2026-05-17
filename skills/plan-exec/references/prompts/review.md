# Internal review playbook

This file is a playbook for the main orchestrator session, not a worker prompt.
Replace `DEFAULT_BRANCH`, `PLAN_FILE_PATH`, `PROGRESS_FILE_PATH`,
`PLAN_EXEC_ROOT`, and `REVIEW_PHASE`, then follow the instructions from the main
session.

All review work must be done by isolated read-only workers. If the host supports
parallel isolated workers, launch all workers for the phase together. If parallel
launch is unavailable, run the workers sequentially. Do not review or fix issues
in the orchestrator session.

Each review worker prompt must start with this preamble:

```text
CRITICAL: You are a READ-ONLY reviewer. Do not run git stash, git checkout, git
reset, git commit, or any command that modifies the working tree. Other workers
may run in parallel. Only use read-only commands such as git diff, git log, git
show, and file reads.

Run `git diff DEFAULT_BRANCH...HEAD` to see the full branch diff. Read the
actual source files for context; do not review from the diff alone.

The plan file at PLAN_FILE_PATH describes the goal and requirements.
The progress file at PROGRESS_FILE_PATH describes previous task and fix work.
Re-evaluate findings independently. Previous fixes may be incomplete.

Tag every finding with severity:
- CRITICAL: crash, data loss, security vulnerability, race condition, or broken
  core behavior.
- MAJOR: real correctness issue, missing critical error handling, broken
  contract, or incomplete requirement.
- MINOR: style, documentation drift, convention mismatch, simplification, or
  optional improvement.

Format each finding on its own line:
`SEVERITY: file:line - description`

Report problems only. If you find no issues, report exactly:
`NO ISSUES FOUND`
```

## Comprehensive Mode

Used when `REVIEW_PHASE` is `comprehensive`.

Launch five read-only workers using these bundled reviewer files:

- `PLAN_EXEC_ROOT/references/agents/quality.txt`
- `PLAN_EXEC_ROOT/references/agents/implementation.txt`
- `PLAN_EXEC_ROOT/references/agents/testing.txt`
- `PLAN_EXEC_ROOT/references/agents/simplification.txt`
- `PLAN_EXEC_ROOT/references/agents/documentation.txt`

For each worker, prepend the read-only preamble above to the corresponding
reviewer file content.

After all workers return, produce a strict finding report:

- Group findings by severity in this order: `CRITICAL`, `MAJOR`, `MINOR`.
- Use a heading per severity: `### CRITICAL`, `### MAJOR`, `### MINOR`.
- Skip severity headings with zero findings.
- Under each heading, use exactly:
  `- <reviewer-name>: <file:line> - <description>`
- Preserve reviewer attribution: `quality`, `implementation`, `testing`,
  `simplification`, or `documentation`.
- If two reviewers report the same file, line, and issue, merge into one bullet
  and join reviewer names with `+`.
- Do not verify, fix, dismiss, or rewrite findings.
- Omit reviewers that found nothing.
- After the bullet list, emit:
  `Total: <N> findings (<C> critical, <M> major, <m> minor)`

If all workers report `NO ISSUES FOUND`, emit exactly:

```text
Comprehensive review: clean - no findings.
```

## Critical-Only Mode

Used when `REVIEW_PHASE` is `critical`.

Launch two read-only workers using these bundled reviewer files:

- `PLAN_EXEC_ROOT/references/agents/quality.txt`
- `PLAN_EXEC_ROOT/references/agents/implementation.txt`

For each worker, prepend the read-only preamble above plus this additional
instruction:

```text
Report only CRITICAL and MAJOR issues. Ignore MINOR findings, style concerns,
optional improvements, documentation nits, and simplification opportunities.
```

After both workers return, produce the same strict finding report as
comprehensive mode, but include only `CRITICAL` and `MAJOR` sections.

If neither worker reports critical or major findings, emit exactly:

```text
Critical review: clean - no critical/major findings.
```
