import { test } from "node:test";
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { existsSync, mkdtempSync, readFileSync, rmSync,
  writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { makeProbeWorkdir, makeWorkdir, overlay } from "./provider.mjs";
import { noteExposure, probeChecks } from "./probes.mjs";
import { dreamBehavior, dreamCandidateNext, dreamCandidateNextBehavior,
  dreamPruneException, dreamPruneExceptionBehavior, dreamSyntheticContamination,
  dreamSyntheticContaminationBehavior } from "./checks.mjs";

test("a consumer gets a memory snapshot without review evidence", (t) => {
  const review = makeWorkdir("dream-single-correction", "working");
  writeFileSync(join(review, "sessions/private.txt"), "SOURCE_SENTINEL");
  const probe = makeProbeWorkdir("format-default", join(review, "memory"));
  t.after(() => [review, probe].forEach((dir) =>
    rmSync(dir, { recursive: true })));
  for (const hidden of ["sessions", ".agents", ".claude",
    ".git/dream-candidates"]) {
    assert.equal(existsSync(join(probe, hidden)), false, hidden);
  }
  const index = join(probe, "memory/MEMORY.md");
  const snapshot = readFileSync(index, "utf8");
  writeFileSync(join(review, "memory/MEMORY.md"), "changed later");
  assert.equal(readFileSync(index, "utf8"), snapshot);
  assert.match(readFileSync(join(probe, "AGENTS.md"), "utf8"),
    /memory\/MEMORY.md/);
  assert.equal(execFileSync("git", ["log", "--all", "--oneline", "--",
    "sessions"], { cwd: probe, encoding: "utf8" }), "");
});

const prose = "Local JSON files are free and stay on one machine. "
  + "SQLite is free, local, and supports queries. Hosted PostgreSQL costs "
  + "money but supports sharing and queries. I recommend SQLite for an "
  + "offline app.";
const table = "| Option | Cost | Sharing | Queries |\n"
  + "| --- | --- | --- | --- |\n"
  + "| JSON | Free | Local | No |\n"
  + "| SQLite | Free | Local | Yes |\n"
  + "| PostgreSQL | Paid | Shared | Yes |\n"
  + "SQLite suits a single-person offline app.";

test("format probes reject empty work and check the applicable request", () => {
  for (const name of ["format-default", "format-explicit"]) {
    const check = (output) => Object.values(probeChecks({ name,
      after: { output } }, "after")).every(Boolean);
    assert.equal(check(""), false);
    assert.equal(check(name === "format-default" ? prose : table), true);
    if (name === "format-explicit") {
      assert.equal(check(table.split("\n").map((line) =>
        line.replace(/^\| | \|$/g, "")).join("\n")), true);
    }
    assert.equal(check(name === "format-default" ? table : prose), false);
    assert.equal(check("JSON SQLite PostgreSQL ".repeat(8)
      + "\n| --- | --- |\n"), false);
    assert.equal(Object.values(probeChecks({ name }, "after"))
      .every(Boolean), false);
  }
});

test("document tables do not override the final-answer preference", (t) => {
  const workdir = mkdtempSync(join(tmpdir(), "dream-document-check-"));
  t.after(() => rmSync(workdir, { recursive: true }));
  const check = (output) => Object.values(probeChecks({
    name: "format-document", after: { workdir, output } }, "after"))
    .every(Boolean);
  assert.equal(check("Created comparison.md."), false);
  writeFileSync(join(workdir, "comparison.md"), table);
  assert.equal(check("Created comparison.md."), true);
  assert.equal(check(table), false);
});

test("the wording probe requires a completed task, not a label mention", () => {
  const check = (output) => Object.values(probeChecks({ name: "progress-label",
    after: { output } }, "after")).every(Boolean);
  assert.equal(check("launch gate"), false);
  assert.equal(check("The launch gate is not complete."), false);
  assert.equal(check("Not the launch gate; the deployment check is complete."),
    false);
  assert.equal(check("The launch gate is complete."), true);
});

test("a behavior evaluation cannot pass with omitted consumer sessions", (t) => {
  const workdir = makeWorkdir("dream-single-correction", "working");
  t.after(() => rmSync(workdir, { recursive: true }));
  assert.equal(dreamBehavior("", { metadata: { workdir } }).pass, false);
});

test("only actual returned note contents demonstrate exposure", (t) => {
  const review = makeWorkdir("dream-single-correction", "working");
  const workdir = makeProbeWorkdir("format-default", join(review, "memory"));
  t.after(() => [review, workdir].forEach((dir) =>
    rmSync(dir, { recursive: true })));
  const trace = join(workdir, ".git/codex-events.jsonl");
  writeFileSync(trace, JSON.stringify({ type: "item.completed",
    item: { type: "agent_message", text: "I read test-command.md" } }));
  assert.equal(noteExposure(workdir)["test-command.md"], "unknown");
  writeFileSync(trace, JSON.stringify({ type: "item.completed", item: {
    type: "command_execution", aggregated_output: readFileSync(join(workdir,
      "memory/test-command.md"), "utf8") } }));
  assert.equal(noteExposure(workdir)["test-command.md"],
    "visible in tool output");
});

for (const [name, structural, behavioral, probeName, answer] of [
  ["dream-candidate-next", dreamCandidateNext, dreamCandidateNextBehavior,
    "progress-label", "The launch gate is complete."],
  ["dream-prune-exception", dreamPruneException, dreamPruneExceptionBehavior,
    "approval-label", "The export needs your OK."],
  ["dream-synthetic-contamination", dreamSyntheticContamination,
    dreamSyntheticContaminationBehavior, "arithmetic", "42"],
]) {
  test(`${name}: consumers are required in the behavioral check`, (t) => {
    const workdir = makeWorkdir(name, "working");
    const task = mkdtempSync(join(tmpdir(), "dream-consumer-check-"));
    t.after(() => [workdir, task].forEach((dir) =>
      rmSync(dir, { recursive: true })));
    const fixture = join(import.meta.dirname, "cases", name);
    if (existsSync(join(fixture, "fixed"))) {
      overlay(join(fixture, "fixed"), workdir);
    }
    const output = readFileSync(join(fixture, "fixed-output.txt"), "utf8");
    const metadata = { workdir };
    assert.equal(structural(output, { metadata }).pass, true);
    assert.equal(behavioral(output, { metadata }).pass, false);
    writeFileSync(join(task, "answer.txt"), "42");
    metadata.probes = [{ name: probeName,
      before: { output: "Original answer", workdir: task },
      after: { output: answer, workdir: task } }];
    assert.equal(behavioral(output, { metadata }).pass, true);
  });
}

test("the unrelated probe checks the result artifact", (t) => {
  const workdir = mkdtempSync(join(tmpdir(), "dream-probe-check-"));
  t.after(() => rmSync(workdir, { recursive: true }));
  const check = () => Object.values(probeChecks({ name: "arithmetic",
    after: { workdir, output: "42" } }, "after")).every(Boolean);
  assert.equal(check(), false);
  writeFileSync(join(workdir, "answer.txt"), "41");
  assert.equal(check(), false);
  writeFileSync(join(workdir, "answer.txt"), "42\n");
  assert.equal(check(), true);
  writeFileSync(join(workdir, "evidence-canary.txt"), "CANDIDATE_CANARY");
  assert.equal(check(), false);
});
