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
- Run each case 3 times (`--repeat 3`). One run can pass or fail by chance.
- A case costs about $0.1–0.2 per run on Claude.

## How a run is isolated

- The provider copies `cases/<case>/repo` to a new directory in the system
  temp directory and commits it. Then it copies `cases/<case>/change` over
  it, as the uncommitted changes of the task.
- The skills go to `.claude/skills` and `.agents/skills` in that directory.
  The global install is not used.
- Claude runs with `--setting-sources project --strict-mcp-config`. The
  directory is outside your home directory, so Claude does not find your
  `~/.claude/CLAUDE.md` in a parent directory.
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
