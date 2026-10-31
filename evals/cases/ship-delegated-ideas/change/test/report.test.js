import { test } from "node:test";
import assert from "node:assert/strict";
import { report } from "../src/report.js";

test("adds a total line", () => {
  assert.match(report([{ name: "a", amount: 2 }, { name: "b", amount: 3 }]),
    /Total: 5$/);
});
