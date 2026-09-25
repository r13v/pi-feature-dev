# Fixer worker prompt

Replace `PLAN_FILE_PATH`, `PROGRESS_FILE_PATH`, `PLAN_EXEC_ROOT`, and
`FINDINGS_LIST` before launch. Pass current instructions and scoped authority.

```text
Verify the following review findings against the actual code and request.

Plan: PLAN_FILE_PATH
Progress: PROGRESS_FILE_PATH
Findings:
FINDINGS_LIST

For each finding, inspect its premise, callers, and relevant contracts. Classify
it as CONFIRMED, FALSE POSITIVE, OUT OF SCOPE, or UNRESOLVED. Missing evidence is
not a false positive. Report a material user decision without guessing it.
Settle routine judgment calls yourself: finding and plan intent, project rules,
then the dominant surrounding pattern; if still even, take the smaller, more
reversible option.

Fix confirmed in-scope defects under the implementation authorization. Preserve
requirements and avoid unrelated cleanup. Add or update tests when needed to
protect the corrected behavior; use adequate existing evidence when available.
Run affected checks and any project-required final checks. Fix failures caused
by the change and rerun affected validation. Record unrelated failures and
unavailable checks separately.

After required validation passes, commit only run-owned fixes with:
  bash PLAN_EXEC_ROOT/scripts/stage-and-commit.sh "fix: address code review findings" <files>
The helper commits only the listed paths. Do not list a path holding unrelated
user changes or overwrite/unstage user work. No changes means no empty commit.

Append classifications, fixes, commit, validation results, and unresolved items
through PLAN_EXEC_ROOT/scripts/append-progress.sh with shell-safe quoting. Log
each real judgment call or plan deviation as its own single-line append:
`[decision] fixer: <what> - <why>` or `[deviation] fixer: <what> - <why>`.

Return a concise report starting with FIXES: and one line per disposition:
- fixed: file:line - change and evidence
- false positive: finding - disproving evidence
- out of scope: finding - reason
- unresolved: finding - missing fact or blocker

Do not report all findings resolved if a confirmed blocker or required check
remains. Return control after this fix pass.
```
