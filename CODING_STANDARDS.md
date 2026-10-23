# Coding standards

The diff review reads these rules. Each rule is a judgement call that no
automated check can make. A rule that a tool can check belongs in
`npm test`, not here.

## The `ship` progress file

When a change adds a stage, an entry value, a section, or a tag to the
progress file of `ship`, walk each path of a run to `status: finished`:

- a stage that the user or a rule skips;
- a run that continues from an active progress file, including a file that
  an older version of `ship` wrote;
- the second pass for the "do now" ideas;
- an empty input, such as an empty section or a stage with no result.

Each path must reach `status: finished`, and each entry value that one skill
writes must be a value that the other skills accept.

## README and skill files

The README paragraph about a skill must agree with the rules in its
`SKILL.md`. When a change adds, removes, or narrows a rule in a skill, read
the README paragraph about that skill and correct it in the same change.
