export function render(item) {
  return `<a href="/cases/${item.caseId}">${item.label}</a>`;
}
