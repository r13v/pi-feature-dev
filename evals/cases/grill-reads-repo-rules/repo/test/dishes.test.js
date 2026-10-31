import { test } from "node:test";
import assert from "node:assert/strict";
import { listDishes } from "../src/dishes.js";

test("skips a dish with no steps", () => {
  assert.equal(listDishes([{ name: "tea", steps: [] }]).length, 0);
});
