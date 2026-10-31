export const DEFAULTS = { maxWatches: 5, pollSeconds: 60 };

export function watchSettings(store) {
  const saved = store.get("watch-settings");
  return saved ? JSON.parse(saved) : DEFAULTS;
}

export function saveWatchSettings(store, settings) {
  store.set("watch-settings", JSON.stringify(settings));
}
