---
name: deepen
description: Rewrite a task request into a deeper version that a top professional would do, from raw material, with real methods and external validation. Use when the user asks to deepen a task or raise its ambition; skip mechanical, fully specified, or purely creative work.
---

# Deepen

Make the task deeper, not bigger. Do not add scope, deliverables, or polish.
Change what the work starts from, how it is done, and how it is proven right.

## Inspect before answering

Ground every answer in the current environment. Check which data, artifacts,
tools, and access actually exist before you name them. Treat a discoverable
fact as your work, not a question for the user. Mark anything you could not
confirm as an assumption.

Describe what a professional does, not who they are. Do not role-play an
expert; persona framing changes the tone without improving the work.

## Answer four questions

1. **Missing practice.** What would a top professional in this field do here
   that the request does not ask for? Name the few steps that change the
   result, not a checklist of best practices.
2. **Raw material.** What is the rawest material they would start from, instead
   of the summaries, dashboards, tables, or tickets already digested for the
   user? Say where it lives and whether you can reach it now.
3. **Methods and tools.** Which specific methods and tools would they use? Name
   concrete techniques, commands, or libraries that fit this environment.
4. **External validation.** What, other than you or the user, would show the
   result is right? Prefer a check you can run yourself for fast feedback: a
   test, a held-out sample, a reproduction, a reconciliation against source
   data, a benchmark. Never let your own judgment be the only check.

## Rewrite the request

Rewrite the user's request so it asks for exactly that: the raw material, the
methods, and the validation criterion, with the original goal and constraints
intact. Keep it a prompt the user could send as is.

List blockers separately: missing data access, tools, credentials, or machines
that the deeper version needs. Do not quietly fall back to the shallow version
when a blocker exists.

Stop after the rewrite and wait for confirmation. If the user already asked you
to proceed, run the rewritten request instead, starting with the blockers you
can resolve yourself.

## Output

- The four answers, short and specific to this task.
- The rewritten request.
- Blockers, if any.
