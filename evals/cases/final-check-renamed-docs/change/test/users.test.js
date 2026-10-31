import { test } from "node:test";
import assert from "node:assert/strict";
import { loadUser } from "../src/users.js";

test("finds a user", () => assert.equal(loadUser(1).name, "Ada"));
