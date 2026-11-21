// Check every reachable state of a model, report the shortest path to each
// broken rule and each stuck state, and draw the states as a Mermaid chart.
// Usage: node check.mjs MODEL.mjs [OUT_DIR] [--limit N]
// Exit status: 0 when each rule holds and no state is stuck, 1 otherwise,
// 2 on a usage or model error.
import { writeFileSync, mkdirSync } from "node:fs";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { fromTransition } from "xstate";
import { TestModel } from "@xstate/graph";

const args = process.argv.slice(2);
const limitAt = args.indexOf("--limit");
const limit = limitAt === -1 ? 5000 : Number(args.splice(limitAt, 2)[1]);
const [modelPath, outDir = "."] = args;
if (!modelPath) {
  console.error("Usage: node check.mjs MODEL.mjs [OUT_DIR] [--limit N]");
  process.exit(2);
}

const m = await import(pathToFileURL(resolve(modelPath)).href);
for (const name of ["initial", "events", "step", "rules", "label"]) {
  if (m[name] === undefined) {
    console.error(`The model does not export \`${name}\`.`);
    process.exit(2);
  }
}
const done = m.done ?? (() => false);
const arrow = m.arrow ?? ((e) => e.type);

const key = (s) => JSON.stringify(s);
const model = new TestModel(
  fromTransition((s, e) => m.step(s, e), m.initial),
  {
    events: typeof m.events === "function"
      ? (snap) => m.events(snap.context)
      : m.events,
    serializeState: (snap) => key(snap.context),
    limit,
  },
);

let adjacency;
try {
  adjacency = model.getAdjacencyMap();
} catch (error) {
  if (!String(error.message).includes("limit")) throw error;
  console.error(`More than ${limit} states. Make the model smaller.`);
  process.exit(2);
}

const states = Object.values(adjacency).map((node) => ({
  state: node.state.context,
  next: Object.values(node.transitions)
    .map((t) => ({ event: t.event, to: t.state.context }))
    .filter((t) => key(t.to) !== key(node.state.context)),
}));

function shortestPath(isBad) {
  const paths = model.getShortestPaths({ toState: (snap) => isBad(snap.context) });
  if (!paths.length) return null;
  const path = paths.sort((a, b) => a.steps.length - b.steps.length)[0];
  return path.steps
    .filter((s) => !s.event.type.startsWith("xstate."))
    .map((s) => s.event);
}

const exits = new Map(states.map((n) => [key(n.state), n.next.length]));
const stuck = (s) => !done(s) && exits.get(key(s)) === 0;
const problems = [
  ...Object.entries(m.rules).map(([rule, holds]) => ({
    name: rule,
    isBad: (s) => !holds(s),
  })),
  { name: "Each state that is not an end state has a step out", isBad: stuck },
].map((p) => ({ ...p, path: shortestPath(p.isBad) }));

// The chart: one node per label, one arrow per pair of labels and arrow text.
const labels = new Map();
const nodeOf = (s) => {
  const text = m.label(s);
  if (!labels.has(text)) labels.set(text, { id: `s${labels.size}`, states: [] });
  return labels.get(text);
};
const arrows = new Map();
for (const { state, next } of states) {
  const from = nodeOf(state);
  from.states.push(state);
  for (const { event, to } of next) {
    const text = arrow(event, state, to);
    const target = nodeOf(to);
    if (text === null || target === from) continue;
    arrows.set(`${from.id}|${target.id}|${text}`, { from, target, text });
  }
}

const quote = (text) => text.replace(/[:;"#<>{}]/g, " ").replace(/\s+/g, " ");
const broken = problems.filter((p) => p.path);
const chart = ["---", `title: ${quote(m.title ?? "States")}`, "---"];
chart.push("stateDiagram-v2", `  [*] --> ${nodeOf(m.initial).id}`);
for (const [text, node] of labels) {
  chart.push(`  state "${quote(text)}" as ${node.id}`);
  const bad = node.states.filter((s) => broken.some((p) => p.isBad(s)));
  if (bad.length) {
    const mark = bad.length === node.states.length ? "breaks" : "mayBreak";
    chart.push(`  class ${node.id} ${mark}`);
  }
}
for (const { from, target, text } of arrows.values()) {
  chart.push(`  ${from.id} --> ${target.id}: ${quote(text)}`);
}
chart.push(
  "  classDef breaks fill:#ffecee,stroke:#e72e3b,color:#cd2834",
  "  classDef mayBreak fill:#fff3e6,stroke:#e8730c,color:#b85a06",
);

const report = [
  `# ${m.title ?? "Model check"}`,
  "",
  `States: ${states.length}. Chart states: ${labels.size}.`,
  `Chart arrows: ${arrows.size}.`,
  "",
];
for (const p of problems) {
  if (!p.path) {
    report.push(`- Holds: ${p.name}`);
    continue;
  }
  report.push(`- BREAKS: ${p.name}`);
  let s = m.initial;
  p.path.forEach((event, i) => {
    const after = m.step(s, event);
    report.push(`  ${i + 1}. ${arrow(event, s, after) ?? event.type}` +
      ` -> ${m.label(after)}`);
    s = after;
  });
  if (!p.path.length) report.push("  (the start state)");
}

mkdirSync(outDir, { recursive: true });
writeFileSync(resolve(outDir, "chart.mmd"), `${chart.join("\n")}\n`);
writeFileSync(resolve(outDir, "report.md"), `${report.join("\n")}\n`);
console.log(report.join("\n"));
process.exit(broken.length ? 1 : 0);
