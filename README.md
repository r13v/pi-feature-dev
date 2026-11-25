# pi-feature-dev

Portable agent workflows and writing skills, packaged as Pi skills. Each
`skills/*/SKILL.md` is plain Markdown and works in other agent environments.
No skill needs a specific tool; if the host has an equivalent one, the skill
uses it.

## Skills

| Skill | What it does |
|---|---|
| `feature-dev` | Develops a non-trivial feature: clarify, explore, design, implement with one writer, review, validate. |
| `drive` | Runs the whole flow below for one feature, with progress kept under `.git/` and a `visual-recap` for large or contract changes. `drive quick` runs only `feature-dev`, `final-check`, and `deslop` (warning on high-rework changes). Commits, pushes, and merges only through `land`, when the user asks. Runs `elevate` only on request. |
| `grill` | Interviews the user round by round to settle decisions. Records terms in `GLOSSARY.md` and decisions as ADRs. |
| `elevate` | Rewrites a task around the outcome it serves, not the artifact it names. |
| `deepen` | Rewrites a task into the version a top professional would do, with the same goal and deliverable. |
| `final-check` | Asks what we missed, and what to check or fix. |
| `deslop` | Audits or removes test, verification, fallback, and comment bloat. |
| `retro` | Proposes changes to the agent's environment from the friction of a session or a `drive` run, including host guardrails such as deny rules and hooks. |
| `land` | Commits validated changes, opens a pull or merge request, and gets CI green; merges, checks the deploy, and updates the ticket when asked. |
| `dream` | Reviews the agent's memory against past sessions, code, and git. |
| `backlog` | Keeps deferred ideas and debt as tickets or as files under `docs/backlog/`. |
| `ste` | Writes clear technical text: strict ASD-STE100 for English, clarity mode for any language. |
| `model-check` | Checks each reachable state of a small model of a flow and gives the shortest event path that breaks each rule. Plain Node, no Java. |
| `visual-recap` | Makes an evidence-backed visual review aid for a plan or a change. |

## Install

```bash
npx skills add https://github.com/r13v/pi-feature-dev
pi install npm:pi-feature-dev          # from npm
pi install ~/Projects/pi-feature-dev   # from a local clone
pi install -l ~/Projects/pi-feature-dev  # for one project
pi -e ~/Projects/pi-feature-dev        # for one run only
```

## Usage

```text
/skill:feature-dev Add OAuth login with Google and GitHub
/skill:drive Add usage-based billing to the invoices service.
/skill:drive quick Add a CSV export to the reports page.
/skill:drive docs/backlog/export-ignores-time-zone.md
/skill:deslop audit the current branch for test, verification, and fallback bloat.
/skill:backlog Add: the CSV export ignores the account time zone.
/skill:ste Rewrite this error message so another agent can parse it reliably.
```

The package has only skills, no prompt templates.

## Recommended flow

Steps in brackets are optional:

```text
[elevate] → grill → [deepen] → feature-dev → [final-check] → deslop → [retro] → [land]
```

- `elevate` decides what to do; `grill` settles it.
- `deepen` needs a settled deliverable, and its external check becomes the
  validation criterion for `feature-dev`.
- `deslop` runs after `final-check`, so it also cleans up its fixes.
- `retro` reviews how the run went; skip it after a smooth run.
- `land` commits and merges the result, only when you ask.

`drive` runs this flow, and runs `land` after it when you ask. It selects the
optional stages by the rules in `skills/drive/SKILL.md`.

## Credits

- [umputun/cc-thingz](https://github.com/umputun/cc-thingz)
- [anthropics/claude-code feature-dev plugin](https://github.com/anthropics/claude-plugins-official/tree/main/plugins/feature-dev)
- [mattpocock/skills grilling, domain-modeling, and retro skills](https://github.com/mattpocock/skills)
- [MrZoyo/deslop-GPT](https://github.com/MrZoyo/deslop-GPT/tree/main/skills/deslop)
- [danyuchn/asd-ste100-skill](https://github.com/danyuchn/asd-ste100-skill)
- [AminBlg/SimpleEnglish](https://github.com/AminBlg/SimpleEnglish/tree/main/skills/simple-english)
- [Felix Rieseberg, How to Be More Ambitious](https://felixrieseberg.com/how-to-be-more-ambitious-a-tutorial-for-humans-with-models/)
- [kentcdodds/kcd-skills visual-recap](https://github.com/kentcdodds/kcd-skills/tree/main/skills/visual-recap),
  MIT License, Copyright (c) 2026 Kent C. Dodds
- [backnotprop/pstack statechart](https://github.com/backnotprop/pstack/tree/main/skills/statechart),
  MIT License, Copyright (c) 2026 Lauren Tan

## Development

```bash
npm test   # package shape and 80-character lines in skill files; CI runs it
```

`/skill:upstream-check` compares the skills with their upstream originals
(project-local, in `.agents/skills/`, not published).

Releases: conventional commits on `main` → semantic-release publishes to npm
and creates the tag and release notes.
