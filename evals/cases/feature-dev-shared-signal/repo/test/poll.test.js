import { test } from "node:test";
import assert from "node:assert/strict";
import { outcome } from "../src/poll.js";
test("success", () => assert.equal(outcome({aborted:false}, null), "ok"));
