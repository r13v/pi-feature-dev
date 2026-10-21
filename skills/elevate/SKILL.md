---
name: elevate
description: Rewrite a task request around the outcome it serves instead of the artifact it names, and propose the strongest lever for that outcome, from a better decision up to a durable process tested against history. Use when the user asks to elevate a task, to aim at the outcome, or to ask what should happen next; skip mechanical, fully specified, or purely creative work. To keep the goal and raise the quality of execution, use deepen.
---

# Elevate

Aim the task at the outcome, not the artifact. Ask what the user wants to
happen after the task is done, and rewrite the request to serve that.
Elevating changes scope on purpose, so propose the change and do not take it:
the rewritten request is a proposal, not permission to do more work.

## Inspect before answering

Ground every answer in the current environment. Check which data, artifacts,
tools, and access actually exist before you name them. Treat a discoverable
fact as your work, not a question for the user. Mark anything you could not
confirm as an assumption.

Keep the user's constraints: deadline, budget, audience, systems they may not
touch, and anything they said is out of scope. Elevating changes the target,
not these limits.

## Answer four questions

1. **Outcome.** What should happen after this task is done? Name the outcome
   in measurable terms, such as "releases ship without new crashes" instead of
   "fix this crash", or "the team decides what to cut" instead of "prepare the
   quarterly review".
2. **Lever.** What is the strongest lever for that outcome? Climb only as far
   as the task justifies:
   - a better answer: what changed, why, and what to do about it;
   - the decisions it forces: the most urgent ones, with the case for and
     against each;
   - the process that produces the task: a redesign or a workflow that keeps
     the outcome true with less human work.
   A one-off task may stop at the first step. Do not propose automation only
   because it is possible.
3. **Workflow change.** What must change in how the user works for the model
   to reach that lever? Name the access it needs, such as crash reports, a
   map from versions to commits, raw business data, or machines to reproduce
   and verify fixes.
4. **Validation.** How will you know the new target is met, other than by your
   judgment or the user's? For a process, test it against past history first,
   then run it beside the current one and compare. For a decision, name the
   signal that would show it was right or wrong.

## Rewrite the request

Rewrite the user's request so it asks for the outcome, the chosen lever, and
the validation, with the user's constraints intact. Keep it a prompt the user
could send as is. State in one line how the scope differs from the original
request.

List blockers separately: the workflow changes, data access, tools,
credentials, or machines that the elevated version needs. Do not quietly fall
back to the original task when a blocker exists.

Stop after the rewrite and wait for confirmation, even if the user asked you to
proceed with the original task: their approval of the task does not cover the
new scope. If the user explicitly approved the elevated version, run it,
starting with the blockers you can resolve yourself.

## Output

- The four answers, short and specific to this task.
- The scope change in one line.
- The rewritten request.
- Blockers, if any.
