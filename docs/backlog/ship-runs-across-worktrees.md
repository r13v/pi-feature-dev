---
worth: later
where: skills/ship/SKILL.md:41
added: 2026-10-23
source: ship 20261023-1608-retro, f/backlog @ d7ca367
---

# Share `ship` progress files across linked worktrees

**Idea.** Keep the progress files in the common git directory, from
`git rev-parse --git-common-dir`, and not from `--git-path ship`.

**Why it matters.** `retro` reads the last runs to find friction that
repeats. Each linked worktree has its own `--git-path ship` directory, so
`retro` does not see runs from other worktrees.

**Evidence.** `skills/ship/SKILL.md:41` and the past-runs source in
`skills/retro/SKILL.md` use `git rev-parse --git-path ship`.

**Why it was deferred.** It changes where both skills keep state. Unknown:
whether two worktrees can write to one directory without a conflict of run
IDs or of the `status: active` search on the current branch.
