# UI Prototype

Generate **several structurally different UI variants** on one route. Let the user switch variants with a floating bottom control. The user can choose one direction or combine specific parts, then discard the experiment.

If the question is about logic/state rather than what something looks like — wrong branch. Use [LOGIC.md](LOGIC.md).

## When this is the right shape

- "What should this page look like?"
- "I want to see a few options for this dashboard before committing."
- "Try a different layout for the settings screen."
- Any time the user would otherwise spend a day picking between three vague mockups in their head.

## Choose the host shape

A UI prototype is easier to judge beside the real application shell, data shape, and information density. Prefer an existing host page. Create a new route only when no suitable page exists.

### Sub-shape A — adjustment to an existing page (preferred)

The route already exists. Render variants **on the same route** behind a `?variant=` URL search parameter. Keep existing parameters and authorization. Use approved non-production data or representative fixtures. Change only the rendered subtree.

If the prototype is for something that doesn't yet have a page but *would naturally live inside one* (a new section of the dashboard, a new card on the settings screen, a new step in an existing flow) — that's still sub-shape A. Mount the variants inside the host page.

### Sub-shape B — a new page (last resort)

Only use this when the thing being prototyped genuinely has no existing page to live inside — e.g. an entirely new top-level surface, or a flow that can't be embedded anywhere sensible.

Create a **disposable route** with the project's routing convention. Do not invent a new top-level structure. Include `prototype` in the path or file name. Use the same `?variant=` pattern.

Before committing to sub-shape B, sanity-check: is there really no existing page this could be embedded in? An empty route hides design problems that a populated one would expose.

In both sub-shapes the floating bottom bar is identical.

## Process

### 1. State the question and pick N

Default to **3 variants**. More than 5 stops being radically different and starts being noise — cap there.

Write the question and plan in one line near the prototype or in a top-of-file comment:

> "Three variants of the settings page, switchable via `?variant=`, on the existing `/settings` route."

Also state what difference the user should compare between the variants.

### 2. Generate radically different variants

Draft each variant. Hold each one to:

- The page's purpose and the data it has access to.
- The project's component library / styling system (TailwindCSS, shadcn, MUI, plain CSS, whatever).
- A clear exported component name, e.g. `VariantA`, `VariantB`, `VariantC`.

Variants must be **structurally different** — different layout, different information hierarchy, different primary affordance, not just different colors. Three slightly-tweaked card grids isn't a UI prototype, it's wallpaper. If two drafts come out too similar, redo one with explicit "do not use a card grid" guidance.

### 3. Wire them together

Create a single switcher component on the route:

```tsx
// pseudo-code — adapt to the project's framework
const variant = searchParams.get('variant') ?? 'A';
return (
  <>
    {variant === 'A' && <VariantA {...data} />}
    {variant === 'B' && <VariantB {...data} />}
    {variant === 'C' && <VariantC {...data} />}
    <PrototypeSwitcher variants={['A','B','C']} current={variant} />
  </>
);
```

For sub-shape A (existing page): keep approved non-production data fetching above the switcher. Change only the rendered subtree.

For sub-shape B (new page): the disposable route under `/prototype/<name>` mounts the same switcher.

### 4. Build the floating switcher

A small fixed-position bar at the bottom-center of the screen with three pieces:

- **Left arrow** — cycles to the previous variant (wraps around).
- **Variant label** — shows the current variant key and, if the variant exports a name, that name too. e.g. `B — Sidebar layout`.
- **Right arrow** — cycles forward (wraps around).

Behavior:

- Clicking an arrow updates the URL search param (use the framework's router — `router.replace` on Next, `navigate` on React Router, etc) so the variant is shareable and reload-stable.
- Keyboard: `←` and `→` arrow keys also cycle. Don't intercept arrow keys when an `<input>`, `<textarea>`, or `[contenteditable]` is focused.
- Visually distinct from the page (e.g. high-contrast pill, subtle shadow) so it's obviously not part of the design being evaluated.
- Disable the complete prototype path in production. Use the project's existing development or feature guard. The production route must ignore the variant parameter.

Keep the switcher close to the prototype. Reuse an existing prototype control when one exists. Do not add a shared abstraction for one experiment.

### 5. Verify and hand it over

Run the project's focused build, type check, or route check when one is available. Open every variant when preview tools are available. Confirm that the URL preserves the selection and that keyboard controls do not intercept text input.

Give the user the command, route, and `?variant=` keys. If the current environment cannot open the UI, say so and provide the exact manual steps.

### 6. Capture the answer and clean up

When a variant wins, record which parts won and why. Then follow the capture rules in [SKILL.md](SKILL.md). Implement the decision under normal production standards. Remove the prototype from the main branch when the current workflow authorizes cleanup:

- **Sub-shape A** — fold the winner into the existing page; drop the losing variants and the switcher from main.
- **Sub-shape B** — promote the winning variant to a real route; drop the disposable route and the switcher from main.

If the current workflow preserves prototypes, archive the full variant set outside the main branch. Otherwise, ask before deleting the files. Do not leave losing variants or the switcher in production code.

## Anti-patterns

- **Variants that differ only in color or copy.** That's a tweak, not a prototype. Real variants disagree about structure.
- **Sharing too much code between variants.** A shared `<Header>` is fine; a shared `<Layout>` defeats the point. Each variant should be free to throw out the layout.
- **Wiring variants to real mutations.** Read-only prototypes are fine. If a variant needs to mutate, point it at a stub — the question is "what should this look like", not "does the backend work".
- **Promoting the prototype directly to production.** The variant code was written under prototype constraints (no tests, minimal error handling). Rewrite it properly when you fold it in.
