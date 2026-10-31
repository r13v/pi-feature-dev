import { test } from "node:test";
import assert from "node:assert/strict";
import { fetchUser } from "../src/users.js";

test("finds a user", () => assert.equal(fetchUser(1).name, "Ada"));
