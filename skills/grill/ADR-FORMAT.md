# ADR Format

Store an ADR in the `docs/adr/` directory owned by the applicable context. Use root `docs/adr/` for a system-wide decision. Create the directory lazily when the first ADR is accepted.

Use sequential filenames such as `0001-event-sourced-orders.md` and `0002-postgres-for-write-model.md`. Scan the target directory for the highest existing number and increment it by one.

## Template

```md
# {Short title of the decision}

{In one to three sentences, state the context, the decision, and why it was chosen.}
```

That is enough for most ADRs. Record that a decision was made and why; do not fill sections for ceremony.

## Optional sections

Include a section only when it adds information a future reader needs:

- `status` frontmatter (`proposed`, `accepted`, `deprecated`, or `superseded by ADR-NNNN`) when the decision may be revisited.
- **Considered Options** when rejected alternatives are worth remembering.
- **Consequences** when non-obvious downstream effects need to be explicit.

## Qualification test

Create an ADR only when all three statements are true:

1. Reversing the decision later would be meaningfully costly.
2. A future reader would find the choice surprising without its context.
3. The decision resolved a real trade-off among genuine alternatives.

Qualifying decisions commonly include architectural shape, cross-context integration, lock-in-heavy technology choices, ownership boundaries, deliberate deviations from the obvious path, constraints invisible in code, and non-obvious rejected alternatives.

Skip easy-to-reverse choices, obvious implementation details, and decisions with no real alternative.
