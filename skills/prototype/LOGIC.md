# Logic Prototype

A single, self-contained HTML file — a **shareable demo** — that lets anyone drive a state model by clicking buttons. Use this when the question is about **business logic, state transitions, or data shape** — the kind of thing that looks reasonable on paper but only feels wrong once you push it through real cases.

Because the file has nothing to install, a designer, product manager, or domain expert can drive it directly. Use domain language, not implementation language.

## When this is the right shape

- "I'm not sure if this state machine handles the edge case where X then Y."
- "Does this data model actually let me represent the case where..."
- "I want to feel out what the API should look like before writing it."
- Anything where someone wants to **press buttons and watch state change**.

If the question is "what should this look like" — wrong branch. Use [UI.md](UI.md).

## Process

### 1. State the question

Before writing code, identify the state model, the question, and the evidence that will answer it. Put this information in a visible introduction, not only in a comment. A returning user must be able to understand the experiment without the earlier conversation.

### 2. Isolate the logic in a portable module

Put the logic that answers the question in one `<script>` block. Keep it in a small, pure module. The page is disposable. Treat the module as evidence for a later production implementation, not as production-ready code.

The right shape depends on the question:

- **A pure reducer** — `(state, action) => state`. Good when actions are discrete events and state is a single value.
- **A state machine** — explicit states and transitions. Good when "which actions are even legal right now" is part of the question.
- **A small set of pure functions** over a plain data type. Good when there's no implicit current state — just transformations.
- **A class or module with a clear method surface** when the logic genuinely owns ongoing internal state.

Pick the shape that fits the question. Do not pick a shape only because it is easy to connect to the page. Keep the logic independent of the DOM: the page calls the logic, and the logic never calls the page. Reimplement or harden validated logic under the production project's normal standards.

### 3. Build the shareable HTML file

One file, plain HTML/CSS/JS — no framework, no bundler, no server, everything inline so it opens by double-click and survives being emailed around. Anyone should be able to run it by opening it.

Write it for a non-developer. Every label is in **domain language**, not code — buttons and state read like the business, not the reducer. Explain in plain words what's happening.

Lay it out with a clean hierarchy, top to bottom:

1. **Title and one-line explanation** of what this demo lets you explore (the question from step 1).
2. **Current state** — the full relevant state, rendered as a readable panel (labeled fields, not a raw JSON dump), re-rendered after every click so the change is visible. Where it helps a non-developer follow, call out what just changed.
3. **Free-play buttons** — one button per action, always available, so anyone can poke at the model in any order. Each click dispatches its action and re-renders the state.
4. **Guided walkthroughs** — a set of **scenarios**, one per tab. Each tab holds a short plain-language description of the scenario — the situation it sets up and what to watch for — and underneath it, the ordered **buttons to press** for that scenario. Each step is a real button: clicking it performs that action and moves to the next step. Starting a walkthrough resets to a known initial state so the scenario runs the same way every time.

Choose scenarios that demonstrate the awkward cases — the happy path, a tricky edge case, an attempt at something that should be illegal — the ones hard to reason about on paper.

Keep it beautiful but restrained: clean typography, generous spacing, one accent color. No animations, no gimmicks — nothing that competes with the state and the buttons.

### 4. Verify the prototype

Open the file when the current environment supports local previews. Otherwise, provide its exact path and tell the user to open it in a browser.

Run the happy path, one difficult edge case, and one illegal or rejected action. Confirm that each action updates the visible state. Confirm that reopening the file resets the state.

### 5. Hand it over

Give the user the file and name the walkthroughs. Invite feedback about impossible states, surprising transitions, and missing actions. Add a scenario only when it helps answer the original question.

### 6. Capture the answer and the prototype

When the prototype answers its question, record the verdict and evidence as [SKILL.md](SKILL.md) describes. Use the validated reducer, machine, or function set as input to the production implementation. Do not promote the HTML shell directly.

## Anti-patterns

- **Don't add a production test suite to the disposable shell.** Validate it by running the scenarios that answer the question.
- **Don't wire it to the real database.** Use in-memory state unless the question is specifically about persistence.
- **Don't generalize.** No "what if we wanted to support X later." The prototype answers one question.
- **Don't blur the logic and the page together.** If the pure module references the DOM, `document`, or button handlers, it's no longer liftable. Keep the page as a thin shell over a pure module.
- **Don't reach for a framework, bundler, or server.** One file the recipient double-clicks; a React app or a dev server defeats "shareable".
- **Don't ship the HTML shell into production.** The page is optimized for manual exploration. Carry the validated decision into production code and tests.
