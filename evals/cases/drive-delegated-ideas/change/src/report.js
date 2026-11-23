export function report(rows) {
  const tmp = rows.map((r) => `${r.name}: ${r.amount}`);
  const total = rows.reduce((sum, r) => sum + r.amount, 0);
  return [...tmp, `Total: ${total}`].join("\n");
}
