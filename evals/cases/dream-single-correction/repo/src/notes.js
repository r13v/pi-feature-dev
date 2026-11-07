export function listNotes(store) {
  return [...store.values()].sort((a, b) => a.id - b.id);
}
