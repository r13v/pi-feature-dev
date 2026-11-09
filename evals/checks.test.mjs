// Checks the checks without an agent. For each case, the check must fail on
// the fixture with `bad-output.txt`, and pass on the `fixed/` overlay with
// `fixed-output.txt`: a good result made by hand.
import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync, readdirSync, readFileSync, rmSync,
  writeFileSync } from "node:fs";
import { join } from "node:path";
import * as checks from "./checks.mjs";
import { makeWorkdir, overlay } from "./provider.mjs";

const CASES = join(import.meta.dirname, "cases");

function text(file) {
  return existsSync(file) ? readFileSync(file, "utf8") : "";
}

for (const name of readdirSync(CASES)) {
  const dir = join(CASES, name);
  const check = checks[name.replace(/-(\w)/g, (_, c) => c.toUpperCase())];

  test(`${name}: has a check and a good result`, () => {
    assert.equal(typeof check, "function");
    assert.ok(existsSync(join(dir, "fixed"))
      || existsSync(join(dir, "fixed-output.txt")));
  });

  test(`${name}: the check fails on a bad result`, (t) => {
    const workdir = makeWorkdir(name, "working");
    t.after(() => rmSync(workdir, { recursive: true }));
    const output = text(join(dir, "bad-output.txt"));
    assert.equal(check(output, { metadata: { workdir } }).pass, false);
  });

  test(`${name}: the check passes on the good result`, (t) => {
    const workdir = makeWorkdir(name, "working");
    t.after(() => rmSync(workdir, { recursive: true }));
    if (existsSync(join(dir, "fixed"))) {
      overlay(join(dir, "fixed"), workdir);
    }
    const output = text(join(dir, "fixed-output.txt"));
    const r = check(output, { metadata: { workdir } });
    assert.equal(r.pass, true, r.reason);
  });
}

test("STE rejects an inferred check target even with a disclaimer", (t) => {
  const workdir = makeWorkdir("ste-russian-meaning", "working");
  t.after(() => rmSync(workdir, { recursive: true }));
  overlay(join(CASES, "ste-russian-meaning", "fixed"), workdir);
  const file = join(workdir, "docs/deploy.md");
  const doc = readFileSync(file, "utf8");
  writeFileSync(file, doc.replace("выполнить проверку:", "проверить её командой"));
  const r = checks.steRussianMeaning("Объект проверки — моя интерпретация.",
    { metadata: { workdir } });
  assert.equal(r.pass, false);
  assert.match(r.reason, /check target not invented/);
});

test("a wrapped historical command is not a current instruction", (t) => {
  const workdir = makeWorkdir("dream-keeps-unverified", "working");
  t.after(() => rmSync(workdir, { recursive: true }));
  const file = join(workdir, "memory/test-command.md");
  writeFileSync(file, "Use `npm test`.\n\nWhy: test:unit is gone.\n\n"
    + "How to apply: use npm test; do not use the removed\n"
    + "`test:unit` script.\n");
  assert.equal(checks.dreamKeepsUnverified("", { metadata: { workdir } })
    .pass, true);
  writeFileSync(file, "Run the tests with\n`npm run test:unit`.\n\n"
    + "The package also has npm test.\n");
  assert.equal(checks.dreamKeepsUnverified("", { metadata: { workdir } })
    .pass, false);
  writeFileSync(file, "Run npm run test:unit.\n"
    + "Use npm test for the old export helper.\n");
  assert.equal(checks.dreamKeepsUnverified("", { metadata: { workdir } })
    .pass, false);
});
