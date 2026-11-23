import { test } from "node:test";
import assert from "node:assert/strict";
import { slugify } from "../src/text.js";

test("slugify", () => assert.equal(slugify("Hi There!"), "hi-there"));
