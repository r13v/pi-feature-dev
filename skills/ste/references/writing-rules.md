# ASD-STE100 Issue 9 Writing Rules

## Contents

- [Decision priority](#decision-priority)
- [Vocabulary and terminology](#vocabulary-and-terminology)
- [Compact rule coverage map](#compact-rule-coverage-map)
- [Issue 9 general recommendations](#issue-9-general-recommendations)
- [General-purpose transfer](#general-purpose-transfer)
- [Authoring templates](#authoring-templates)
- [Review protocol](#review-protocol)

## Decision Priority

Apply these priorities:

1. Preserve technical accuracy, safety intent, limits, and required sequence.
2. Follow applicable law, regulation, customer requirements, and project directives.
3. Apply the current Issue 9 rule and dictionary entry.
4. Use the approved project glossary for technical nouns and technical verbs.
5. Prefer one clear construction when more than one construction is permitted.

If priorities conflict, select the higher-priority requirement and report the conflict. Do not merge
two inconsistent wordings.

## Vocabulary and Terminology

Use only these word classes:

- A general word approved in the Issue 9 dictionary.
- A technical noun applicable to the subject field.
- A technical verb applicable to the subject field.

For an approved general word, verify all of these properties:

- Part of speech.
- Approved meaning.
- Approved inflected form.
- Correct use in the sentence.

Treat a project term as a technical noun only when it names a precise subject-field concept. Use
terms from drawings, parts data, standards, official documents, and the approved project
glossary. Issue 9 organizes technical nouns into broad areas such as parts, machines, tools,
materials, systems, science, navigation, measurements, quoted labels, roles, medical concepts,
documents, conditions, colors, damage, computing, operations, law, and living things.

Treat a project verb as a technical verb only when it names a precise subject-field process.
Issue 9 permits categories for manufacturing, computer operations, applicable technical fields,
and legal or regulatory texts. Use a dictionary-approved verb instead when it communicates the
same action accurately.

Apply these terminology controls:

- Use one technical noun for one item.
- Do not use a technical noun as a verb.
- Do not use a technical verb as a noun.
- Prefer short, familiar, project-approved terms.
- Reject slang, regional wording, and unexplained jargon.
- Define an abbreviation at first use unless the audience and governing directive make it
  unnecessary.
- Keep quoted interface text, placards, labels, and identifiers unchanged.

## Compact Rule Coverage Map

Use this map to confirm coverage. Consult the authoritative standard for definitions, exceptions,
dictionary entries, and official examples.

### Words (Issue 9 section 1)

- Limit vocabulary to approved general words, technical nouns, and technical verbs.
- Use each approved word only with its listed part of speech, meaning, and form.
- Validate technical nouns and verbs by category and project authority.
- Keep one term for one concept and do not change noun/verb roles.
- Use American English spelling unless an official directive overrides it.

### Multi-word nouns (section 2)

- Keep a multi-word noun to three words or fewer when possible.
- When the official term is longer, write it in full first. Then define a clear short form or use
  hyphens to show words that function as one unit.
- Do not shorten a term in a way that creates ambiguity.

### Verbs (section 3)

- Use only approved verb forms.
- Use the infinitive, imperative, simple present, simple past, simple future, or a past participle
  used as an adjective.
- Avoid complex auxiliary constructions.
- Use an `-ing` form only as a technical noun or as a modifier inside a technical noun.
- Prefer active voice. In descriptive text, use passive voice only when the agent is unknown.
- Express an action with an accurate verb, not a noun-heavy construction.

### Sentences (section 4)

- Write short, complete, explicit sentences.
- Do not omit necessary words and do not use contractions.
- Convert complex series or alternatives into vertical lists.
- Use clear connecting words between related statements.
- Use an article or demonstrative adjective before a noun when English grammar requires one.

### Procedures (section 5)

- Limit each sentence to 20 words.
- Put one instruction in each sentence, except for actions that occur at the same time.
- Count independent actions, not only grammatical clauses. Do not join sequential actions with
  `and`.
- Use the imperative form.
- Put a prerequisite condition before the command and separate it with a comma.
- Keep commands out of notes.

### Descriptions (section 6)

- Present information gradually and in a logical sequence.
- Repeat key terms where they make structure clear.
- Limit each sentence to 25 words.
- Keep one topic in each paragraph.
- Limit each paragraph to six sentences.

### Safety instructions (section 7)

- Identify risk with the label required by the applicable safety system.
- Begin with a clear command or condition.
- Explain the risk or possible result.
- Preserve official safety wording when a governing directive prohibits changes.

### Punctuation and word count (section 8)

- Do not use semicolons.
- Use hyphens only to connect words that function together.
- Use parentheses only for clear supporting purposes, such as references, identifiers,
  abbreviations, alternatives, or brief explanations.
- In a vertical list, treat the introductory colon as a sentence boundary for word count.
- Count a complete parenthetical group as one word.
- Count each number, number-plus-unit, abbreviation, alphanumeric identifier, quoted text,
  title, label, and applicable proper name as one word.
- Count a hyphenated unit as one word.

### Writing practices (section 9)

- Restructure a sentence when a word-for-word synonym change is not sufficient.
- Confirm the meaning and grammar of each approved word.
- Do not create phrasal verbs.
- Use the same terminology and wording for the same context.

## Issue 9 General Recommendations

Apply these recommendations when they improve clarity:

- Include `that` when it clearly marks the start of a subordinate clause.
- Review each use of `with` for multiple possible meanings.
- Replace an ambiguous pronoun with its noun.
- Make the referent of `this` explicit.
- Check false friends when the author is not a native English speaker.
- Replace Latin abbreviations with plain English.
- Use inclusive, gender-neutral language.
- Avoid a possessive form when it can confuse the reader.

These recommendations help quality but are not part of the 53 rules.

## General-Purpose Transfer

For prompts, tool descriptions, error messages, agent instructions, and status reports:

- Treat a command as procedural text and an explanation as descriptive text.
- Name the actor when responsibility matters.
- State conditions before the action that depends on them.
- Separate actual results from possible causes and suggested recovery actions.
- Replace vague references such as `it`, `this`, and `they` when more than one referent is
  possible.
- Keep API names, identifiers, quoted UI text, code, and protocol terms unchanged.
- Define a necessary domain term once and use it consistently.

For translation-ready text:

- Prefer repeated terminology over stylistic variation.
- Keep sentence boundaries aligned with complete ideas.
- Make negation, quantities, units, and conditions explicit.

Use the status `STE-style rewrite` for these transferred applications unless strict verification
also occurred.

## Authoring Templates

### Procedure

Use this pattern:

```text
If [prerequisite condition], [imperative command].
[Imperative command].
[Imperative command].

NOTE: [Information only.]
```

Example:

```text
If the pressure is more than 500 kPa, stop the pump.
Close the inlet valve.
Disconnect the power cable.

NOTE: The indicator can stay on for 5 seconds.
```

### Description

Use this pattern:

```text
[Identify the item and its primary function.]
[Explain the next fact with the same key terminology.]
[State a condition and its result.]
```

Example:

```text
The controller monitors the inlet pressure. It sends a stop signal when the pressure is more than
500 kPa.
```

### Safety instruction

Use the label from the governing safety policy:

```text
[RISK LABEL]: [Command or condition]. [Risk or possible result.]
```

Example:

```text
WARNING: Disconnect electrical power before you open the housing. Electrical power can cause
injury.
```

Do not reuse the example risk level without validating it for the real hazard.

## Review Protocol

Review in separate passes:

1. **Meaning:** Compare source and output action by action. Confirm conditions, negation, limits,
   units, sequence, references, and consequences.
2. **Vocabulary:** Verify each general word in the Issue 9 dictionary. Record technical nouns and
   technical verbs in the term ledger.
3. **Grammar:** Check verb form, voice, articles, complete constructions, pronouns, and
   modifiers.
4. **Structure:** Apply the procedure, description, or safety pattern.
5. **Mechanics:** Apply sentence and paragraph limits, punctuation, spelling, and word-count
   rules.
6. **Consistency:** Search for alternate names and alternate wording for the same concept or
   action.

Record unverified items. A clear limitation is more accurate than an unsupported claim of
compliance.
