import { test } from "node:test";
import assert from "node:assert/strict";
import { parsePort } from "../src/parser.js";

test("parsePort parses a valid port", () => {
  assert.equal(parsePort("8080"), 8080);
});

test("parsePort rejects out of range values", () => {
  assert.throws(() => parsePort("0"));
  assert.throws(() => parsePort("abc"));
});
