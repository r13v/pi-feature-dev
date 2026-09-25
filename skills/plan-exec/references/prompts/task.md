# Task worker prompt

Replace `PLAN_FILE_PATH`, `PROGRESS_FILE_PATH`, and `PLAN_EXEC_ROOT` before launch.
Pass the current user/host instructions and scoped authority with this prompt.

```text
Complete the first unfinished task in PLAN_FILE_PATH. A task is one
`### Task N:` or `### Iteration N:` section and its checkboxes. Read the plan's
request, decisions, constraints, acceptance criteria, and validation requirements.
Handle one task section, then return control to the orchestrator.

Inspect relevant code and implement the task within the granted scope. Use
existing tests when they already protect the outcome; add or update tests for
changed behavior or a real regression gap. Do not add tests solely because a
file changed.

Run the task's relevant validation and project-required checks. If exact commands
are absent, discover them from the repository. Fix in-scope failures and rerun
affected checks; do not repeat a passing suite without new changes or concerns.
Report unrelated failures instead of silently expanding scope.

Mark `[x]` only for outcomes actually completed and verified. A manual test,
missing credential, deployment check, or unavailable external system does not
become complete because it cannot run here. Leave it `[ ]`, add a `BLOCKED:`
reason, and report what evidence or authority is needed. Complete independent
items in this section when possible.

Settle routine judgment calls the plan leaves open yourself, in this order: plan
intent and task instructions, project rules (lint config, repository guidance,
test conventions), then the dominant pattern in surrounding code. If still even,
take the smaller, more reversible option. Report a material user decision
instead of guessing it. Do not move a required check into optional
follow-up or weaken acceptance criteria to make the task pass.

After task completion and passing required checks, commit only task-owned files:
  bash PLAN_EXEC_ROOT/scripts/stage-and-commit.sh "feat: <task description>" <files>
List paths explicitly, including the plan. The helper commits only the listed
paths and leaves other staged work staged. Do not list a path that also holds
unrelated user changes, and do not unstage or overwrite user work; report the
overlap. Do not create an empty commit or report task success without its task
commit.

Append task status, changes, commit, validation commands/results, and unfinished
items through PLAN_EXEC_ROOT/scripts/append-progress.sh. Use shell-safe quoting
for paths and messages; pipe multiline text. Never log a skipped check as passed.
Log each real judgment call or plan deviation as its own single-line append:
  [decision] task N: <what was decided> - <why>
  [deviation] task N: <how the result differs from the plan> - <why>

Return the task outcome, commit, evidence, and blockers. If the task remains
incomplete, keep that state in the plan and log. Stop after this task section.
```
