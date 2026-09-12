# Internal review playbook

Use this in the main session. Substitute `DEFAULT_BRANCH`, `PLAN_FILE_PATH`,
`PROGRESS_FILE_PATH`, `PLAN_EXEC_ROOT`, and `REVIEW_PHASE` in the relevant text.
Reviews use fresh-context read-only workers. Choose the smallest set of workers
that covers independent risks; combine related lenses in one worker for a
bounded change. Parallelize only when supported and permitted.

## Worker preamble

```text
You are a read-only reviewer. Do not change files, Git state, or the plan. Other
workers may share the checkout. Use diff, log, show, status, and file reads; do
not run checks that write repository-owned content.

Read the goal and constraints in PLAN_FILE_PATH. Inspect
`git diff DEFAULT_BRANCH...HEAD`, plus status, staged, unstaged, and relevant
untracked changes so unfinished work cannot disappear from review. Read changed
source and relevant callers/tests for context. Use PROGRESS_FILE_PATH to locate
validation evidence, not to accept earlier conclusions without verification.

Report only evidence-backed issues in the requested change. Identify the
trigger, causal mechanism, consequence, and file:line evidence. Try to disprove
each candidate before reporting it. Do not fill a category or finding quota.

Use CRITICAL for security, data loss, or broken core behavior; MAJOR for other
blocking correctness, contract, or requirement gaps; MINOR for a demonstrated
nonblocking documentation, convention, or maintainability issue. Optional taste
preferences are not defects.

Format findings as:
SEVERITY: file:line - trigger, consequence, evidence, and smallest fix

If no issues are found, say NO ISSUES FOUND. If required evidence is unavailable,
report that limitation instead of treating missing evidence as a clean review.
```

## Select lenses

For `REVIEW_PHASE=comprehensive`, cover correctness and requirement fulfillment
using [quality.txt](../agents/quality.txt) and
[implementation.txt](../agents/implementation.txt). Add only relevant lenses:

- [testing.txt](../agents/testing.txt): changed behavior or a validation gap.
- [simplification.txt](../agents/simplification.txt): added structural complexity.
- [documentation.txt](../agents/documentation.txt): changes to documented usage,
  contracts, configuration, or contributor workflows.
- [smells.txt](../agents/smells.txt): convention drift in the affected code.

Read only the selected files and append them to the worker preamble. The lenses
are review questions, not a requirement to find an issue or launch one worker
per file.

For `REVIEW_PHASE=critical`, use quality and implementation lenses for remaining
CRITICAL/MAJOR risks. For a fix recheck, name the changed area and original issue;
include another lens if needed to verify that fix. Broaden only if the fix
introduced a new risk.

## Collect and hand off

Group findings by severity, omit empty categories, and preserve attribution and
evidence. Merge exact duplicates, retaining reviewer names. Do not silently
verify away, dismiss, or reclassify worker findings in the orchestrator.

Log the report and pass candidates to the fixer for verification. If all selected
reviews completed with no issues, report the reviewed scope as clean. Track
failed or unavailable review separately. Another review is needed for changed
code or unresolved evidence, not merely because a prior pass finished.
