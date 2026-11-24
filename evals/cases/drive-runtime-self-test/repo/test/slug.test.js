import { test } from "node:test";
import assert from "node:assert/strict";
import { slugify } from "../src/slug.js";

test("slugify returns a string", () => {
  assert.equal(typeof slugify("hello"), "string");
});
