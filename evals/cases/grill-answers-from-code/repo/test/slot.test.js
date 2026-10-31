import { test } from "node:test";
import assert from "node:assert/strict";
import { render } from "../src/slot.js";

test("disabled contributions are never loaded", async () => {
  let loaded = false;
  await render([{ id: "a", enabled: false, load: () => { loaded = true; } }]);
  assert.equal(loaded, false);
});
