export function createStore() {
  const m = new Map();
  return { get: (k) => m.get(k), set: (k, v) => m.set(k, v) };
}
