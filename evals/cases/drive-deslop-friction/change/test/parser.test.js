import { test } from "node:test";
import assert from "node:assert/strict";
import { parsePort } from "../src/parser.js";

test("parsePort parses 8080", () => {
  assert.equal(parsePort("8080"), 8080);
});

test("parsePort returns a number for 8080", () => {
  assert.equal(typeof parsePort("8080"), "number");
});

test("parsePort returns a non-zero value for 8080", () => {
  assert.ok(parsePort("8080") > 0);
});

test("parsePort rejects out of range values", () => {
  assert.throws(() => parsePort("0"));
  assert.throws(() => parsePort("abc"));
});
