# Clarity Across Languages

ASD-STE100 is an English standard. Its transferable clarity principles are not
a controlled-language standard for Russian or any other language.

## Transfer the Intent, Not the English Grammar

For every language:

- Keep all facts, conditions, limits, exceptions, responsibilities, sequence,
  negation, and degrees of certainty and obligation.
- Use one term per concept. Use the project's glossary for that language;
  do not substitute the official English STE dictionary.
- Make actors and referents explicit when omission creates ambiguity.
- Put prerequisite conditions before the actions they govern. Separate
  independent procedural actions and show their order.
- Keep code, identifiers, commands, paths, placeholders, and quoted interface
  strings unchanged, even when their language differs from the surrounding text.
- Prefer familiar, direct wording and natural syntax. Do not translate unless
  requested. In mixed-language documents, edit each passage in its own language.

Do not apply English tense, article, part-of-speech, noun-chain, or 20/25-word
rules to other languages. Sentence length is a readability signal, not a
universal pass/fail threshold. Do not shorten a clear sentence solely to meet
an English limit. Follow any explicit local or project length requirement.

If no language-specific guide is available, use these general checks and the
user's style guide. Do not invent a local standard or claim compliance with one.
Flag language uncertainty that can affect technical meaning.

## Russian

- Replace bureaucratic verb-noun combinations with direct verbs when meaning
  stays the same: «осуществить проверку» → «проверить».
- Untangle chains of genitives and nested participial phrases. State who does
  what to which object; do not impose an English three-word noun limit.
- Treat filler, intensifiers, and clichés as review signals, not banned words.
  «Около», «более», «например» and «сейчас» can carry essential meaning. Replace
  vague claims with concrete facts only if the source supplies those facts.
  Otherwise flag the missing evidence; never invent numbers, causes, or
  promises.
- Prefer active wording when the actor matters. Keep natural impersonal or
  passive messages such as «Файл не найден» when the actor is irrelevant.
- Preserve verbal aspect and timing: «проверяйте» can describe a repeated
  action,
  while «проверьте» can describe a single completed action. Do not swap them
  merely to shorten a sentence.
- Preserve modality: «может», «разрешено», «необходимо», «рекомендуется» and
  «запрещено» do not express the same certainty, permission, or obligation.
  «Возможно, соединение потеряно» must not become «Соединение потеряно».
- Resolve ambiguous «он», «это», «его» by naming the referent only when the
  source establishes it. Ask if the choice changes responsibility or outcome.
- Use natural imperative instructions. Do not force an explicit «вы» into every
  sentence. Retain exact UI labels rather than declining or translating them.

### Simplified Technical Russian (УТР)

УТР has Russian-specific guidance; it is not Russian ASD-STE100. Use it within
clarity mode, not as a third mode or a claim of formal compliance.

- Prefer a direct actor–verb–object order when it clarifies responsibility.
  Keep prerequisite conditions before the actions they govern.
- Keep procedural steps grammatically parallel and numbered in execution
  order. Use plural imperatives such as «Откройте», «Выберите», «Нажмите».
  Separate independent actions; retain simultaneous actions together.
- Replace empty introductions with a short purpose or heading. Simplify
  participial clauses only when their qualifying information survives.
- Reuse the approved term. Do not assume «права» and «привилегии» mean the
  same thing in a project's access model. Use shortened official terms only
  when their meaning is clear and the project approves them.
- An incomplete step such as «В окне опция „Доступ к системе“» does not say
  whether to select, enable, or inspect the option. Flag the missing action;
  do not complete it by guessing.

Published before/after examples are not proof of equivalent meaning. In
particular, do not copy these losses:

- «Пользователю, который не имеет прав доступа» → «пользователю» drops the
  eligibility condition. «Пользователю без прав доступа» preserves it.
- «2–3 минуты; в зависимости от конфигурации может потребоваться больше»
  → «не более 3–4 минут» invents an upper bound and removes the exception.

For an explicit ГОСТ Р 58049—2017 review, check the applicable requirements
and project terminology. Its primary scope is translation of aviation
operational documentation; it also permits use for other documentation.
Sections 8.2.5.1 and 8.2.6.1 recommend a maximum of 20 words for instructions
and descriptions, with special counting conventions in 8.2.5.1. This is a
Russian source requirement, not the English STE 20/25 rule. Apply it when
that profile is requested, not as a universal Russian clarity threshold.
A review of selected writing rules is not verification against the whole
standard. Report the checked scope and any unverified requirements.

### Match the Text Type

A Russian button can use an infinitive («Сохранить»), and a field label can be a
noun («Адрес доставки»). Do not force complete procedural sentences into UI
fragments. For a new error message, state what failed and a recovery action
when known; include a cause only if established. Do not add an unsupported file
size, deadline, or guarantee to make the wording seem concrete. Existing quoted
UI and error literals remain protected unless editing them is explicitly in
scope.

These context-sensitive techniques also occur in
[infostyle-skill](https://github.com/artgas1/infostyle-skill). They do not
justify
mechanical stop-word deletion, mandatory numbers, minimum retained length, or
marketing-oriented scores in technical edits.

Example:

> Если резервная копия создана, оператору необходимо осуществить запуск
> `deploy --env staging`. При отсутствии копии запуск запрещён.

Revision:

> Если резервная копия создана, оператор должен запустить
> `deploy --env staging`.
> Без резервной копии запуск запрещён.

The condition, actor, obligation, command, and prohibition remain. This is
«редактура на ясность», not Russian ASD-STE100 compliance.
