import { test } from "node:test";
import assert from "node:assert/strict";
import { money } from "../src/format.js";

test("formats euros", () => assert.match(money(1234), /12,34/));
