# STE Skill

This project skill applies transferable clarity principles to technical text in
any language, with specific guidance for Russian, including УТР techniques.
Strict ASD-STE100 verification
is available for English only. It supports:

- regulated and safety-critical technical documentation.
- procedures and technical descriptions.
- prompts, tool descriptions, error messages, and agent instructions.
- controlled English and translation-ready text in other languages.

The skill is Markdown-only and has no runtime or tool dependency.

Its agent-facing instructions stay compact. Detailed writing rules, review
checklists, text-type
patterns, and examples are separate references that the agent loads only when a
task needs them.

## Standard Baseline

The skill uses ASD-STE100 Simplified Technical English, Issue 9, dated
2025-01-15.
Issue 9 contains 53 writing rules in nine sections. Its dictionary contains 875
approved entries
and 1,274 selected unapproved entries.

Authoritative sources:

- [ASD-STE100 official site](https://www.asd-ste100.org/)
- [Official downloads page](https://www.asd-ste100.org/STE_downloads.html)
- [Official Issue 9
  PDF](https://www.asd-ste100.org/assets/files/ASD-STE100_ISSUE9.pdf)

## Verification Boundary

This skill paraphrases the writing method. It does not reproduce the official
controlled
dictionary or replace the authoritative standard.

Use the official Issue 9 dictionary and the applicable project glossary for
strict verification.
Without those checks, describe English results as an `STE-aligned draft` or an
`STE-style rewrite`, not as a compliant or certified document. For other
languages, use `Clarity edit` or its local equivalent, such as «редактура на
ясность». English vocabulary, grammar, and word limits do not govern that mode.

ASD owns the copyright and trademarks for ASD-STE100. Do not copy the official
dictionary or
extended passages without permission.

## Design References

The skill design also incorporates ideas from these open-source implementations:

- [danyuchn/asd-ste100-skill](https://github.com/danyuchn/asd-ste100-skill)
- [AminBlg/SimpleEnglish](https://github.com/AminBlg/SimpleEnglish/tree/main/skills/simple-english)

Russian clarity guidance also draws on context-sensitive editing techniques in
[artgas1/infostyle-skill](https://github.com/artgas1/infostyle-skill):
direct verbs,
less bureaucratic wording, and text-type-aware UI writing. This skill does not
adopt its mandatory numbers, mechanical modality deletion, output quotas, or
marketing scores: preserving evidence and technical meaning takes precedence.

### Simplified Technical Russian (УТР)

Russian guidance also draws on:

- Владислав Москалёнок,
  [«Лаконичность без
  примитивизма»](https://protext.su/pro/lakonichnost-bez-primitivizma/),
  2015, and its grammar, syntax, and vocabulary table.
- Инна Якименко,
  [«Как писать кратко и
  понятно»](https://protext.su/pro/kak-pisat-kratko-i-ponyatno/),
  2014, a practitioner's working rules rather than a normative specification.
- ГОСТ Р 58049—2017:
  [official catalogue
  entry](https://protect.gost.ru/gost/details/4183a5cf-a3af-4e95-97bd-c7bb4bb27063)
  and [section 8 text via ГАРАНТ](https://base.garant.ru/73850744/).
  Its primary scope is translation of aviation operational documentation;
  section 1 also permits use for other documentation. Sections 8.1.3–8.1.8
  address project terminology resources; section 8.2 gives writing guidance.

Adopted: direct word order, parallel imperative steps, concise introductions,
consistent terminology, and simpler clauses when all qualifications survive.
The articles' examples are not adopted mechanically: removing a user's lack
of access rights loses an eligibility condition; replacing «2–3 minutes,
possibly longer» with «no more than 3–4 minutes» invents a bound. The table's
incomplete option step does not establish which action to perform.

The ГОСТ recommends 20 words for both instructions and descriptions, not
English STE's 20/25 split. Its counting conventions apply when that profile
is requested. They are not a default limit for Russian UI or agent prompts.
These selected techniques do not establish whole-standard compliance or
require DITA, CAT software, or a new runtime dependency. Sources checked
2026-11-15.

This project keeps its own conservative verification boundary. External
checklists and examples
do not establish formal STE compliance.
