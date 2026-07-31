# STE Skill

This project skill applies ASD-STE100 Simplified Technical English principles to:

- regulated and safety-critical technical documentation;
- procedures and technical descriptions;
- prompts, tool descriptions, error messages, and agent instructions;
- controlled or translation-ready English.

The skill is Markdown-only and has no runtime or tool dependency.

Its agent-facing instructions stay compact. Detailed writing rules, review checklists, text-type
patterns, and examples are separate references that the agent loads only when a task needs them.

## Standard Baseline

The skill uses ASD-STE100 Simplified Technical English, Issue 9, dated 2025-01-15.
Issue 9 contains 53 writing rules in nine sections. Its dictionary contains 875 approved entries
and 1,274 selected unapproved entries.

Authoritative sources:

- [ASD-STE100 official site](https://www.asd-ste100.org/)
- [Official downloads page](https://www.asd-ste100.org/STE_downloads.html)
- [Official Issue 9 PDF](https://www.asd-ste100.org/assets/files/ASD-STE100_ISSUE9.pdf)

## Verification Boundary

This skill paraphrases the writing method. It does not reproduce the official controlled
dictionary or replace the authoritative standard.

Use the official Issue 9 dictionary and the applicable project glossary for strict verification.
Without those checks, describe the result as an `STE-aligned draft` or an `STE-style rewrite`,
not as a compliant or certified document.

ASD owns the copyright and trademarks for ASD-STE100. Do not copy the official dictionary or
extended passages without permission.

## Design References

The skill design also incorporates ideas from these open-source implementations:

- [danyuchn/asd-ste100-skill](https://github.com/danyuchn/asd-ste100-skill)
- [AminBlg/SimpleEnglish](https://github.com/AminBlg/SimpleEnglish/tree/main/skills/simple-english)

This project keeps its own conservative verification boundary. External checklists and examples
do not establish formal STE compliance.
