export const DEFAULTS = { maxWatches: 5, pollSeconds: 60 };

// Defaults until an admin saves them, and for a limit added after the save.
export function watchSettings(store) {
  const saved = store.get("watch-settings");
  return saved ? { ...DEFAULTS, ...JSON.parse(saved) } : DEFAULTS;
}

export function saveWatchSettings(store, settings) {
  store.set("watch-settings", JSON.stringify(settings));
}
