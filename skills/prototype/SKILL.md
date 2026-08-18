---
name: prototype
description: Build disposable code to answer one product or engineering design question. Use when the user wants to validate logic, state transitions, a data model, or API behavior, or compare structurally different UI directions before production implementation. Adapt to the current repository and agent environment. Do not require a specific model, coding agent, tool, browser, task runner, version-control host, or issue tracker.
---

# Prototype

A prototype is **disposable code that answers one question**. The question determines the artifact.

## Pick a branch

Identify the question from the user's request and the surrounding code. Then read the matching branch before writing code:

- **"Does this logic or state model feel right?"** → [LOGIC.md](LOGIC.md). Build one shareable HTML file. Let a non-developer drive difficult cases with free-play actions and guided walkthroughs.
- **"What should this look like?"** → [UI.md](UI.md). Build several structurally different UI variants on one route. Make them switchable through a URL search parameter and a floating control.

The branches produce different artifacts. If the choice is genuinely ambiguous, ask one focused question. If interaction is unavailable, infer from the surrounding code: use Logic for a backend module and UI for a page or component. State the assumption in the prototype.

## Define success before coding

State these points before you edit files:

- the single question;
- the evidence that will answer it;
- the shortest way to run or open the artifact;
- the production boundary that the prototype must not cross.

Stop expanding the prototype when it can answer the question. Do not turn it into an alternative implementation project.

## Adapt to the current environment

- Follow project instructions, file layout, routing, framework, and styling conventions.
- Use only capabilities that the current agent environment provides.
- Open or render the prototype when a browser or preview tool is available. Otherwise, provide the exact file path, command, or route.
- Use the project's normal planning and progress mechanism when one exists. Otherwise, keep a short checklist in the conversation.
- Do not require Git, a hosted repository, an issue tracker, or an external service. Use them only when the current workflow already authorizes them.

## Rules that apply to both

1. **Mark it as disposable.** Put the prototype near the module or page it explores. Use `prototype` in the file, route, or directory name. Follow existing routing conventions.
2. **Make it easy to run.** Prefer one existing project command for a UI prototype. Make a logic prototype a self-contained HTML file when possible.
3. **Keep state in memory by default.** If the question requires persistence, use an isolated scratch store. Mark it clearly as disposable. Never use production data.
4. **Skip production polish.** Add only the error handling needed to keep the prototype runnable. Do not add speculative abstractions or production tests for the disposable shell.
5. **Expose relevant state.** After each logic action or UI variant switch, render the state that helps answer the question.
6. **Protect production behavior.** Keep real mutations and production data outside the experiment. If the prototype uses an existing route, gate all prototype rendering so production ignores it.
7. **Hand over an exact entry point.** Give the user the file path, command, route, and variant keys or scenarios. Open the artifact when the environment supports it.
8. **Record the answer.** Record the question, verdict, and evidence in the current workflow. Preserve the prototype on a temporary branch or other archive only when requested or already authorized. Keep the main branch focused on the validated production decision.
