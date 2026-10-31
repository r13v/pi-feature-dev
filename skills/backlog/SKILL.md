---
name: backlog
description: Keep deferred ideas as files under `docs/backlog/` and bring them back with their context. List, add, brief, or walk the items. Use when the user asks to defer an idea, to add to the backlog, or to check or clean up the backlog, or when a task found real ideas outside its scope; skip nits that can be fixed now.
---

# Backlog

A backlog item is a deferred idea with its reason and evidence. It is an
option to return to, not a commitment to do the work. Reading the backlog does
not give permission to work an item. Do not commit, push, or post items to a
pull request or an issue unless the user asks.

The backlog needs a git repository, because git history keeps the items that
were done or dropped. Outside a git repository, tell the user and stop.

## Item format

Keep one file for each item: `docs/backlog/<slug>.md` at the repository root.
The slug names the idea, not a file, such as `export-ignores-time-zone.md`.

```markdown
---
worth: later
where: src/export/csv.ts:42
added: 2026-10-23
source: ship 20261023-1500-add-export, f/export @ 01c9a47
---

# Export ignores the time zone of the account

**Idea.** What to change, in one or two sentences.

**Why it matters.** Who gets which result, and what happens without it.

**Evidence.** Places in the code, commands and their output, observations.

**Why it was deferred.** Why the source task did not do it, and what is
still unknown.
```

- `worth`:
  - `yes`: the value is agreed. This does not set a schedule.
  - `later`: the value is not clear yet. The body names the unknown.
  - `no`: a decision not to do it, with the reason in the body. Keep it so
    that the same idea is not argued again.
- `where`: optional `path:line`. It is a hint, because lines move.
- `added`: the date when the item was added. Do not change it.
- `source`: the task that found the idea, the branch, and the short commit.

Write the body for a reader who does not know the source task.

A file that exists is an open item. When the idea is done, delete the file in
the change that does it. When the idea is dropped, delete the file. Do not add
a status field, an archive, or an index file.

An item is stale when the claim in its evidence is no longer true in the
current code. A moved line does not make an item stale. Update its `where`.

Change an existing item only to add evidence, to update `where`, to change
`worth`, or to delete it. Do not rewrite other text in it.

## Filing bar

File an idea only when both of these are true:

- it is worth its own `ship` run or a separate change;
- it has concrete evidence: a place in the code, a command, or an observation.

Fix a nit, such as a typo, a name, or a style point, in the current scope, or
drop it. Do not file it.

## Modes

Choose the mode from the argument:

- no argument: list;
- the slug or the path of an existing item: brief;
- `--all`: walk;
- any other text, or ideas from another skill: add.

A single token of lowercase words joined by hyphens that matches no item is a
mistyped slug, not an idea. Say so and list the items. Do not add it.

### List

Use this mode when there is no argument. Read all items. For each item with
`where`, check that the place exists and still shows what the item claims.
Report a stale item as stale, not as work.

Sort the items by `worth`: `yes`, `later`, `no`. Put the oldest first in each
group. Show one line for each item: the slug, `worth`, the age, and the
title. Mark each `later` item older than 90 days with "decide: keep or drop".
Then offer to brief an item, to walk all items, or to add an idea.

### Brief

Use this mode for `<slug>`. Read the item and check its evidence against the
current code. Give four lines, each with a word and the fact behind it:

- summary;
- effort;
- blast radius;
- why now, or why not now.

If the item is stale, say so. Then ask the user to choose: start `ship` from
the item, change `worth`, drop the item, or keep it as it is.

### Walk

Use this mode for `--all`. First find the links between items: an item that
blocks another, and items that repeat each other. Ask about these first. For
a blocker outside the backlog, recommend to keep the item and name the
blocker. Do not record the links in the items. Then brief one item at a time
and say "item N of M". Read the item again before you act on an answer.

### Add

Use this mode for one or more ideas from the user or from another skill.

1. Apply the filing bar. Name each idea that fails it, and give the reason.
2. Find repeats. Search `docs/backlog/` by the slug, the `where` path, and
   the claim of the idea. A shared `where` path alone does not make a
   repeat: compare the claims. Skip the item that the calling task works on.
   If an item already covers the idea, propose to add the new evidence to
   that item. Do not create a second file.
3. Show all remaining ideas in one batch. For each idea, give the title, the
   proposed `worth`, and one line about why it matters. For a repeat, name
   the existing item. Ask the user to choose for each idea: file it, or add
   the evidence to the existing item, or drop it. The user can also change
   `worth`. A calling skill can add its own option, such as "do now" in
   `ship`. Give the ideas with that option back to the calling skill. Write
   only what the user approved. When the calling skill passes decisions that
   the user delegated to it, apply them without asking.
4. Choose where to write:
   - When another skill, such as `ship`, calls this mode, write in the
     current working tree. The items become changes of that task.
   - Otherwise, find the default branch from `git symbolic-ref
     refs/remotes/origin/HEAD`, or use `origin/main` or `origin/master`
     before a local branch of the same name. If the current
     branch is not the default branch, ask the user before you write: write
     on this branch, or stop so that the user can switch.
   - Do not create a branch or a worktree.
5. Report the files that you created or changed.
