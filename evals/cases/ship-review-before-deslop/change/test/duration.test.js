import { test } from "node:test";
import assert from "node:assert/strict";
import { parseDuration } from "../src/duration.js";

test("hours and minutes", () => assert.equal(parseDuration("1h30m"), 5400));
test("seconds", () => assert.equal(parseDuration("45s"), 45));
