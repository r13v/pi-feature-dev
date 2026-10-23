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

**Host Instructions**:
The ambient rules supplied by the current host agent, user, and repository.
_Avoid_: custom rules file

**Backlog Item**:
A deferred idea with its reason and evidence, kept as a file under `docs/backlog/`. It is an option to return to, not a commitment to do the work.
_Avoid_: ticket, task, TODO

**Friction Entry**:
A line in a `ship` progress file that records a moment where the run struggled, with its evidence. The `retro` skill uses these lines to find improvements to the environment of the agent.
_Avoid_: issue, struggle, problem

## Relationships

- A **Host Agent** executes one or more **Skills**.
- A **Portable Skill** can run in multiple **Host Agents**.
- A **Portable Skill** may declare **Required Capabilities**.
- A **Host Agent** that lacks a **Required Capability** must stop rather than silently degrade the workflow.

## Example dialogue

> **Dev:** "Should this skill call a specific subagent tool?"
> **Domain expert:** "No. A **Portable Skill** should declare a **Required Capability** and let the **Host Agent** map that to its own execution mechanism."

## Flagged ambiguities

- "Adapter" was considered as a way to support multiple agents, but the resolved direction is a **Portable Skill** with declared **Capabilities**, not separate per-agent adapters.
