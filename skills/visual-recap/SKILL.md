---
name: visual-recap
description: Create evidence-backed visual recaps of planned or completed non-trivial changes. Use after planning or completing non-trivial work when a visual review aid would reduce review effort, or when the user asks for a visual recap, visual plan, change map, system overview, architecture impact, before/after view, or scannable review aid. Adapt the result to the current Host Agent without requiring a specific tool, service, version-control host, or output format.
---

# Visual Recap

Help a reviewer understand a non-trivial change and choose where to inspect first.

A useful recap answers these questions in less than one minute:

- What outcome changes?
- Which system parts and relationships are affected?
- What path should the reviewer trace?
- Where is the risk or evidence gap?

The recap supplements the plan, source, change set, and normal review. It does not replace them.

## Choose the Mode

- **Plan**: Show intended work against the current system. Label assumptions, open decisions, and unverified paths.
- **Recap**: Show what the current change set does. Rebuild the recap from current evidence.

State the mode. If a plan and an implementation both exist, use Recap. Add a short plan-versus-actual view only when they differ.

## Ground the Recap

Use the smallest sufficient set of project evidence:

1. Follow the instructions and context that the **Host Agent** already supplied.
2. Look for project-local `CONTEXT-MAP.md` and `CONTEXT.md` files. Use `CONTEXT-MAP.md` for bounded-context locations and relationships. Use the relevant `CONTEXT.md` files for canonical domain terms. Link to each file that informed the recap.
3. Use existing architecture documents, diagrams, ownership maps, and decision records when they cover the affected area.
4. In Plan mode, inspect the current implementation and the proposed plan or requirements.
5. In Recap mode, inspect the actual change set, affected source, and validation results. Use a source-control comparison when available, but do not require one version-control system.

A `CONTEXT.md` glossary supplies language, not architecture or path ownership. Do not create or update context files for this recap.

Use session memory to find evidence, not to prove a claim. Label facts when the distinction matters:

- **documented**: defined by canonical project material;
- **observed**: present in the current implementation or change set;
- **planned**: intended but not implemented;
- **inferred**: derived from source boundaries or behavior;
- **unknown**: not verified.

## Tell the Review Story

1. Start with the user or system outcome. Do not start with a file list.
2. Choose affected units at one useful altitude. Use bounded contexts, surfaces, services, modules, data stores, or the project's own vocabulary.
3. Show the shortest path that explains the change. Include only affected units and the immediate neighbors needed for context.
4. Rank one to three review hotspots. Point to the edge, invariant, contract, or evidence gap that needs attention.
5. Attach compact evidence to each important claim.

If no architecture map exists, infer a local map from the source. Label the map as inferred. Do not present it as a permanent project taxonomy.

Mark the change shape for each affected unit:

- **uses**: Connects or configures existing behavior without changing its contract.
- **changes**: Changes behavior, state, shape, or a contract.
- **adds/removes**: Creates or removes a meaningful boundary, capability, data shape, or external surface.

Assess risk separately from change shape. Risk tells the reviewer how much attention the change needs.

| Risk | Use when |
|---|---|
| **Low** | The change is bounded and reversible. It changes no known contract or invariant. Validation is strong. |
| **Medium** | The change alters behavior or an internal contract in a bounded area, or validation has a meaningful gap. |
| **High** | The change affects security, privacy, persisted data, public compatibility, critical invariants, concurrency, or broad cross-system behavior. Also use High when a large blast radius has weak evidence. |

State why the overall risk has that level. A new unit is not automatically high risk. A small authentication or data edit is not automatically low risk.

## Choose the Smallest Useful Visual

Match the visual to the review question:

- Use a Mermaid flowchart for relationships and blast radius.
- Use a Mermaid sequence or state diagram for behavior that crosses several steps or states.
- Use a table for exact mappings or classifications.
- Use a side-by-side view for before and after.
- Use interaction only when it helps the reviewer trace a path, inspect evidence, or compare states.

Skip the diagram when one obvious relationship or a short table explains the change better.

Use Mermaid as the default portable diagram format. It is an output representation, not a required tool. Let the current **Host Agent** render it with its native interface. Use a richer interactive surface only when it saves review effort.

If the current interface does not render Mermaid, use a compact ASCII-art diagram as the first fallback. Use a Markdown table and short relationship list only when ASCII would be harder to scan or cannot express the relationship clearly.

Do not require or name a product-specific tool. Do not add a dependency, deployment, or standalone application only to render the recap.

Always provide a concise inline summary. It must preserve the outcome, affected units, risk, review hotspots, and evidence links.

## Compose the Result

Include:

1. **Headline**: mode, scope, outcome, overall risk, and the reason for that risk.
2. **Impact view**: affected units, change shape, and the path between them.
3. **Review first**: one to three ranked hotspots.
4. **Evidence**: links or pointers to relevant context, source, documents, comparisons, and checks.
5. **Gaps**: planned, inferred, unknown, or unverified claims that could change the conclusion.

Add a change flow, before-and-after view, plan-versus-actual view, or open decisions only when it reduces review effort.

Keep the overview on one screen when possible. Put supporting detail behind expansion or below the overview. Use direct labels. Do not rely on color alone. Do not include empty sections or the whole system graph.

## Deliver and Update

Present the recap in the current conversation by default. Save it to a plan, document, change request, or other artifact only when the user asks or the current workflow defines that destination.

When a recap already exists, revise it instead of adding a conflicting copy. Preserve unrelated content.

Before delivery, confirm that the recap tells the reviewer what to inspect first and why. If the visual does not reduce review effort, simplify it.
