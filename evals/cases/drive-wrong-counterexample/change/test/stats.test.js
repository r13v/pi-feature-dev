import { test } from "node:test";
import assert from "node:assert/strict";
import { median } from "../src/stats.js";

test("odd length", () => assert.equal(median([3, 1, 2]), 2));
test("empty list", () => assert.throws(() => median([])));
