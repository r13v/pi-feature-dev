import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { reminderCommandChecks } from "./checks.mjs";

function command(skill) {
  return skill.split("```sh\n")[1].split("\n```")[0];
}

test("the documented reminder preserves the review history boundary", () => {
  const skill = readFileSync(new URL("../skills/dream/SKILL.md",
    import.meta.url), "utf8");
  const checks = reminderCommandChecks(command(skill));
  assert.equal(Object.values(checks).every(Boolean), true,
    JSON.stringify(checks));
});

test("the reminder check catches the original checkpoint corruption", () => {
  const old = 'd=$(git rev-parse --git-common-dir) || exit 0; '
    + 'find "$d/dream-last" -mtime -7 2>/dev/null | grep -q . || '
    + '{ touch "$d/dream-last"; printf \'{"systemMessage":"Review memory"}\\n\'; }';
  const checks = reminderCommandChecks(old);
  assert.equal(checks["first reminder emitted"], true);
  assert.equal(checks["missing review watermark stays absent"], false);
  assert.equal(checks["old review watermark preserved"], false);
});

test("the reminder check rejects a throttle that never expires", () => {
  const permanent = 'd=$(git rev-parse --git-common-dir) || exit 0; '
    + 'find "$d/dream-last" -mtime -7 2>/dev/null | grep -q . || '
    + 'test -e "$d/dream-reminded" || { touch "$d/dream-reminded"; '
    + 'printf \'{"systemMessage":"Review memory"}\\n\'; }';
  const checks = reminderCommandChecks(permanent);
  assert.equal(checks["first reminder emitted"], true);
  assert.equal(checks["expired reminder emits again"], false);
});
