export function report(rows) {
  const tmp = rows.map((r) => `${r.name}: ${r.amount}`);
  return tmp.join("\n");
}
