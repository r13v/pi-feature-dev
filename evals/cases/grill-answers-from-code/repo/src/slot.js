// A contribution is { id, enabled, load }, where load() returns a Promise of
// the component. load() is called only for enabled contributions.
export async function render(contribs) {
  const out = [];
  for (const c of contribs) {
    if (!c.enabled) continue;
    out.push(await c.load());
  }
  return out;
}
