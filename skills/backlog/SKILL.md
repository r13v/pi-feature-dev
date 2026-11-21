---
name: backlog
description: Keep deferred ideas and technical debt in the issue tracker of the project or as files under `docs/backlog/`, and bring them back with their context. List, add, brief, or walk the items. Use when the user asks to defer an idea, to add to the backlog, or to check or clean up the backlog, or when a task found real ideas outside its scope; skip nits that can be fixed now and work that belongs to the current task.
---

# Backlog

A backlog item is deferred work with its reason and evidence. It is an
option to return to, not a commitment to do the work. An item is one of two
kinds. Do not mix them:

- `idea`: value that does not exist yet, such as a feature, an improvement,
  or an experiment.
- `debt`: a known shortcut in the existing code. It has a place in the code
  and an interest: what it breaks or slows now.

If the work makes something that already exists safer, faster, or simpler,
it is `debt`. If it adds what nobody can do today, it is an `idea`.

Reading the backlog does not give permission to work an item. Do not
commit, push, or post items to a pull request unless the user asks. When the
user asks to commit items outside a `ship` run, commit only the item files.
If other changes are already staged, report them and do not commit.

## Storage

The host instructions of the project, such as `AGENTS.md`, choose where the
items live:

- When they name an issue tracker and a project for the backlog, an item is
  a ticket there. Mark `debt` as the instructions say, such as with a tag or
  a type. Use the access to the tracker that the host gives, such as a tool,
  a CLI, or an API. If you cannot reach the tracker, tell the user and stop.
  Do not write files instead.
- Otherwise, an item is a file under `docs/backlog/`. This needs a git
  repository, because git history keeps the items that were done or
  dropped. Outside a git repository, tell the user and stop.

A ticket posts to a service outside the repository. Ask the user before you
create, change, or close a ticket, also when another skill passes decisions
that the user delegated to it.

## Item format

Keep one file for each item: `docs/backlog/<slug>.md` at the repository root.
The slug names the idea, not a file, such as `export-ignores-time-zone.md`.
A ticket has the same title and body. Put the fields of the front matter
where the instructions say, or else at the top of the body. A ticket has no
`added`, because the tracker keeps the date.

```markdown
---
kind: idea
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

A `debt` item adds this section after **Why it matters**:

```markdown
**Interest.** What the shortcut breaks or slows now, for whom, and how
often, with the evidence.
```

The title names the problem or the missing value, not the fix: "Export
ignores the time zone", not "Convert dates to the account time zone".

- `kind`: `idea` or `debt`. An item without `kind` is an `idea`.
- `worth`:
  - `yes`: the value is agreed. This does not set a schedule.
  - `later`: the value is not clear yet. The body names the unknown.
  - `no`: a decision not to do it, with the reason in the body. Keep it so
    that the same idea is not argued again.
- `where`: `path` or `path:line`, required for `debt`, optional for `idea`.
  It is a hint, because lines move.
- `added`: the date when the item was added. Do not change it.
- `source`: the task that found the idea, the branch, and the short commit.

Write the body for a reader who does not know the source task.

A file that exists, or an open ticket, is an open item. When the idea is
done, delete the file in the change that does it, or close the ticket. When
the idea is dropped, delete the file, or close the ticket with the reason. Do
not add a status field, an archive, or an index file.

An item is stale when the claim in its evidence is no longer true in the
current code. A moved line does not make an item stale. Update its `where`.

Change an existing item only to add evidence, to update `where`, to change
`worth` or `kind`, or to delete it. Do not rewrite other text in it.

## Filing bar

Do not file work that belongs to the current task: a problem in the code that
the task changes, a step that its result needs, or the topic that the user
discusses now. Do it in the task. If it needs a decision, such as a change of
the architecture, ask now: do it in this task, or drop it. Do not offer to
defer it as a third option. A large size or a new design is not a reason to
defer. Defer only what the user excluded in words. A task description that
does not name the work does not exclude it.

File an `idea` only when both of these are true:

- it is worth its own `ship` run or a separate change;
- it has concrete evidence: a place in the code, a command, or an observation.

File a `debt` only when all of these are true:

- the code exists, and `where` points to the shortcut;
- the interest is concrete: a failure, a slowdown, a manual step, or a risk
  that the evidence shows now;
- it is worth a separate change.

An interest that is only a guess fails the bar. Debt with no interest is not
debt. Fix it now or drop it. Wrong behavior that nobody chose is a bug, not
debt: fix it in scope, or file it as an `idea`. Fix a nit, such as a typo, a
name, or a style point, in the current scope, or drop it. Do not file it.

## Modes

Choose the mode from the argument:

- no argument: list;
- the slug or the path of an existing item: brief;
- `--all`: walk;
- any other text, or ideas from another skill: add.

A single token of lowercase words joined by hyphens that matches no item is a
mistyped slug, not an idea. Say so and list the items. Do not add it.

### List

Use this mode when there is no argument. Read all items. When the items are
files and `docs/backlog/` does not exist, say so and do not create it. For each
item with `where`, check that the place exists and still shows what the item
claims.
Report a stale item as stale, not as work.

Show the `debt` items first, then the `idea` items. In each kind, sort by
`worth`: `yes`, `later`, `no`, and put the oldest first. Show one line for
each item: the slug, `worth`, the age, and the title. Mark each `later` item
older than 90 days with "decide: keep or drop".

Then check that the debt is paid. Find the `debt` items closed in the last
28 days: the tickets closed in that time, or the files that `git log
--since=28.days --diff-filter=D -- docs/backlog/` shows as deleted. If
none were closed and an open `debt` item is older than 28 days, say "no debt
paid in 4 weeks", and propose to fix or drop each `debt` item.

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
and say "item N of M". Read the item again before you act on an answer. If an
earlier answer changed it, brief it again and ask again.

### Add

Use this mode for one or more ideas from the user or from another skill.

1. Classify each idea as `idea` or `debt`, then apply the filing bar of its
   kind. Name each idea that fails it, and give the reason.
2. Find repeats. Search the items by the slug or the title, the `where` path,
   and the claim of the idea. A shared `where` path alone does not make a
   repeat: compare the claims. Skip the item that the calling task works on. If
   an item already covers the idea, propose to add the new evidence to that
   item. Do not create a second item.
3. Show all remaining ideas in one batch. For each idea, give the title, the
   `kind`, the proposed `worth`, and one line about why it matters, or the
   interest for `debt`. For a repeat, name the existing item. Ask the user
   to choose for each idea: file it, or add the evidence to the existing
   item, or drop it. The user can also change `kind` or `worth`. A calling
   skill can add its own option, such as "do now" in `ship`. Give the ideas
   with that option back to the calling skill. Write only what the user
   approved. When the calling skill passes decisions that
   the user delegated to it, apply them without asking.
4. For files, choose where to write:
   - When another skill, such as `ship`, calls this mode, write in the
     current working tree. The items become changes of that task.
   - Otherwise, find the default branch from `git symbolic-ref
     refs/remotes/origin/HEAD`, or use `origin/main` or `origin/master`
     before a local branch of the same name. If the current
     branch is not the default branch, ask the user before you write: write
     on this branch, or stop so that the user can switch. If no default
     branch is found, or HEAD is detached, ask the user before you write.
   - Do not create a branch or a worktree.
5. Report the files or the tickets that you created or changed.
