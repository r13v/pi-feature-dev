# Before and After Examples

Use these original examples to recognize rewrite patterns. They illustrate the skill workflow.
They are not evidence that a word is approved in the official ASD-STE100 dictionary.

## Contents

- [Maintenance procedure](#maintenance-procedure)
- [Tool description](#tool-description)
- [Error message](#error-message)
- [Agent instruction](#agent-instruction)
- [Status report](#status-report)
- [Terminology consistency](#terminology-consistency)
- [Already clear text](#already-clear-text)

## Maintenance Procedure

**Before**

> Prior to carrying out removal of the filter housing, the technician should ensure that
> electrical power has been disconnected, and thereafter the retaining bolts should be taken
> off.

**Issues**

- Indirect instruction.
- Passive voice.
- Noun-heavy construction.
- More than one instruction in one sentence.

**After**

> Disconnect electrical power.
>
> Remove the retaining bolts.
>
> Remove the filter housing.

**Unresolved check:** Confirm that these steps have the correct sequence and that the project
glossary approves `retaining bolt` and `filter housing`.

## Tool Description

**Before**

> This tool is intended to facilitate the synchronization of configuration values across all of
> the services that have been selected.

**After**

> The tool synchronizes configuration values across the selected services.

**Why:** The revision identifies the actor and action directly. It removes a nominalization and a
passive construction.

## Error Message

**Before**

> The request could not be completed due to the fact that the credentials which were provided
> are no longer valid.

**After**

> The request failed because the credentials expired.

**Why:** The revision separates the result from the cause and removes indirect wording. Confirm
that expiration is the actual cause before using this message.

## Agent Instruction

**Before**

> Once the build has finished, the agent should inspect the report and then, if any failures have
> been identified, it should post a summary.

**After**

> Wait for the build to finish.
>
> Inspect the report.
>
> If the report shows failures, post a summary.

**Why:** The revision uses direct commands, simple verb forms, an explicit condition, and one
instruction per sentence.

## Status Report

**Before**

> We have successfully completed the database migration, which was performed after all of the
> validation checks had been carried out.

**After**

> We completed all validation checks. Then we migrated the database.

**Why:** The revision uses simple past tense and makes the sequence explicit. Keep `successfully`
only when it communicates a defined result that the text must preserve.

## Terminology Consistency

**Before**

> Check the connection. Verify the cable. Confirm the plug.

**Decision**

Do not replace these verbs automatically. First determine whether they describe one action or
three different actions.

**After, only if the intended action is identical**

> Check the connection. Check the cable. Check the plug.

**Why:** STE favors one term for one concept, but terminology consistency must not erase a real
technical distinction.

## Already Clear Text

**Input**

> Close the inlet valve. Disconnect the power cable.

**Result**

Keep the text unchanged if the terms are correct for the project.

**Why:** A rewrite is not an objective by itself. Change text only when the change improves
clarity, correctness, or compliance.
