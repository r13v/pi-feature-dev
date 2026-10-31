# pi-feature-dev

Portable agent workflows and writing skills, packaged as Pi skills.

The `feature-dev` skill describes a tool-agnostic process for non-trivial
feature work:

- clarify requirements before coding
- explore the existing codebase before design
- resolve material design decisions within the user's authorization
- implement with one writer
- review the diff from multiple perspectives
- validate and summarize results

It does not require specific task-tracking, question, delegation, or review tools. If the current environment provides equivalent capabilities, use them; otherwise follow the same workflow directly in chat and with normal code tools.

The `deslop` skill audits or applies evidence-backed subtractive cleanup for
accumulated test bloat, circular verification, defensive or fallback machinery,
and comment noise. It checks every comment in scope in each run, also when
tests or fallbacks take most of the work. Audit mode is read-only. An explicit cleanup request authorizes edits
within its scope; the literal `apply` command is optional.

The `final-check` skill asks: “What else have we missed? Is there anything we
need to check or fix?”

The `deepen` skill asks for a deeper version of a task, not a bigger one. It
names what a top professional would do that the request omits, the raw material
they would start from, their methods and tools, and the external check that
would prove the result right. It tests the beliefs in the request against raw
data and borrows methods from adjacent fields, but keeps the goal and the
deliverable. Then it rewrites the request to ask for exactly that.

The `elevate` skill aims a task at the outcome it serves instead of the
artifact it names. It asks what should happen next, picks the strongest lever
for that outcome, from a better decision up to a durable process tested against
history, and names the workflow changes the model needs. The rewritten request
proposes the new scope and waits for approval before doing more work.

The `ship` skill runs the whole recommended flow in one skill, from choosing
the target to the final check. It picks the optional stages, passes each
stage's result to the next, and keeps every stage's own approval points. It
keeps its state in a progress file under `.git/`, so it does not skip stages
and can continue after the context is compacted or in a new session. It records
the start commit, and treats all changes after it as the task's changes. It
runs the diff review and `final-check` in a subagent with a fresh context when
the host can. It writes documentation changes with `ste` and applies
`creator-vibe` as a lens when the work has a human experience to carry. It
collects the ideas outside the scope during the run, and at the end offers
them to `backlog` in one batch, or decides them itself when the user
delegated the decisions. It records each moment where the run struggled as a
friction entry, including the corrections and manual steps of the user, also
after the run ends. When there are entries, it runs `retro` before that batch,
and sends the candidates about skills to a skill feedback file outside the
repository. It loads the skill of each stage when the stage starts, and
records the diff review as its own entry, so that the review is not skipped.
It can also start from a backlog item. It is for non-trivial implementation.
It does not commit, push, or deploy, but at the end it asks whether to commit
and open a pull request.

The `retro` skill looks back on a session or a `ship` run and proposes changes
to the environment of the agent, so that the next run does not struggle in the
same place. Each candidate must point to a moment of the session or of a
past `ship` run, such as a friction entry, a failed check, or a correction
from the user. A mechanical
mistake gets an automated check, a judgement call gets a rule in the standards
document that the reviewer reads, and a long search gets a pointer. It reads
the last `ship` runs to find friction that repeats. Candidates about a skill
go to a separate list with the path of the skill file, not to the backlog of
the current repository; `ship` sends them to the skill feedback file
(`SKILL_FEEDBACK_FILE` or `~/.agents/skill-feedback.md`). In the source
repository of a skill, retro reads that file, counts the repeats, and
removes the lines that a done or dropped candidate covers. Under
`ship` it only adds candidates to the deferred ideas; on request, it does the
candidates that the user chooses.

The `backlog` skill keeps deferred ideas as one Markdown file per item under
`docs/backlog/`. Each item records why it matters, its evidence, the task that
found it, and why that task deferred it. An item is an option to return to,
not a commitment. A file that exists is an open item, and the change that does
or drops the idea deletes the file, so git history keeps the record. The skill
files only ideas that are worth a separate change and have concrete evidence,
adds new evidence to an existing item instead of creating a repeat, and asks
the user about each idea. It lists, briefs, and walks the items, and marks
undecided items that are older than 90 days. It does not commit or push.

The `grill` skill runs a dependency-aware interview that researches facts,
exhausts the current decision frontier round by round, sharpens domain language,
and records agreed terminology and durable architectural decisions. A round
asks at most three decisions that have no safe default, and lists the
reversible ones as defaults that the user can reject. It reads the rules of
the repository before it recommends an option.

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

The `visual-recap` skill turns a plan or completed non-trivial change into an
evidence-backed visual review aid. It helps a reviewer see the outcome, affected
system parts, risk, and the best place to inspect first. It adapts to the current
host agent, uses Mermaid for portable diagrams, and keeps an inline fallback.

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

The original skills and workflows that informed these portable versions came
from:

