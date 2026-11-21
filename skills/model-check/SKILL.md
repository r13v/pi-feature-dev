---
name: model-check
description: Check each reachable state of a small model of a lifecycle, protocol, or concurrent flow; give the shortest event path that breaks each rule; and draw the states as a Mermaid chart. Use when the user asks to model-check a design or to show a bug as a path through states. Skip flows with one obvious path.
---

# Model Check

A model is a small copy of how a system moves between states. The checker
tries each order of events, finds each state that breaks a rule, and gives the
shortest path to it. The chart shows the states in the words of the reader, who
decides whether the behavior is right.

The checker finds safety bugs: a state that must never occur. When the model
exports `done`, it also finds each state from which no end state can be
reached, such as a retry loop with no way out. It does not prove that a fair
run ends: a loop that also has an exit passes.

## Run

Write the model in a scratch folder outside the repository. The checker needs
only Node 18 or later, with no packages to install:

```sh
node <skill dir>/scripts/check.mjs model.mjs out
```

The checker writes `out/report.md` and `out/chart.mmd`, and prints the report.
Exit status 0 means that each rule holds and no state is stuck or cut off
from an end. Exit status 1 means that one of these checks fails. Exit status 2
means a usage or model error, or more states than the limit. The limit is
5000 states; change it with `--limit N`.

`references/example-model.mjs` is a complete model of a lost update.

## Write the model

The model is an ES module with these exports:

- `initial`: the start state, as plain data.
- `events`: an array of event objects, or a function from a state to the
  events that can occur in it. Give each actor its own events, such as
  `{ type: "write", w: 1 }`, so that the checker tries each interleaving.
- `step(state, event)`: returns the next state. Return the same state when
  the event cannot occur. Do not change the given state. Two states are the
  same when their JSON is the same. Give one result for one event: when an
  action can end two ways, such as a call that succeeds or fails, give each
  way its own event, such as `{ type: "call ok" }` and
  `{ type: "call fails" }`.
- `rules`: an object from a sentence that the reader agrees to, such as
  "A paid order is never refunded twice", to a function that returns true
  when the state obeys it.
- `label(state)`: the words for a chart state.
- `done(state)`, optional: true for a correct end state. Each other state
  with no step out is stuck, and each state must have a path to an end state.
- `arrow(event, from, to)`, optional: the words for an arrow, or `null` to
  hide it.

`step`, `label`, and `arrow` must depend only on their arguments, with no
random values or clock.
- `title`, optional: the chart title.

Model what can make a rule break: each actor, each retry, each failure, each
message that can arrive late or twice. Leave out what cannot change the
result. Keep the constants small, such as two workers and one retry: most
bugs need few steps.

When a rule has no state to check it against, add the state, such as a count
of refunds. Never weaken a rule to make it hold.

When the model describes existing code, write each event from the code, and
cite the file and line that each event stands for.

When each rule holds, break the model on purpose, such as by removing a guard
or reordering two steps, and confirm that the checker reports the rule. A rule
that you have never seen break proves nothing. Also check that the state count
in the report is about what you expect.

## Pick the chart

Label each state with what the reader can see or cares about, such as
"Paying" or "Lease held, write pending". Keep variable names out of labels.
Write each arrow as the user sees it happen, such as "the payment fails".
The chart merges the states that get one label, and the arrows that get one
text between the same two states. It does not draw a step that stays in one
chart state; split the label when the reader must see such a step.

When a value that no label shows decides where a step goes, name the result
in the arrow, such as "worker 2 writes 1". Otherwise two arrows from one state
look the same.

Aim for about 20 arrows or fewer. First merge states that act the same, then
hide arrows that the reader does not need, such as a reset that every state
has. Keep each state of a bug path. Keep each chart state reachable by arrows
from the start, and keep at least one arrow out of each state that has a step
out. Do not merge two states that break
different rules. When a chart state has `mayBreak`, only some of the model
states behind it break a rule; split its label when the reader must see where.

## Replay each path

A model is not the code. For each broken rule, write a test in the project's
own test framework that replays the path against the real code, one step for
each event. Run it and confirm that it fails for the reason in the report.
When the bug does not occur, think that the model is wrong until you show that
it is not, then correct the model and run it again.

After the fix, run the checker on a model of the fixed design, and keep the
replay test as a regression test.

## Hand off

Give the chart as a `mermaid` code block. For each broken rule, give the rule,
its numbered path from the report, and the replay result. Say what the model
leaves out and which arrows the chart hides. Give the command that makes the
files again.
