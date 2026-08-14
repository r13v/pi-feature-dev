# pi-feature-dev

Portable agent workflows and writing skills, packaged as Pi skills.

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

The `final-check` skill asks: “What else have we missed? Is there anything we
need to check or fix?”

The `i-have-adhd` skill shapes responses for a reader with ADHD: it leads with
the next action, keeps multi-step work bounded, restates progress, suppresses
tangents, and makes completed work visible.

The `grill` skill runs a dependency-aware interview that researches facts,
exhausts the current decision frontier round by round, sharpens domain language,
and records agreed terminology and durable architectural decisions.

The `ste` skill drafts, rewrites, and reviews clear English with
[ASD-STE100 Simplified Technical English](https://www.asd-ste100.org/)
principles. It supports strict technical-documentation work and a general
clarity mode for prompts, tool descriptions, error messages, status reports,
translation-ready text, and agent instructions. The skill is Markdown-only and
has no runtime dependency.

The `creator-vibe` skill turns incomplete creative briefs and implicit intent
into concrete work without losing the creator's taste, feeling, or human focus.
It applies to creative technical and everyday work, while staying out of
factual, mechanical, exact, or fully specified tasks.

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
- [danyuchn/asd-ste100-skill](https://github.com/danyuchn/asd-ste100-skill)
- [AminBlg/SimpleEnglish](https://github.com/AminBlg/SimpleEnglish/tree/main/skills/simple-english)
- [ayghri/i-have-adhd](https://github.com/ayghri/i-have-adhd)
- [bish-x/creator-vibe](https://github.com/bish-x/creator-vibe)

## Usage

Skill command in Pi:

```text
/skill:feature-dev Add OAuth login with Google and GitHub
```

Natural language also works when Pi's skill matcher triggers:

```text
Use feature-dev to implement API rate limiting.
```

Carry an incomplete creative brief into the work itself:

```text
/skill:creator-vibe Make this onboarding feel calm, capable, and unmistakably ours.
```

The files under `skills/*/SKILL.md` are portable Markdown and can be adapted for
other agent environments.

Run a plan with `plan-exec`:

```text
/skill:plan-exec docs/plans/20260518-example.md
```

Run a final completeness check on the current work:

```text
/skill:final-check
```

Enable ADHD-oriented output for the rest of the session:

```text
/skill:i-have-adhd
```

Disable it with `stop adhd mode` or `normal mode`.

Stress-test an idea before planning or implementation:

```text
/skill:grill Challenge the design for usage-based billing.
```

Rewrite technical or operational English:

```text
/skill:ste Rewrite this maintenance instruction as an STE-aligned draft.
```

Use STE principles for general agent communication:

```text
/skill:ste Rewrite this error message so another agent can parse it reliably.
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

## STE modes

The `ste` skill selects one of two modes:

- **Strict STE** applies Issue 9 rules to regulated, operational, maintenance,
  and safety-critical documentation. Exact verification requires the official
  dictionary and the applicable project glossary.
- **STE clarity** transfers the same clarity discipline to other technical
  text without claiming formal ASD-STE100 compliance.

The skill loads its detailed writing rules, review checklist, text-type
patterns, and before/after examples only when they are relevant to the request.
Standard provenance, design references, and source links stay in
`skills/ste/README.md`, outside the agent's writing context.

## Package contents

```text
pi-feature-dev/
├── package.json
└── skills/
    ├── creator-vibe/
    │   ├── agents/openai.yaml
    │   └── SKILL.md
    ├── feature-dev/
    │   ├── agents/openai.yaml
    │   └── SKILL.md
    ├── final-check/
    │   ├── agents/openai.yaml
    │   └── SKILL.md
    ├── grill/
    │   ├── agents/openai.yaml
    │   ├── SKILL.md
    │   ├── CONTEXT-FORMAT.md
    │   └── ADR-FORMAT.md
    ├── i-have-adhd/
    │   ├── agents/openai.yaml
    │   └── SKILL.md
    ├── plan-exec/
    │   ├── agents/openai.yaml
    │   ├── SKILL.md
    │   ├── references/
    │   └── scripts/
    ├── plan-make/
    │   ├── agents/openai.yaml
    │   └── SKILL.md
    ├── plan-review/
    │   ├── agents/openai.yaml
    │   └── SKILL.md
    └── ste/
        ├── agents/openai.yaml
        ├── references/
        │   ├── before-after.md
        │   ├── checklist.md
        │   ├── use-cases.md
        │   └── writing-rules.md
        ├── README.md
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
