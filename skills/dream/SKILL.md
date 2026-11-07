---
name: dream
description: Review the agent memory of a project offline. Check each memory note against the past sessions, the code, and git; correct or delete wrong and stale notes; turn repeated corrections into notes; keep the index small. Use when the user asks to dream, or to review, clean up, or consolidate the memory of the agent; skip during a task.
---

# Dream

Memory exists so that the next session starts with what it cannot see by
itself: the decisions of the user, the corrections, the traps, and why they
exist. A note that the code, git, or the docs already show is noise. A wrong
note is worse than no note, because the agent reads it in every session.
Dream keeps memory correct and small. It does not do the task of the project.

## Sources

The past sessions are the ground truth for what happened. The code and git
are the ground truth for what is true now. A note is not evidence.

- **Memory notes:** the memory directory that the user or the host names,
  such as the auto-memory directory of the host, with its index file. If no
  memory directory exists, say so and stop.
- **Sessions:** the transcripts of the past sessions of this project. Use a
  session search tool if the host has one, such as `deja`. Otherwise read the
  transcripts that the host keeps on disk, or the directory that the user
  names. Default window: 7 days, or the window that the user gives. If no
  transcripts are available, check the notes against the code and git only,
  and say so.
- **Steering and docs:** the steering files, such as `AGENTS.md` or
  `CLAUDE.md`, the glossary, and the docs of the repository. Read them to
  find duplicates and the owner of a rule.

## Steps

1. **Check each note.** For each memory file, find the evidence: a session,
   a file, or a commit. Give the note one verdict:
   - *correct*: keep it;
   - *wrong*: the sessions or the code contradict it. Correct it, and quote
     the evidence;
   - *stale*: the cause is gone, such as a removed file, flag, or tool.
     Delete it;
   - *duplicate*: another note, the repository, or the docs already say it.
     Delete it, or merge it into the owner;
   - *unverified*: no evidence for or against. Keep it, and say so.
2. **Find what repeats.** In the sessions of the window, find a correction
   that the user gave two or more times, and a fact that the agent searched
   for long or asked the user again. Each one is a candidate for a new note,
   with the moments as its evidence. Drop a candidate that does not point to
   a moment.
3. **Put each fact on its level.**
   - The index file has one line for each note, and nothing more. Move
     details into the note files.
   - A personal preference or a correction from the user belongs in memory.
   - A rule of the project for all agents, a check, or a pointer belongs in
     the repository, not in memory. Give these candidates to the `retro`
     skill, or list them for the user. Do not change repository files.
   - Write one file for each subject. Several agents can write memory, and
     one shared file loses facts when they overwrite each other.
4. **Check the recall of the search tool.** If the session search tool puts
   past sessions into new sessions, find the sessions that it put in but that
   did not match the work. Propose to remove them from its index. Do not
   remove them without the choice of the user.
5. **Report and apply.** Show a table: note or candidate, verdict, evidence,
   and action. Ask which actions to do. When the user delegates the
   decisions, apply the memory edits that have evidence.

## Writing a note

- State the fact. Then give **Why:** with the moment that taught it, and
  **How to apply:**.
- Mark a fact that no session or file confirms as unconfirmed.
- Write what the next session needs, not a log of what happened.

If the memory is correct and nothing repeats, say so and change nothing.
