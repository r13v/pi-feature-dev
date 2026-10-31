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

test("keeps a default for a limit added after the save", () => {
  const s = createStore();
  s.set("watch-settings", JSON.stringify({ maxWatches: 2 }));
  assert.equal(watchSettings(s).pollSeconds, 60);
});
