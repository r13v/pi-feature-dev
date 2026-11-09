# STE multilingual clarity — 2026-11-09

## Scope

Clarity mode now accepts technical text in any language, preserves the source
language, and loads specific Russian guidance. Strict ASD-STE100 remains
English-only. English grammar, vocabulary, and word-count rules are not imposed
on other languages.

Reviewed `artgas1/infostyle-skill` at commit
`623322d47ddf0bf10dc1208ed6de0d64856d4a38`. Adopted context-sensitive techniques:
direct verbs, less bureaucratic wording, simpler noun/participial chains, and
UI text appropriate to its purpose. Did not adopt mandatory numbers, mechanical
modality deletion, retained-length quotas, marketing scores, or mandatory output
blocks. These can conflict with technical accuracy or the requested output.

## Method

Existing clean-session promptfoo provider; Claude Sonnet 5.5, medium effort.
Four scenarios, three repeats each, for both working skills and `main`.
Baseline: `2d4039684c05a4688a1841db26f75ef347bc9301`; its STE files match the
pre-change HEAD. Candidate: uncommitted working tree of this change.

```bash
cd evals
npx promptfoo eval --filter-providers 'claude@' \
  --filter-pattern '^ste ' --repeat 3 --no-cache \
  --output /tmp/ste-evals-verified.json
```

Final evaluation ID: `eval-CfA-2026-11-09T08:57:43`.
Raw local results: `/tmp/ste-evals-verified.json`.
Rescored local results: `/tmp/ste-evals-rescored.json`.

## Results

| Scenario | Working | Baseline |
|---|---|---|
| English instructions and deployment limits | 3/3 | 3/3 |
| Russian modality, limits, literals, unspecified check target | 3/3 | 3/3 |
| Russian UI without invented numbers, causes, or certainty | 3/3 | 3/3 |
| Russian/German safety text: English-only STE boundary | 3/3 | 3/3 |
| Total | 12/12 | 12/12 |

These totals use the final assertions on the saved artifacts and answers. The
raw final run was 23/24: the checker rejected the valid phrase «без заявления о
соответствии ASD-STE100». Manual inspection confirmed a false rejection. The
checker and its hand-written good fixture now accept that wording; all 24 saved
results were rescored without regenerating answers. No skill text changed after
the final run began.

Earlier runs exposed other over-specific assertions: «не удаётся» versus
«невозможно», alternative word order for the recovery endpoint, a repeated
unchanged command, and a rejected status quoted only to deny its applicability.
Those assertions were corrected after inspecting answers and edited files.

An intermediate candidate also made a real semantic error: it inferred that
`deploy --check` checks the backup, although the source did not name the target.
The skill now explicitly forbids filling that gap, even with a disclaimer.
A regression assertion and a negative unit test cover that inference. All three
final working Russian deployment artifacts were manually inspected: the target
remains unspecified, and conditions, commands, hedges, and limits are retained.

## Other validation and limits

- `npm test`: 123/123 passed, including fixture/check validation and packaging.
- `git diff --check`: passed.
- No CLI evaluation errors. Promptfoo emitted a telemetry shutdown timeout
  after saving results; it did not prevent evaluation output.
- The baseline also passed every final scenario. This supports compatibility on
  this small sample, not measured superiority of the new instructions.
- Three repeats are directional evidence, not a reliable population estimate.
- Checks cover observable safeguards, not full semantic equivalence or a style
  score. Only English, Russian, and a short German boundary case were exercised.
  No formal Issue 9 dictionary verification or all-language validation occurred.
