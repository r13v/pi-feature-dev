import { test } from "node:test";
import assert from "node:assert/strict";
import { trim, slugify } from "../src/text.js";

test("trim removes outer spaces", () => {
  assert.equal(trim("  a "), "a");
});

test("slugify lowercases and joins words with dashes", () => {
  assert.equal(slugify("Hello World"), "hello-world");
});
