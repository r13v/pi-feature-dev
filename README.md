# pi-feature-dev

Portable coding-agent workflows, packaged as Pi skills.

The `feature-dev` skill describes a tool-agnostic process for non-trivial
feature work:

- clarify requirements before coding
- explore the existing codebase before design
- compare implementation approaches and get approval
- implement with one writer
- review the diff from multiple perspectives
- validate and summarize results

It does not require specific task-tracking, question, delegation, or review tools. If the current environment provides equivalent capabilities, use them; otherwise follow the same workflow directly in chat and with normal code tools.

The `plan-exec` skill executes implementation plan files task by task with
isolated workers, Git task commits, internal reviews, finalize, and a portable
run summary. It is portable across host agents that provide fresh-context
isolated workers and Git access.

The `grill` skill runs a dependency-aware interview that researches facts,
exhausts the current decision frontier round by round, sharpens domain language,
and records agreed terminology and durable architectural decisions.

## Install

```
npx skills add https://github.com/r13v/pi-feature-dev
```

From npm:

```bash
pi install npm:pi-feature-dev
```

From this local repo:

```bash
pi install ~/Projects/pi-feature-dev
```

Or for one run only:

```bash
pi -e ~/Projects/pi-feature-dev
```

If installing for a project, run from that project and use Pi's local install flag if desired:

```bash
pi install -l ~/Projects/pi-feature-dev
```

## Optional companion packages

No companion package is required. Optional Pi packages can improve specific parts of the workflow, such as progress tracking, structured choices, delegation, large-output handling, web/code research, or session coordination.

## Credits

The original Claude Code skills and workflows that informed these portable
versions came from:

- [umputun/cc-thingz](https://github.com/umputun/cc-thingz)
- [anthropics/claude-code feature-dev plugin](https://github.com/anthropics/claude-code/tree/main/plugins/feature-dev)
- [mattpocock/skills batch-grill-me and domain-modeling skills](https://github.com/mattpocock/skills)

## Usage

Skill command in Pi:

```text
/skill:feature-dev Add OAuth login with Google and GitHub
```

Natural language also works when Pi's skill matcher triggers:

```text
Use feature-dev to implement API rate limiting.
```

The `skills/feature-dev/SKILL.md` file is portable markdown and can be adapted for other coding assistant environments.

Run a plan with `plan-exec`:

```text
/skill:plan-exec docs/plans/20260518-example.md
```

Stress-test an idea before planning or implementation:

```text
/skill:grill Challenge the design for usage-based billing.
```

This package is intentionally skill-only. It does not provide prompt template shortcuts; use `/skill:<name>` for explicit Pi invocation.

## Feature-dev workflow

The `feature-dev` skill guides a coding assistant through a seven-phase process:

1. Discovery — understand the feature and establish lightweight progress tracking
2. Codebase exploration — inspect relevant code and patterns, optionally with read-only helper passes
3. Clarifying questions — resolve ambiguity before design
4. Architecture design — compare minimal, clean, and pragmatic approaches
5. Implementation — only after approval, with a single writer
6. Quality review — inspect the diff from correctness, validation, and maintainability perspectives
7. Validation and summary — run focused checks and summarize changes

## Package contents

```text
pi-feature-dev/
├── package.json
└── skills/
    ├── feature-dev/
    │   ├── agents/openai.yaml
    │   └── SKILL.md
    ├── grill/
    │   ├── agents/openai.yaml
    │   ├── SKILL.md
    │   ├── CONTEXT-FORMAT.md
    │   └── ADR-FORMAT.md
    ├── plan-exec/
    │   ├── agents/openai.yaml
    │   ├── SKILL.md
    │   ├── references/
    │   └── scripts/
    ├── plan-make/
    │   ├── agents/openai.yaml
    │   └── SKILL.md
    └── plan-review/
        ├── agents/openai.yaml
        └── SKILL.md
```

## Release

Releases are automated with GitHub Actions and semantic-release.

- Push conventional commits to `main`.
- With no existing `v*` tags, the first release will be `v1.0.0`.
- After that, semantic-release calculates the next version from commit messages.
- The workflow publishes to npm using `NPM_TOKEN`.
- GitHub release notes and git tags are created automatically.

Examples:

```text
fix: clarify approval rules
feat: add review synthesis guidance
feat!: redesign workflow phases
```

## Development

Validate the package shape:

```bash
npm test
```

Then test in Pi without installing globally:

```bash
pi -e ~/Projects/pi-feature-dev
```
