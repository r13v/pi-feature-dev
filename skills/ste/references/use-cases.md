# Text-Type Patterns

Use these patterns when the source does not already have a required structure. They describe
useful information order, not additional ASD-STE100 rules. Preserve the user's requested format
and all protected literals.

## Procedure or Runbook

Present information in this order:

1. Prerequisite conditions and applicable safety instructions.
2. One command for each independent action.
3. Expected result, when the reader must verify it.
4. Recovery or escalation action, when the source supplies one.

Do not move a command into a note. Do not invent missing steps or sequence.

## Error Message

Include only the fields that are known:

1. What failed.
2. Why it failed.
3. What effect the failure has.
4. What the user can do next.
5. A stable identifier or context value.

Separate facts from possible causes. Preserve quoted system messages, codes, paths, and
identifiers unless the user asks to rewrite those exact values.

## API or Tool Documentation

Present:

1. The operation and its purpose.
2. Required inputs and prerequisites.
3. Constraints and defaults.
4. The result.
5. Errors and recovery actions.
6. A minimal example when it adds necessary clarity.

Keep API names, parameter names, commands, flags, code, and protocol terms unchanged.

## Prompt or Agent Instruction

State:

1. The objective.
2. The scope and supplied inputs.
3. Required actions and decision conditions.
4. Constraints and protected content.
5. The expected output.
6. Stop, escalation, or uncertainty behavior when it matters.

Make ownership explicit when more than one agent or tool can act.

## Status or Incident Report

Separate:

1. Observed facts.
2. User or system impact.
3. Confirmed cause and unconfirmed hypotheses.
4. Completed and current actions.
5. Next action, owner, or checkpoint when provided.

Use time references that are unambiguous in the target context. Do not present a hypothesis as a
fact.

## Release Note, Commit, or Pull Request

State:

1. What changed.
2. Why it changed or what user-visible effect it has.
3. What component or audience it affects.
4. How the change was verified.
5. Known limitations or required user actions.

Do not add promotional claims to a technical summary.

## Support or UI Text

Name the problem or action directly. Use the same terms that the interface uses. Give the next
action before secondary explanation when the reader must act.

Treat exact UI labels, control names, placeholders, and external error text as protected literals
unless the task explicitly targets them for revision.

## Translation-ready Text

Use self-contained sentences and stable sentence boundaries. Repeat terminology instead of
rotating synonyms. Make conditions, negation, quantities, units, and references explicit.

Preserve placeholders, markup, segmentation controls, and variables exactly.
