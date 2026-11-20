import { test } from "node:test";
import assert from "node:assert/strict";
import { slugify, truncate } from "../src/text.js";

test("truncate keeps a short text", () => {
  assert.equal(truncate("abc", 5), "abc");
});

test("truncate adds an ellipsis", () => {
  assert.equal(truncate("abcdef", 4), "abc…");
});

test("slugify joins words with hyphens", () => {
  assert.equal(slugify("  Hello, World! "), "hello-world");
});
