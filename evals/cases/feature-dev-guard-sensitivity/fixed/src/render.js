export function render(item) {
  if (!item.caseId) throw new Error("caseId required");
  return `<a href="/cases/${item.caseId}">${item.label}</a>`;
}
