---
name: ste
description: Draft or review unambiguous technical English using Simplified Technical English principles. Use for clarity rewrites or ASD-STE100 reviews; formal verification needs the official dictionary and project glossary.
---

# STE

Write English that has one clear meaning and a structure that is easy to parse. Preserve technical
accuracy before you simplify language.

## Select the Operating Mode

Use **strict STE mode** when the user requests ASD-STE100 compliance or works on regulated,
maintenance, operational, or safety-critical documentation.

- Apply Issue 9 rules and the applicable project directives.
- Verify general vocabulary against the official Issue 9 dictionary.
- Verify technical nouns and verbs against the project glossary.
- Use `STE-aligned draft` when these lexical checks are not possible.

Use **STE clarity mode** for prompts, tool descriptions, error messages, agent instructions,
status reports, translation-ready text, and other technical or operational English.

- Transfer the clarity rules that fit the text.
- Prefer explicit actors, actions, conditions, inputs, and results.
- Do not imply formal ASD-STE100 compliance.

## Load References Selectively

- Read [references/writing-rules.md](references/writing-rules.md) for strict STE work, compliance
  reviews, safety text, word-count decisions, or rule details.
- Read [references/checklist.md](references/checklist.md) for strict reviews, audits, high-risk
  text, or long documents. Use its quick check or full check as the task requires.
- Read [references/use-cases.md](references/use-cases.md) when the text type needs a clear
  information order or a reusable structure.
- Read [references/before-after.md](references/before-after.md) when rewriting dense text,
  explaining changes, or producing a comparison.
- Read all user-supplied glossaries, safety policies, style guides, and regulatory directives that
  apply.

If sources conflict, follow the explicit regulatory or project requirement and report the
deviation. Do not merge inconsistent terminology.

## Preserve Meaning

Before rewriting:

1. Identify each fact, action, condition, limit, unit, exception, warning, causal relation, and
   cross-reference.
2. Resolve what each pronoun and modifier refers to.
3. Keep the original sequence and scope unless the user authorizes a technical change.
4. Ask when ambiguity can change safety, responsibility, or task outcome.

Do not invent missing facts. Do not remove precision only to meet a length target.
Keep a qualitative modifier such as `carefully` when it affects task intent. Flag it when the
project requires a measurable criterion, but do not invent that criterion.
Keep the strength of each modal verb and hedge. Do not change `may have failed` to `failed`, and
do not add a cause, frequency, or certainty that the source does not state.

## Protect Untouchable Text

Unless the user explicitly asks to edit the exact literal, do not change:

- Code blocks, inline code, identifiers, placeholders, and data values.
- CLI commands, flags, file paths, URLs, and protocol elements.
- Product, API, configuration, database, and schema names.
- Quoted UI labels, error strings, log text, and externally defined messages.

Rewrite the sentence around an untouchable literal when necessary. Never silently normalize the
literal itself.

## Apply the Core Discipline

| Area | Apply |
|---|---|
| Vocabulary | Use one familiar word for one meaning. In strict mode, confirm its approved meaning, part of speech, and form. |
| Terminology | Use one term for one concept. Keep necessary domain terms and define or flag unclear terms. |
| Verbs | Prefer active voice, simple tenses, and direct action verbs. Avoid noun-heavy and complex auxiliary constructions. In clarity mode, keep a compound tense that carries current relevance or a hedge, and flag it. |
| Instructions | Use the imperative form. Put one independent action in each sentence. Combine actions only when they occur at the same time. Put prerequisite conditions first. |
| Length | In strict mode, apply the 20-word procedure and 25-word description limits under Issue 9 counting rules. In clarity mode, shorten only when meaning and readability improve. |
| Noun phrases | Keep multi-word nouns to three words when possible. Preserve longer official names and define a clear short form if needed. |
| Structure | Use complete sentences, one topic per paragraph, and vertical lists for complex sequences or alternatives. |
| Safety | Start with the required command or condition, then state the risk or possible result. Never infer the risk level. |
| Consistency | Reuse the same wording for the same action and context. Do not rotate synonyms for style. |

## Rewrite in Passes

For a short clarity edit, rewrite and compare directly. Use the full pass sequence
for a long document, strict review, or ambiguity that requires careful tracing.

1. Classify each section as instruction, description, safety text, or mixed content.
2. Read for meaning before changing words.
3. Record repeated or uncertain terms when terminology control matters.
4. Find ambiguity, indirect wording, complex tense, passive voice, omitted words, long noun
   phrases, overloaded sentences, and inconsistent terminology.
5. In procedural text, count the independent actions in each sentence. Split actions that do not
   occur at the same time.
6. Rewrite only the text that benefits from a change.
7. Compare the result with the source. Confirm that all facts, conditions, limits, exceptions,
   and responsibilities remain.
8. Review sentence length, paragraph structure, punctuation, and term consistency manually.

If the input is already clear and meets the applicable rules, say so. Do not force a rewrite.

## Self-check Before Delivery

Always confirm that:

1. The revision preserves every fact, condition, limit, unit, exception, sequence, hedge, and
   responsibility.
2. Untouchable text is unchanged unless the user requested that exact change.
3. Each procedural sentence has one independent action unless actions occur at the same time.
4. Actors, referents, conditions, results, and terminology are unambiguous and consistent.
5. The result uses the correct mode, verification status, and unresolved checks.
6. Each cited rule number was verified directly against the authoritative standard.

## Choose the Output

For a direct drafting or rewriting request:

1. Give the revised text first.
2. Add one `Kept as-is:` line only when you kept longer wording on purpose. Name the phrase and
   the precision that a shorter version would lose.
3. Add `Unresolved checks` only when lexical, technical, regulatory, or safety facts remain
   unverified.

For an audit or an explained rewrite, use:

| Rule area | Original | Revised | Reason |
|---|---|---|---|
| Concise rule name | Exact source fragment | Replacement | What ambiguity or violation the change removes |

After the table, give the complete revised text. Group unresolved items as:

- `Confirmed issue`
- `Manual review`
- `Project decision`

Use the user's requested format when it conflicts with these defaults.

Name the applicable rule area in explanations. Cite an Issue 9 rule number only after you verify
that number in the official standard or an authoritative copy supplied by the user. Do not infer
rule numbers from memory, summaries, or another skill.

## State Verification Honestly

Use one of these statuses only when a status is useful:

- `STE-style rewrite` for general-purpose clarity mode.
- `STE-aligned draft` when Issue 9 or project terminology checks are incomplete.
- `Verified against Issue 9 and project terminology` only when those checks occurred.

Do not call the result certified. Do not reproduce the official dictionary. Do not apply STE
mechanically to creative, marketing, or persuasive text unless the user explicitly values
literal clarity more than voice.
