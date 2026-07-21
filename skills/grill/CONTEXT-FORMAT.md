# `CONTEXT.md` Format

Use `CONTEXT.md` as an opinionated domain glossary and nothing else.

## Structure

```md
# {Context Name}

{One or two sentences describing what this context is and why it exists.}

## Language

**Order**: {A one- or two-sentence definition of the term.}
_Avoid_: Purchase, transaction

**Invoice**: A request for payment sent to a customer after delivery.
_Avoid_: Bill, payment request

**Customer**: A person or organization that places orders.
_Avoid_: Client, buyer, account
```

## Rules

- Be opinionated. When several words describe the same concept, choose one canonical term and list the others under `_Avoid_`.
- Keep definitions to one or two sentences. Define what the concept is, not everything it does.
- Include only terms specific to this project's domain. Exclude general programming concepts, implementation details, requirements, and architectural decisions.
- Group terms under subheadings only when natural clusters emerge. Keep a flat list for one cohesive area.
- Add or change a term only after the user explicitly resolves it.

Before adding a term, ask whether it is unique to this domain or merely a general technical concept. Include only the former.

## Single- and multi-context repositories

Use one root `CONTEXT.md` for a single context.

For multiple contexts, use a root `CONTEXT-MAP.md` to list the contexts, locations, and relationships:

```md
# Context Map

## Contexts

- [Ordering](./src/ordering/CONTEXT.md) — receives and tracks customer orders
- [Billing](./src/billing/CONTEXT.md) — generates invoices and processes payments
- [Fulfillment](./src/fulfillment/CONTEXT.md) — manages warehouse picking and shipping

## Relationships

- **Ordering → Fulfillment**: Ordering emits `OrderPlaced`; Fulfillment consumes it to start picking
- **Fulfillment → Billing**: Fulfillment emits `ShipmentDispatched`; Billing consumes it to generate an invoice
- **Ordering ↔ Billing**: Both use the canonical `CustomerId` and `Money` value definitions
```

Infer the structure from existing files:

- If `CONTEXT-MAP.md` exists, read it and update the relevant context.
- If only a root `CONTEXT.md` exists, use the single context.
- If neither exists, create a root `CONTEXT.md` lazily after the first term is resolved.
- If several contexts exist and the correct owner is unclear, ask before writing.
