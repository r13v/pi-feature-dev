import { test } from "node:test";
import assert from "node:assert/strict";
import { trim } from "../src/text.js";

test("trim removes outer spaces", () => {
  assert.equal(trim("  a "), "a");
});
