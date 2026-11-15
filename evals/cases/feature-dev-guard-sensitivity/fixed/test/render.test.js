import "../record-tests.mjs";
import { test } from "node:test";
import assert from "node:assert/strict";
import { render } from "../src/render.js";
test("renders case", () => assert.match(render({caseId:"a",label:"A"}), /cases\/a/));
test("rejects missing caseId", () => assert.throws(() => render({label:"A"}), /caseId/));
