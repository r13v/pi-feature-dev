# Portable Agent Skills

This context describes the language for skills that can be used across different coding assistant environments.

## Language

**Skill**:
A reusable workflow instruction package that helps an agent perform a bounded kind of work.
_Avoid_: command, script, plugin

**Host Agent**:
The coding assistant environment currently interpreting and executing a **Skill**.
_Avoid_: platform, runtime, adapter target

**Portable Skill**:
A **Skill** written in terms of workflow intent and host capabilities rather than one host agent's private tools.
_Avoid_: adapter-based skill, Claude-specific skill

**Capability**:
A named action a **Host Agent** may provide to satisfy or enhance a workflow.
_Avoid_: tool name, private API

**Required Capability**:
A **Capability** that a **Host Agent** must provide for a specific **Portable Skill** to run.
_Avoid_: optional feature, fallback path

**Isolated Worker**:
A fresh-context executor with repository access and task-scoped execution authority.
_Avoid_: helper, reviewer, chat thread

**Task Commit**:
A version-control checkpoint that records one completed task section or review-fix pass.
_Avoid_: dirty diff, batch commit, save point

**Git Project**:
A repository managed by Git and eligible for `plan-exec`.
_Avoid_: VCS project, Mercurial project, generic repository

**In-Place Execution**:
A `plan-exec` run that happens in the current Git checkout without creating a Git worktree.
_Avoid_: worktree execution, isolated checkout

**Bundled Prompt Set**:
The prompt and reviewer instructions shipped inside `plan-exec` itself.
_Avoid_: project override, user override, prompt overlay

**Host Instructions**:
The ambient rules supplied by the current host agent, user, and repository.
_Avoid_: custom rules file, planning-rules override

**Internal Review**:
A review performed by **Isolated Workers** within the current **Host Agent**.
_Avoid_: external review, codex review, adversarial CLI review

**Portable Run Summary**:
A best-effort completion report derived from the plan file, progress file, and Git state.
_Avoid_: host telemetry, Claude logs, token accounting

## Relationships

- A **Host Agent** executes one or more **Skills**.
- A **Portable Skill** can run in multiple **Host Agents**.
- A **Portable Skill** may declare **Required Capabilities**.
- A **Host Agent** that lacks a **Required Capability** must stop rather than silently degrade the workflow.
- `plan-exec` requires **Isolated Workers** for implementation and review work.
- `plan-exec` runs only in a **Git Project**.
- `plan-exec` uses **In-Place Execution** and must not create Git worktrees.
- `plan-exec` requires each implementation or fix pass to end in a Git-backed **Task Commit**.
- `plan-exec` uses its **Bundled Prompt Set** directly and does not support prompt override chains.
- `plan-exec` follows **Host Instructions** but does not load its own custom rules files.
- `plan-exec` uses **Internal Review** only and does not run external review tools.
- `plan-exec` ends with a **Portable Run Summary**, not host-specific telemetry.

## Example dialogue

> **Dev:** "Should this skill call a specific subagent tool?"
> **Domain expert:** "No. A **Portable Skill** should declare an **Isolated Worker** requirement and let the **Host Agent** map that to its own execution mechanism."

## Flagged ambiguities

- "Adapter" was considered as a way to support multiple agents, but the resolved direction is a **Portable Skill** with declared **Capabilities**, not separate per-agent adapters.
- "Portable" does not mean every **Host Agent** can run every **Portable Skill**; `plan-exec` is portable across host agents that provide its **Required Capabilities**.
- "Portable" applies across **Host Agents**, not across version-control systems; `plan-exec` is Git-only.
- "Isolation" in `plan-exec` means **Isolated Workers**, not Git worktrees; worktrees are explicitly out of scope.
- "Override" was rejected for `plan-exec`; bundled prompts are the only prompt source.
- "Custom rules" was rejected as a separate `plan-exec` extension point; ordinary **Host Instructions** still apply.
- "External review" was rejected for `plan-exec`; all review phases are **Internal Review** phases.
- "Stats" means **Portable Run Summary** for `plan-exec`, not token, duration, or host log accounting.
