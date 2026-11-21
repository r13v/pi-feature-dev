# pi-feature-dev

Portable agent workflows and writing skills, packaged as Pi skills. Each
`skills/*/SKILL.md` is plain Markdown and works in other agent environments.
No skill needs a specific tool; if the host has an equivalent one, the skill
uses it.

## Skills

| Skill | What it does |
|---|---|
| `feature-dev` | Develops a non-trivial feature: clarify, explore, design, implement with one writer, review, validate. |
| `ship` | Runs the whole flow below for one feature, with progress kept under `.git/`. `ship quick` runs only `feature-dev`, `final-check`, and `deslop`. Does not commit or push. |
| `grill` | Interviews the user round by round to settle decisions. Records terms in `CONTEXT.md` and decisions as ADRs. |
| `elevate` | Rewrites a task around the outcome it serves, not the artifact it names. |
| `deepen` | Rewrites a task into the version a top professional would do, with the same goal and deliverable. |
| `final-check` | Asks what we missed, and what to check or fix. |
| `deslop` | Audits or removes test, verification, fallback, and comment bloat. |
| `retro` | Proposes changes to the agent's environment from the friction of a session or a `ship` run. |
| `dream` | Reviews the agent's memory against past sessions, code, and git. |
| `backlog` | Keeps deferred ideas and debt as tickets or as files under `docs/backlog/`. |
| `ste` | Writes clear technical text: strict ASD-STE100 for English, clarity mode for any language. |
| `creator-vibe` | Keeps the intended feeling and voice of an incomplete creative brief. |
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
/skill:ship Add usage-based billing to the invoices service.
/skill:ship quick Add a CSV export to the reports page.
/skill:ship docs/backlog/export-ignores-time-zone.md
/skill:deslop audit the current branch for test, verification, and fallback bloat.
/skill:backlog Add: the CSV export ignores the account time zone.
/skill:ste Rewrite this error message so another agent can parse it reliably.
```

The package has only skills, no prompt templates.

## Recommended flow

Steps in brackets are optional:

```text
[elevate] → grill → [deepen] → feature-dev → [final-check] → deslop → [retro]
```

- `elevate` decides what to do; `grill` settles it.
- `deepen` needs a settled deliverable, and its external check becomes the
  validation criterion for `feature-dev`.
- `deslop` runs after `final-check`, so it also cleans up its fixes.
- `retro` reviews how the run went; skip it after a smooth run.

`ship` runs this flow and selects the optional stages by the rules in
`skills/ship/SKILL.md`.

## Credits

- [umputun/cc-thingz](https://github.com/umputun/cc-thingz)
- [anthropics/claude-code feature-dev plugin](https://github.com/anthropics/claude-plugins-official/tree/main/plugins/feature-dev)
- [mattpocock/skills grilling, domain-modeling, and retro skills](https://github.com/mattpocock/skills)
- [MrZoyo/deslop-GPT](https://github.com/MrZoyo/deslop-GPT/tree/main/skills/deslop)
- [danyuchn/asd-ste100-skill](https://github.com/danyuchn/asd-ste100-skill)
- [AminBlg/SimpleEnglish](https://github.com/AminBlg/SimpleEnglish/tree/main/skills/simple-english)
- [bish-x/creator-vibe](https://github.com/bish-x/creator-vibe)
- [Felix Rieseberg, How to Be More Ambitious](https://felixrieseberg.com/how-to-be-more-ambitious-a-tutorial-for-humans-with-models/)
- [kentcdodds/kcd-skills visual-recap](https://github.com/kentcdodds/kcd-skills/tree/main/skills/visual-recap)

## Development

```bash
npm test   # package shape and 80-character lines in skill files; CI runs it
```

`/skill:upstream-check` compares the skills with their upstream originals
(project-local, in `.agents/skills/`, not published).

Releases: conventional commits on `main` → semantic-release publishes to npm
and creates the tag and release notes.
