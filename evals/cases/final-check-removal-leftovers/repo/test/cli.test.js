import { test } from "node:test";
import assert from "node:assert/strict";
import { run } from "../src/cli.js";

test("count", () => {
  assert.equal(run("count", "a b c"), "3");
});
