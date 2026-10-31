import { test } from "node:test";
import assert from "node:assert/strict";
import { createStore } from "../src/store.js";
import { DEFAULTS, watchSettings, saveWatchSettings } from "../src/settings.js";

test("returns defaults when nothing is saved", () => {
  assert.deepEqual(watchSettings(createStore()), DEFAULTS);
});

test("returns the saved settings", () => {
  const s = createStore();
  saveWatchSettings(s, { maxWatches: 2, pollSeconds: 30 });
  assert.deepEqual(watchSettings(s), { maxWatches: 2, pollSeconds: 30 });
});
