---
worth: later
where: skills/dream/SKILL.md
added: 2026-11-07
source: research of memory tools for dream, f/dream @ 1cf35b1
---

# Dream: verify the deletions and count note usage

**Idea.** Before dream applies a *wrong* or *stale* verdict, a separate pass checks the quoted evidence again, as in the review mode of Letta sleep-time agents. Also find in the transcripts which notes the agent used. A note that no session used in several runs becomes a candidate to make sharper or to merge, as with `usage_count` and `max_unused_days` in the consolidation prompt of Codex memories (openai/codex `codex-rs/memories/write/templates/memories/consolidation_v2.md`).

**Why it matters.** A wrong deletion removes a correct note from every next session, and the user may not see it. Usage shows which notes have no effect.

**Evidence.** The dream evals have no case of a wrong deletion that a second pass would catch. Usage needs transcripts in which the agent reads a note file, and the hosts differ in how they show that.

**Why it was deferred.** It is not known if a second pass catches errors that the first pass makes, or if it only costs more. Measure it first on a case with a wrong deletion.
