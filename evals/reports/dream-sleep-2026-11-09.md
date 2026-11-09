# Dream: Sleep-inspired changes, 2026-11-09

Keep the changes: they fix review-state errors and add a way to test whether
memory affects a new session. They do **not** establish higher downstream
accuracy than the old skill: both versions passed all nine consumer tasks
after review. The measured gains concern candidate handling and reminders.

This adapts offline consolidation and controlled rehearsal from the
[Google Sleep framework](https://research.google/blog/the-sleep-framework-a-new-way-for-llms-to-retain-knowledge-in-continual-learning/)
to external file memory. It does not reproduce the paper's weight updates or
claim its benchmark improvements.

## What changed

1. The eval provider runs held-out tasks in separate fresh sessions, with
   memory snapshots from before and after review. Review transcripts,
   pending candidates, skills, and the review answer are absent. Returned
   tool output can establish that note contents were exposed; missing
   evidence stays unknown.
2. `ignored` distinguishes missing recall, incorrect scope, and a skipped
   action when the transcript supports that diagnosis. Otherwise it reports
   uncertainty.
3. Merging preserves supported conditions, actions, exceptions, reasons,
   and useful canonical pointers. A consumer exercises an approval exception.
4. First inferred corrections remain outside loaded memory in the git
   common directory's `dream-candidates/`. Promotion reopens original
   evidence and counts distinct sessions. Explicit original user requests
   to remember a standing preference need no recurrence. Reminders write
   `dream-reminded`; only a completed review advances `dream-last`.
5. Synthetic rehearsals can test rules, but cannot establish preferences,
   facts, or pending evidence. Ordinary reviews do not launch agent loops.

## Comparison

Baseline skill: `2d4039684c05a4688a1841db26f75ef347bc9301`.
Candidate skill: `647dad1fa3f622c0f1c4f1a3d4f45bc2773924d3`.
Final grading code: `da39308e1fabe09ba2bb651c7066d2eb44b5b515`.
These measurements refer to the frozen snapshots above. Subsequent text-only
edits are not part of this comparison.

Both versions used Codex `gpt-6.1-sol`, medium effort, the same fixtures,
requests, and code checks, with promptfoo result caching disabled and explicit
dated windows.
The full 14-case suite ran once per version. Three targeted cases ran twice
more, giving three trials each. A separate four-session cycle carried actual
state through first correction, replayed excerpts, independent correction,
and a consumer task. Total: **84 fresh CLI sessions**, excluding preflights.

| Scenario | Baseline | Candidate |
|---|---:|---:|
| Five existing review/consent regressions | 5/5 | 5/5 |
| Four-task fresh-session behavior case | 1/1 | 1/1 |
| Explicit request to remember, immediately | 3/3 | 3/3 |
| Recall/scope/action/unknown diagnosis | 1/1 | 1/1 |
| Retain a first inferred correction as pending | 0/3 | 3/3 |
| Promote across windows and clear pending state | 1/3 | 3/3 |
| Replayed excerpts do not count as new sessions | 1/1 | 1/1 |
| Pruning preserves the approval exception | 1/1 | 1/1 |
| Synthetic instructions excluded from memory/state | 1/1 | 1/1 |
| Installed reminder preserves the review boundary | 0/1 | 1/1 |
| **Scenario trials** | **14/20** | **20/20** |

The two baseline promotion failures left the pending candidate after
promotion; the final term was still used correctly. The first-correction
case measures retention outside loaded memory, not an accuracy gain.

Across the nine consumer pairs per version, **5/9 passed before review and
9/9 after review in both versions**. Memory changed the default reply format
and supplied the progress term. Explicit table requests, tables inside a
requested document, arithmetic, and the approval exception remained valid.
There is no measured consumer-task advantage for the candidate here.

In the actual carryover cycle, the candidate passed every state transition
and the consumer. The baseline did not follow the new pending-state policy,
but its final consumer also passed. Fresh repositories and explicit windows
make this a candidate-carryover test, not a native default-window integration
test.

The actual installed reminder passed all seven command checks for the
candidate, versus four for the baseline. The old command created or advanced
the review watermark while showing a reminder. Its apparent reminder expiry
was also affected by that write. The new command preserves the watermark,
throttles repeated notices, expires the throttle, and respects a recent
review.

## Verification and corrections

- `npm test`: **113 passed**, including hand-built good/bad fixture results,
  missing-consumer checks, task isolation, malformed Markdown, supported
  Markdown without outer pipes, scoped table behavior, note-exposure evidence,
  injected-action absence, and reminder boundary/expiry tests.
- All **76** review/consumer indexes in the final comparison had resolving
  local Markdown links.
- Three read-only subagents contributed independent design and review.
- Final comparison: **zero CLI errors**. One earlier preflight CLI run
  stalled and hit the 20-minute timeout; it is excluded from the final trials.
  No cause was established from its partial trace.

The early pilot's first-correction wording included an explicit request to
keep the preference for future use. That conflated inference with a request
to remember, so it was replaced before the final comparison and an explicit
memory-request control was added. That pilot is not evidence for the gain.

Two legitimate answers exposed grader defects: a wrapped historical command
was read as a current instruction, and “ongoing hosting cost” was rejected as
a paid-cost description. Regression controls now cover the valid answers
and affirmative stale commands, unrelated negation, and free-hosting claims.
Both saved final variants were regraded with the same corrected code; the
skill and model outputs were not changed to pass these corrections. The raw
candidate run was 13/14 before the cost-grader correction, and 14/14 after it.

See the [sanitized per-trial evidence](dream-sleep-2026-11-09.json) for
original and final outcomes, consumer answers, exposed notes, actual cycle
outputs, and reminder checks. Raw CLI traces remain in local temporary eval
repositories; no account credentials or machine paths are published here.

## Recommendation

Merge the checkpoint fix and the external measurement support. Keep the
candidate rules as an explicit conservative policy: inferred preferences
wait for independent recurrence; original user requests to remember do not.
Keep scope/pruning guidance and synthetic-data exclusions as tested guards,
without attributing a new performance gain to them.

Next, collect real failures and test another model/host before expanding the
rules. These are small controlled fixtures, mostly synthetic. They emulate
index loading through `AGENTS.md`, not each host's native auto-memory. Most
cases ran once, and three repeats on selected cases are only directional.
Codex did not report dollar costs; the session count is the available budget
measure. Keep expensive paired runs in evals instead of every memory review.

Reproduction commands and the real-state cycle are documented in
[the eval guide](../README.md#dream-consumer-tasks). Pin the two skill refs
above when comparing versions.
