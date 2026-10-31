export function total(items) {
  return items.reduce((s, i) => s + i.price * i.qty, 0);
}
