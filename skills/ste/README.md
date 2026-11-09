# STE Skill

This project skill applies transferable clarity principles to technical text in
any language, with specific guidance for Russian. Strict ASD-STE100 verification
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

This project keeps its own conservative verification boundary. External
checklists and examples
do not establish formal STE compliance.
