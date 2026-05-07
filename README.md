# pi-feature-dev

Portable guided feature development workflow, packaged as a Pi skill.

The skill describes a tool-agnostic process for non-trivial feature work:

- clarify requirements before coding
- explore the existing codebase before design
- compare implementation approaches and get approval
- implement with one writer
- review the diff from multiple perspectives
- validate and summarize results

It does not require specific task-tracking, question, delegation, or review tools. If the current environment provides equivalent capabilities, use them; otherwise follow the same workflow directly in chat and with normal code tools.

## Install

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

This package is intentionally skill-only. It does not provide a `/feature-dev` prompt template shortcut; use `/skill:feature-dev` for explicit Pi invocation.

## What it does

The skill guides a coding assistant through a seven-phase process:

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
    └── feature-dev/
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
