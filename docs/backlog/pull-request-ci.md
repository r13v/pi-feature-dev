---
worth: yes
where: .github/workflows/release.yml
added: 2026-10-23
source: ship 20261023-1608-retro, f/backlog @ d7ca367
---

# Run `npm test` on each pull request

**Idea.** Add a GitHub Actions workflow that runs `npm test` on each pull
request.

**Why it matters.** No check runs before a change reaches `main`. A broken
package shape or a failed check is found only after the merge, or not at all.

**Evidence.** `.github/workflows/` has only `release.yml`, which runs on a
push to `main`. No hook or job runs `npm test` on a pull request.

**Why it was deferred.** The retro run changed the skills, not the CI. Retro
reports a repository without a guardrail as a separate candidate.
