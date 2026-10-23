---
worth: yes
added: 2026-10-23
source: ship 20261023-1608-retro, f/backlog @ d7ca367
---

# Give the reviewer rules for the progress file and the README

**Idea.** Create `CODING_STANDARDS.md` with two review rules:

- When a change adds a stage, an entry value, a section, or a tag to the
  `ship` progress file, walk each path to `status: finished`: a skipped
  stage, a resume, a second pass, and an empty input.
- The README paragraph about a skill must agree with the rules of its
  `SKILL.md`.

`ship` gives this file to the diff review.

**Why it matters.** The diff review and final-check find the same kind of
gap again in each run that changes `ship`. A rule that the reviewer reads
first finds these gaps earlier, and fewer fixes follow.

**Evidence.** In the retro run, review findings 4, 11, 12, and 13 and
final-check finding 1 were gaps in the paths of the progress file. For
example, a run with only `retro-skill:` ideas could not finish. Final-check
findings 2 and 3 were a README that did not agree with the skill. The backlog
run before it had 11 review findings and 5 final-check findings of the same
kind.

**Why it was deferred.** The retro run changed the skills, not the review
rules of the repository.
