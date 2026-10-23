---
name: retro
description: Look back on a session or a `ship` run and propose changes to the environment of the agent, such as checks, pointers, and review rules, so that the next run does not struggle in the same place. Use when the user asks for a retro or a retrospective, or when `ship` calls it after a run with friction entries; skip smooth sessions.
---

# Retro

Find the moments where a session struggled, and propose changes to the
environment of the agent that prevent them next time. The environment is
everything that the agent reads or runs: checks, pointers to files, review
rules, steering files, tools, and access to information. Retro does not fix
the code of the task, and it does not change anything that the user did not
choose.

## Evidence

Each candidate must point to one moment of this session or of a past run: a
friction entry, a failed command, a finding, or a correction from the user.
Drop a candidate that you cannot trace to such a moment, even when it is good
general advice. Two candidates are exceptions: a repository with no guardrail,
and a check to remove. The sections below describe them.

If no moment is left to learn from, say so and give no candidates. Do not
invent candidates to fill the categories.

Read these sources:

- the current session;
- the progress file of the `ship` run, if there is one. Its `Friction`
  section has one friction entry for each moment where the run struggled. The
  `ship` skill describes the format of the entries;
- the last 10 progress files that have `status: finished` and a `Friction`
  section, sorted by `started`, from all branches and worktrees. They are in
  the `ship` directory inside the directory that `git rev-parse
  --path-format=absolute --git-common-dir` prints. If the directory does not
  exist or this is not a git repository, skip this source. Use these files to
  find friction that repeats across runs.

## Categories

Sort each candidate into one category. The category tells where the fix goes.

- **Navigation.** The agent searched long for a file or a fact. Add a pointer
  to it from a file that the agent already reads.
- **Automated checks.** The agent made a mistake that a tool could catch. Add
  a lint rule, a type, a test, a pre-commit hook, or a CI job. First read the
  check commands and the CI workflows of the repository. If a check exists but
  does not run, the fix is to connect it. If the repository has no guardrail,
  that is no pre-commit hook and no CI job that runs its checks, report this
  as a candidate.
- **Review rules.** The diff review missed a mistake, or found the same kind
  of mistake again. A confirmed final-check finding means that the diff
  review missed it. A failed check that caught a mistake needs no candidate,
  unless the failure repeats or cost much time. Classify the mistake first:
  - A mechanical mistake, such as a banned API, an import shape, or a file in
    the wrong place, gets an automated check, not a rule in text.
  - A judgement call, such as consistency across files or the style of the
    surrounding code, gets a rule in the standards document of the
    repository, such as `CONTRIBUTING.md`. If the repository has no such
    document, propose to create `CODING_STANDARDS.md`. The reviewer reads this
    document. Do not put the rule in `AGENTS.md` or `CLAUDE.md`.
- **Steering files.** `AGENTS.md`, `CLAUDE.md`, or a similar file is large.
  Move its rules to the standards document or to a check, and keep pointers.
- **Tool economy.** A tool call cost much for what it returned. Make the call
  narrower, or replace the tool.
- **No-ops.** A line in a steering file does not change what the agent does.
  Delete it.
- **Information access.** The agent needed information that it could not
  get. Give it access, such as a log file of the dev server or read-only
  access to a service.

## Severity

Sort the candidates from the most severe. A candidate is more severe when:

- the friction repeats in two or more runs;
- the mistake reached the review or the user, not only a failed check;
- the friction cost much time or many tool calls.

If a check that an earlier run added has not failed in the later runs, and
the cause behind it is gone, propose to remove the check.

## Candidates about skills

If the friction came from the instructions of a skill, such as a step of
`ship` or `feature-dev`, put the candidate in a separate list. Give the path
of the skill file and the moment. Do not add these candidates to the backlog
of the current repository, because the skill lives in another repository.
If the current repository is the source of the skill, treat the candidate as
any other candidate.

## Modes

### Under `ship`

`ship` calls retro when its progress file has friction entries. Do not
change files in the working tree. Write only to the progress file. Add each
candidate as one line to the `Deferred ideas` section. Start the line with
`retro:`, then give the category, the fix, and the moment. Add each candidate
about skills in the same way, but start the line with `retro-skill:`.

### On request

When the user asks for a retro, review the current session, or the session
that the user names. If the host does not give access to that session, say
so and stop. Show the candidates from the most severe, with the category, the
moment, and the proposed fix. Show the candidates about skills
as a separate list. Ask the user which candidates to do now. Offer a
candidate about skills only when the current repository is the source of the
skill. Do the chosen
candidates, and run the checks that they affect. Offer to give the other
candidates to the `add` mode of the `backlog` skill. Run that mode as if the
user asked for it, so that its rule for the default branch applies.

## Writing

Write each new or changed rule, pointer, and standards text with the `ste`
skill in clarity mode.
