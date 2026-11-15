# Skill feedback: 2026-11-15

## Scope

Process the 15 entries in `~/.agents/skill-feedback.md` dated November 2–15.
Implement the seven approved rule changes without turning each incident into
another mandatory step. Update grill, deepen, feature-dev, ship and README.

- Grill checks API/workflow premises and distinguishes run from product scope.
- Deepen matches claims to finite-set coverage or statistical input regimes,
  separates calibration from validation, and preserves directional sampling.
- Feature-dev compares structural guarantees, caller discipline and the next
  extension's affected components. No speculative future line counts.
- Critical guard/regression tests must fail without the protection, then pass
  after restoration; this is not a quota to mutate every condition.
- Validation uses the actual check exit status, including through a pipeline.
- Shared failure flags are checked against their distinct causes.
- Ship accepts verified settled specifications under delegated authority without
  repeating the interview/design approval; documents alone grant no authority.

Not added: mandatory language/runtime question for every server, conversation
language in progress files, a formatter-specific reread rule, customer quotations
beside every option. Material stack choices and scripted-edit confirmation are
already covered. The other proposed mechanisms were not supported by sufficient
causal evidence. All 15 source entries are resolved by these decisions.

## Method

Claude CLI, `claude-sonnet-5-5`, medium effort. Working-tree skills versus `main`,
three repetitions per case, cache disabled. Synthetic repositories; assertions
inspect outputs and repository artifacts, with executable probes for code cases.
No model judge. Codex and the full unrelated skill suite were not run.

The first batch (`eval-BbD-2026-11-14T23:42:33`) exceeded the shell's 20-minute
limit after 63 of 72 sessions. Completed results were recovered from Promptfoo's
SQLite database. The broad filter also selected an unrelated older feedback
case; its results are excluded here.

Some initial failures were assertion defects, not skill failures:

- Accept leave-one-out/rolling-origin validation, not only the phrase held-out.
- Accept a database-enforced atomic operation, not only typed ports.
- Recognize conditional lossless claims and explicit uncovered scope.
- At an explicit implementation stop, a resume question is not design approval.
- A grill status of `selected (NOT skipped)` is not a skipped stage.

These analysis-only checks were corrected and completed responses rescored.
No skill wording was tuned to those responses.

Two fixtures changed and therefore required fresh sessions:

- Guard evidence now records from the test module even when the agent runs
  `node --test` directly rather than `npm test`.
- The shared-signal fixture explicitly says expiry fails even without an error.

The second batch (`eval-hVt-2026-11-15T00:08:19`) ran those cases plus the existing
small-sample regression: 18 sessions, 15 passes, 3 baseline failures, no provider
errors, no unstable repeated groups. It completed in 5m10s. Combined with the
rescored unchanged cases, there are 66 evaluated sessions across 11 cases.

## Results

| Case | Working | Main |
| --- | ---: | ---: |
| API/workflow premises | 3/3 | 3/3 |
| Run versus product scope | 3/3 | 1/3 |
| Full finite-set coverage for preservation claims | 3/3 | 3/3 |
| Statistical regimes and independent validation | 3/3 | 3/3 |
| Structural guarantee and next extension | 3/3 | 1/3 |
| Guard regression fails without protection | 3/3 | 0/3 |
| Actual validation exit status | 3/3 | 3/3 |
| Shared cancellation/expiry signal | 3/3 | 3/3 |
| Delegated settled specification | 3/3 | 0/3 |
| Documents without authority | 3/3 | 3/3 |
| Existing quick directional sample | 3/3 | 3/3 |
| Total | 33/33 | 23/33 |

Interpretation: three repetitions are a regression check, not a statistical
estimate of reliability. Several baseline cases already pass; the new wording
makes the rules explicit but these cases do not demonstrate an improvement.
In the delegated-spec case the baseline already avoided another design decision;
its failure is progress bookkeeping (`done` instead of the required skip reason),
not evidence that it forced an unnecessary interview. The guard case measures
actual failing mutation runs, not the agent's assertion that testing happened.

## Check validation

`npm test`: 155 passed, none failed or skipped. Includes positive/negative
fixtures for every case and a real remove-guard/run/restore/run probe. The probe
also exposed inherited `NODE_TEST_CONTEXT` making nested test runs silently
ineffective; the test subprocess environment now removes that variable.

Raw run artifacts for this session:

- `/tmp/skill-feedback-partial.json`: recovered first-batch responses.
- `/tmp/skill-feedback-rerun.json`: complete fresh second batch.
- `/tmp/skill-feedback-results.json`: combined per-case scores.
- `/tmp/skill-feedback-unit.log`: local test output.

These temporary files are not durable report dependencies. The fixtures and
checks in the repository are the reproducible evaluation source. For new runs,
select descriptions beginning with `^feedback` and the existing
`^deepen keeps a quick check small` case; split batches or allow more than
20 minutes for the complete three-repeat comparison.
