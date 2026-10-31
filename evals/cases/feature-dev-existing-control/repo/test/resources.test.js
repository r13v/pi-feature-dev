import { test } from "node:test";
import assert from "node:assert/strict";
import { resourceForm } from "../src/resources.js";

test("has title", () => {
  assert.match(resourceForm(), /name="title"/);
});
