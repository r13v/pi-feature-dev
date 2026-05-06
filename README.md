# pi-feature-dev

Pi-native guided feature development workflow.

This package adapts a Claude Code-style feature development workflow to Pi using Pi packages and tools:

- `pi-subagents` for scout/planner/worker/reviewer fanout
- `@juicesharp/rpiv-todo` for phase tracking
- `@juicesharp/rpiv-ask-user-question` for structured choices
- optional `context-mode`, `pi-web-access`, and `pi-intercom` for large-output handling, web/code research, and session coordination

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

## Required companion packages

This workflow expects these Pi tools to be available:

```bash
pi install npm:pi-subagents
pi install npm:@juicesharp/rpiv-todo
pi install npm:@juicesharp/rpiv-ask-user-question
```

Recommended optional packages:

```bash
pi install npm:context-mode
pi install npm:pi-web-access
pi install npm:pi-intercom
```

## Usage

Skill command:

```text
/skill:feature-dev Add OAuth login with Google and GitHub
```

Natural language also works when Pi's skill matcher triggers:

```text
Use feature-dev to implement API rate limiting.
```

This package is intentionally skill-only. It does not provide a `/feature-dev` prompt template shortcut; use `/skill:feature-dev` for explicit invocation.

## What it does

The skill guides Pi through a seven-phase process:

1. Discovery — understand the feature and create todos
2. Codebase exploration — inspect relevant code and patterns, optionally with parallel subagents
3. Clarifying questions — resolve ambiguity before design
4. Architecture design — compare minimal, clean, and pragmatic approaches
5. Implementation — only after approval, with a single writer
6. Quality review — parallel fresh-context reviewers inspect the diff
7. Validation and summary — run focused checks and summarize changes

## Package contents

```text
pi-feature-dev/
├── package.json
└── skills/
    └── feature-dev/
        └── SKILL.md
```

The package intentionally does **not** ship custom subagent definitions. It uses the built-in roles from `pi-subagents` (`scout`, `context-builder`, `planner`, `worker`, `reviewer`, `researcher`, `oracle`) so it stays small and tracks improvements in that package.

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
