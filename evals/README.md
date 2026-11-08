# Skill evals

Each case runs one skill in a clean `claude` or `codex` session on a small
fixture repository. Code checks the result. No LLM judges a case.

## Run

```bash
cd evals
npx promptfoo eval --filter-providers 'claude@' --repeat 3 --no-cache
npx promptfoo view
```

- `claude@working` uses the skills in the working tree. `claude@main` uses
  the skills at `main`. To test a change, compare the two columns on the same
  cases. Use the `codex@` providers for Codex.
- Claude runs Sonnet 5.5 and Codex runs GPT 6.1 sol, both at medium effort.
  Change `model` and `effort` in `promptfooconfig.yaml` for all providers at
  once, so that the columns stay comparable.
- A run is slow and costs money. Run only the cases of the skills that a
  change touches: `--filter-pattern '<words of the descriptions>'`.
- Run each case 3 times (`--repeat 3`). One run can pass or fail by chance.
- A case costs about $0.1–0.2 per run on Claude. A `ship` case that
  continues a run costs more.

## How a run is isolated

- The provider copies `cases/<case>/repo` to a new directory in the system
  temp directory and commits it. Then it copies `cases/<case>/change` over
  it, as the uncommitted changes of the task.
- Files in `change/gitdir/` go into `.git/` after the commit, such as a
  `ship` progress file in `.git/ship/`. In them, `{{BASE}}` becomes the base
  commit and `{{BRANCH}}` the current branch. `fixed/gitdir/` works the same.
- `SKILL_FEEDBACK_FILE` points to `.git/skill-feedback.md` of the run, so
  that `ship` does not write to your own feedback file.
- The skills go to `.claude/skills` and `.agents/skills` in that directory.
  The global install is not used.
- Claude runs with `--setting-sources project --strict-mcp-config`. The
  directory is outside your home directory, so Claude does not find your
  `~/.claude/CLAUDE.md` in a parent directory.
- Codex can write to `.git/` and `.codex/` of the run, which its sandbox
  keeps read-only by default.
- Codex runs with `--ephemeral` and its own `CODEX_HOME`, which holds only a
  link to your `auth.json`. So it reads neither your `config.toml` nor your
  `~/.codex/AGENTS.md`.
- Both use your normal login.

## Add a case

1. Add `cases/<case>/repo`, and `change` if the skill works on the changes of
   a task.
2. Add a check to `checks.mjs`. Name it after the case in camel case:
   `deslop-task-bloat` is `deslopTaskBloat`.
3. Add a good result made by hand: the files in `fixed/`, the answer text
   in `fixed-output.txt`, or both. Add `bad-output.txt` if the check reads
   the answer. `npm test` shows that the check fails on the fixture and
   passes on the good result.
4. Add a test to `promptfooconfig.yaml`. Quote the user's
   words in `source`. Do not name the company, its projects, or its
   internal services anywhere in a case.

Take cases from real runs: a place where a skill failed the user is a case.
Check only that failure. Do not fail a case for a choice that the skill
allows, such as a name or a wording.

When a case fails, read the answer before you blame the skill. In the first
runs, three of four new failures came from a check that was too strict.

## Dream consumer tasks

The `dream behavior` case runs the review, then four tasks in fresh CLI
sessions with memory from before and after the review. A task repo contains
only its fixture and one memory snapshot. It does not contain review
transcripts, pending candidates, skills, or the reviewer's answer. Its
`AGENTS.md` emulates a host that loads the index and reads relevant notes.
This measures that loading contract, not every host's native auto-memory.

Opt in with a comma-separated `probes` variable; an array would make
promptfoo expand separate test cases. Task fixtures and prompts live in
`probes/`, outside the repository shown to the reviewer. Code in `probes.mjs`
checks the consumer's answer or artifact. Each probe costs two additional
CLI calls per review. Run the behavior case separately when iterating:

```bash
npx promptfoo eval --filter-providers 'codex@' \
  --filter-pattern 'dream behavior' --repeat 3 --no-cache \
  --output /tmp/dream-behavior.json
```

Provider metadata records every task's before/after answer and workdir.
Codex JSON events stay in `.git/codex-events.jsonl` of each workdir. A note
is marked visibly loaded only if its contents occur in returned command
output; otherwise exposure is unknown. An after-only pass is not evidence
of improvement: inspect the paired before result and compare skill versions.
The document task exercises the scope of the answer-format preference; the
explicit-table task tests a new user override; arithmetic is unrelated.

For a version comparison, pin `config.skills` to the exact baseline and
candidate commit IDs in a temporary copy of the configuration. Use identical
task prompts, models, effort, and checks. Specify the fixture's dated review
window; do not depend on the current date. Research fixtures are synthetic
robustness tests, not measured incidents from real projects. Three repeats
are a directional check, not a reliable estimate of a population effect.
