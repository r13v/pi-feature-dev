import { test } from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const skill = new URL("../skills/model-check/", import.meta.url);
const checker = fileURLToPath(new URL("scripts/check.mjs", skill));
const example = new URL("references/example-model.mjs", skill);

function check(model) {
  const out = mkdtempSync(join(tmpdir(), "model-check-"));
  const run = spawnSync(process.execPath, [checker, model, out], {
    encoding: "utf8",
  });
  const chart = readFileSync(join(out, "chart.mmd"), "utf8");
  rmSync(out, { recursive: true, force: true });
  return { ...run, chart };
}

test("the checker gives the shortest path to the lost update", () => {
  const { status, stdout, chart } = check(fileURLToPath(example));
  assert.equal(status, 1, stdout);
  assert.match(stdout, /BREAKS: When both workers are done/);
  assert.match(stdout, /1\. worker 1 reads[\s\S]*2\. worker 2 reads[\s\S]*3\. worker 1 writes 1[\s\S]*4\. worker 2 writes 1 ->/);
  assert.doesNotMatch(stdout, /5\./);
  const bad = chart.match(/state "W1 done, W2 done, count 1" as (s\d+)/)[1];
  assert.match(chart, new RegExp(`class ${bad} breaks`));
  assert.equal(chart.match(/class s\d+ (breaks|mayBreak)/g).length, 1);
});

test("the checker passes the model that adds in one step", () => {
  const dir = mkdtempSync(join(tmpdir(), "model-check-fixed-"));
  const model = join(dir, "fixed.mjs");
  writeFileSync(model, `export * from ${JSON.stringify(example.href)};
export function step(s, e) {
  if (e.type !== "write" || s.worker[e.w] !== "idle") return s;
  const worker = [...s.worker];
  worker[e.w] = "done";
  return { ...s, count: s.count + 1, worker };
}
`);
  const { status, stdout } = check(model);
  rmSync(dir, { recursive: true, force: true });
  assert.equal(status, 0, stdout);
  assert.match(stdout, /Holds: When both workers are done/);
  assert.match(stdout, /Holds: Each state that is not an end state/);
});

test("the checker reports a stuck state", () => {
  const dir = mkdtempSync(join(tmpdir(), "model-check-stuck-"));
  const model = join(dir, "stuck.mjs");
  writeFileSync(model, `export * from ${JSON.stringify(example.href)};
export const done = () => false;
`);
  const { status, stdout } = check(model);
  rmSync(dir, { recursive: true, force: true });
  assert.equal(status, 1, stdout);
  assert.match(stdout, /BREAKS: Each state that is not an end state/);
});

test("the checker reports a loop with no way to an end state", () => {
  const dir = mkdtempSync(join(tmpdir(), "model-check-loop-"));
  const model = join(dir, "loop.mjs");
  writeFileSync(model, `export const initial = { phase: "start" };
export const events = [{ type: "try" }, { type: "fail" }, { type: "finish" }];
export function step(s, e) {
  if (s.phase === "start" && e.type === "try") return { phase: "trying" };
  if (s.phase === "start" && e.type === "finish") return { phase: "end" };
  if (s.phase === "trying" && e.type === "fail") return { phase: "retry" };
  if (s.phase === "retry" && e.type === "try") return { phase: "trying" };
  return s;
}
export const rules = {};
export const label = (s) => s.phase;
export const done = (s) => s.phase === "end";
`);
  const { status, stdout } = check(model);
  rmSync(dir, { recursive: true, force: true });
  assert.equal(status, 1, stdout);
  assert.match(stdout, /Holds: Each state that is not an end state/);
  assert.match(stdout, /BREAKS: An end state can be reached[\s\S]*1\. try -> trying/);
});

test("the checker stops at the state limit", () => {
  const out = mkdtempSync(join(tmpdir(), "model-check-limit-"));
  const run = spawnSync(process.execPath,
    [checker, fileURLToPath(example), out, "--limit", "5"],
    { encoding: "utf8" });
  rmSync(out, { recursive: true, force: true });
  assert.equal(run.status, 2, run.stdout);
  assert.match(run.stderr, /More than 5 states/);
});

test("an error in the model exits with 2, not as a broken rule", () => {
  const dir = mkdtempSync(join(tmpdir(), "model-check-error-"));
  const model = join(dir, "error.mjs");
  writeFileSync(model, `export * from ${JSON.stringify(example.href)};
export const rules = { boom: () => { throw new Error("bad rule"); } };
`);
  const run = spawnSync(process.execPath, [checker, model, dir],
    { encoding: "utf8" });
  rmSync(dir, { recursive: true, force: true });
  assert.equal(run.status, 2, run.stderr);
  assert.match(run.stderr, /bad rule/);
});
