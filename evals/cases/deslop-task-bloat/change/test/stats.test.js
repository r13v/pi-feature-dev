import { test } from "node:test";
import assert from "node:assert/strict";
import { sum, average } from "../src/stats.js";

test("sum adds numbers", () => {
  assert.equal(sum([1, 2, 3]), 6);
});

test("average of numbers", () => {
  assert.equal(average([2, 4]), 3);
});

test("average returns the mean", () => {
  assert.equal(average([2, 4]), 3);
});

test("average is a function", () => {
  assert.equal(typeof average, "function");
});
