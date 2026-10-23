---
worth: yes
where: package.json:30
added: 2026-10-23
source: ship 20261023-1608-retro, f/backlog @ d7ca367
---

# Check the line length of skill files in `npm test`

**Idea.** Add a check to `npm test` that fails when a Markdown line in
`skills/` is longer than 80 characters. Do not check the frontmatter and the
code blocks.

**Why it matters.** Long lines come back after each change, and a person or
the diff review must find them. A check finds them before the review.

**Evidence.** The diff review of the retro run found an unwrapped line in
`skills/ship/SKILL.md`. Commit `01c9a47` ("wrap a long line in `ship`")
fixed the same kind of line before. `skills/ship/SKILL.md:29` is still longer
than 80 characters. `npm test` now runs only `npm pack --dry-run`.

**Why it was deferred.** The retro run changed the skills, not the checks of
the repository. Retro proposes changes to the environment as separate work.
