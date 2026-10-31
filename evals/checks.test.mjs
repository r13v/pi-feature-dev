// Checks the checks without an agent. For each case, the check must fail on
// the fixture with `bad-output.txt`, and pass on the `fixed/` overlay with
// `fixed-output.txt`: a good result made by hand.
import { test } from "node:test";
import assert from "node:assert/strict";
import { cpSync, existsSync, readdirSync, readFileSync, rmSync } from "node:fs";
import { join } from "node:path";
import * as checks from "./checks.mjs";
import { makeWorkdir } from "./provider.mjs";

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
      cpSync(join(dir, "fixed"), workdir, { recursive: true });
    }
    const output = text(join(dir, "fixed-output.txt"));
    const r = check(output, { metadata: { workdir } });
    assert.equal(r.pass, true, r.reason);
  });
}