- [umputun/cc-thingz](https://github.com/umputun/cc-thingz)
- [anthropics/claude-code feature-dev plugin](https://github.com/anthropics/claude-plugins-official/tree/main/plugins/feature-dev)
- [mattpocock/skills grilling, domain-modeling, and retro skills](https://github.com/mattpocock/skills)
- [MrZoyo/deslop-GPT](https://github.com/MrZoyo/deslop-GPT/tree/main/skills/deslop)
- [danyuchn/asd-ste100-skill](https://github.com/danyuchn/asd-ste100-skill)
- [AminBlg/SimpleEnglish](https://github.com/AminBlg/SimpleEnglish/tree/main/skills/simple-english)
- [bish-x/creator-vibe](https://github.com/bish-x/creator-vibe)
- [Felix Rieseberg, How to Be More Ambitious](https://felixrieseberg.com/how-to-be-more-ambitious-a-tutorial-for-humans-with-models/)
- [kentcdodds/kcd-skills visual-recap](https://github.com/kentcdodds/kcd-skills/tree/main/skills/visual-recap)

## Usage

Skill command in Pi:

```text
/skill:feature-dev Add OAuth login with Google and GitHub
```

Natural language also works when Pi's skill matcher triggers:

```text
Use feature-dev to implement API rate limiting.
```

Audit accumulated complexity without editing files:

```text
/skill:deslop audit the current branch for test, verification, and fallback bloat.
```

Carry an incomplete creative brief into the work itself:

```text
/skill:creator-vibe Make this onboarding feel calm, capable, and unmistakably ours.
```

Create a visual review aid for a plan or completed change:

```text
/skill:visual-recap Show the architecture impact of the current change.
```

The files under `skills/*/SKILL.md` are portable Markdown and can be adapted for
other agent environments.

Run a final completeness check on the current work:

```text
/skill:final-check
```

Raise the depth of a task before starting it:

```text
/skill:deepen Analyze why churn grew last quarter.
```

Run the whole pipeline for one feature:

```text
/skill:ship Add usage-based billing to the invoices service.
```

Start the pipeline from a deferred idea:

```text
/skill:ship docs/backlog/export-ignores-time-zone.md
```

Learn from a hard session:

```text
/skill:retro
```

Review the deferred ideas, or defer a new one:

```text
/skill:backlog
/skill:backlog Add: the CSV export ignores the account time zone.
```

Aim a task at the outcome it should produce:

```text
/skill:elevate Prepare the quarterly business review.
```

Stress-test an idea before implementation:

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

## Recommended flow

The skills chain from choosing the target to cleaning up the result. Steps in
brackets are optional:

```text
[elevate] → grill → [deepen] → feature-dev → deslop → [final-check] → [retro]
```

- `elevate` comes first because it decides what to do. `grill` then settles
  that target; changing the goal after `grill` reopens its decisions.
- `deepen` comes after `grill` because it keeps the goal and deliverable fixed
  and only changes how the work is done. It needs a settled deliverable.
- `deepen` comes before `feature-dev` so that its external check, such as a
  test, a reproduction, or a reconciliation against source data, becomes the
  validation criterion for the implementation.
- `retro` comes last because it reviews how the run went, not the result.
  Skip it when the run was smooth.

Use `elevate` when:

- the task names an artifact or a one-off action and does not say what it is
  for, such as "fix this crash", "prepare the report", or "write an export
  script";
- the repository history, the tickets, or the conversation show the same kind
  of task before, which makes it a candidate for a process;
- the work feeds a meeting or a decision, such as a review, planning, or an
  incident analysis;
- `deepen` suggests changing the deliverable.

Skip `elevate` when the request already states the outcome and the
acceptance criteria, when a fixed deadline or scope must not grow, or when the
change is mechanical.

Use `deepen` when:

- the result depends on a claim that raw data can confirm or refute, such as
  the cause of a bug, a performance bottleneck, a metric, or the behavior of
  data in a migration;
- for some acceptance criterion, no concrete check that can decide it is
  named yet, such as a test to write, a reproduction, or a command;
- an acceptance criterion depends on data outside the repository.

Skip `deepen` when each acceptance criterion has a named concrete check and the
change follows an existing pattern in the repository.

To run the whole flow in one step, use `ship`. It applies these rules to choose
the optional stages and states each skipped stage with a reason. Ideas that
fall outside the scope go to `backlog` instead of growing the task, and a
later `ship` run can start from one of them.

## Feature-dev workflow

The `feature-dev` skill uses checkpoints that scale to the requested change:

1. Discovery — understand the feature and establish lightweight progress tracking
2. Codebase exploration — inspect relevant code and patterns, optionally with read-only helper passes
3. Clarifying questions — resolve material unknowns that discovery cannot answer
4. Architecture design — present two or three approaches with a recommendation when the change touches a public contract, data model, several modules, or a new abstraction
5. Implementation — complete the authorized scope with a single writer
6. Quality review — inspect the diff from correctness, validation, and maintainability perspectives
7. Validation and summary — run focused checks and summarize changes and key decisions

An implementation request includes the fixes and validation needed to finish
that scope. When the design step presents alternatives, the skill waits for the
user's choice unless the user asked to proceed without design approval. A
requested approval checkpoint still applies; design-only and review-only
requests do not authorize implementation.

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
    ├── backlog/
    │   ├── agents/openai.yaml
    │   └── SKILL.md
    ├── creator-vibe/
    │   ├── agents/openai.yaml
    │   └── SKILL.md
    ├── deepen/
    │   ├── agents/openai.yaml
    │   └── SKILL.md
    ├── deslop/
    │   ├── agents/openai.yaml
    │   ├── references/
    │   ├── LICENSE.txt
    │   └── SKILL.md
    ├── elevate/
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
    ├── retro/
    │   ├── agents/openai.yaml
    │   └── SKILL.md
    ├── ship/
    │   ├── agents/openai.yaml
    │   └── SKILL.md
    ├── ste/
    │   ├── agents/openai.yaml
    │   ├── references/
    │   │   ├── before-after.md
    │   │   ├── checklist.md
    │   │   ├── use-cases.md
    │   │   └── writing-rules.md
    │   ├── README.md
    │   └── SKILL.md
    └── visual-recap/
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

Validate the package shape, and check that no line in the skill files is
longer than 80 characters. The check skips the frontmatter, code blocks,
tables, and headings. CI runs the same command on each pull request:

```bash
npm test
```

Compare the packaged skills with their upstream originals. This project-local
skill lives in `.agents/skills/` and is not published:

```text
/skill:upstream-check
```

Then test in Pi without installing globally:

```bash
pi -e ~/Projects/pi-feature-dev
```
