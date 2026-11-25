---
name: land
description: Take the validated changes of the current task to the default branch. Commit, open a pull or merge request, and get the CI checks green; when the user asks, also merge, check the deploy, and update the ticket. Use when the user asks to commit, open a PR or MR, merge, or land the work. Skip work that is not validated yet.
---

# Land

Do only the steps that the user asked for. Each step writes to a place
outside the working tree, such as the remote, the forge, or the tracker. The
request names the last step: "commit" stops after the commit, "push" stops
after the push, "open an MR" stops when the CI checks are green, "merge"
includes the merge. Do not do a
later step without a request.

Land does not validate the work. If the changes are not validated yet, say
so and offer `final-check` first.

## 1. Commit

- If the project checks did not run after the last change, run them first.
- If the current branch is the default branch, create a branch for the
  task. Keep the name short: some forges reject long branch names.
- Follow the commit conventions that `git log` shows, and the attribution
  rules of the host.
- Do not commit secrets or local settings. Under `drive`, the changes of the
  task are the changes that its section "Changes of the task" defines.
  Otherwise, list the files to commit, and ask when a file is not clearly
  part of the task.
- Push only when the user asks for a push or a later step.

## 2. Pull or merge request

Use the forge CLI, such as `gh` or `glab`, or the tools of the host. In the
description, give what changed and why, the validation that ran, the link to
the ticket, and the risk: a change to a public contract, persisted data, or
security, if the task makes one.

## 3. CI checks

Wait for the checks. Use the watch tool of the host when it has one,
otherwise a wait command of the forge CLI. When a check fails, read its log
and find the cause:

- A cause in the changes of the task: fix it, run the check locally, and
  push a new commit.
- A failure whose log shows no cause in the changes: rerun it once. If it
  passes, report it as flaky.
- A failure that the default branch also has: report it, do not fix it in
  this task, and ask whether to merge with this check red.

After the first push, do not amend and force-push. Push a new commit: a
force-push rewrites the history that reviewers saw, and permission modes
often block it.

## 4. Merge

Merge only when the user asked for it, the checks are green, and the
required approvals exist. Use the merge of the forge. When the forge can
merge after the checks pass, you can use that option.

## 5. Deploy

When the user asked to check the deploy, find how the repository deploys,
such as a CI job or a document. Wait for the deploy. Then show that the
running version is the merged commit, such as from a version endpoint, and
exercise the main path of the changed behavior.

## 6. Ticket

When the user asked to update the ticket, add a comment: what changed, the
link to the request, and how you verified it. Move the ticket to the state
that the user named.

## Output

Give the commits, the link to the request, the state of the checks, the
merge, the evidence of the deploy, and the state of the ticket. For each
step that you did not do, give the reason.
