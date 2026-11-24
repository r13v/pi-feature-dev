import { test } from "node:test";
import assert from "node:assert/strict";
import { slugify } from "../src/slug.js";

test("slugify normalizes text into hyphenated lowercase", () => {
  assert.equal(slugify("  Hello, World! "), "hello-world");
});

test("slugify returns empty string for punctuation-only input", () => {
  assert.equal(slugify("!!!"), "");
});
