export const items = [];

export function total(items) {
  return items.reduce((sum, i) => sum + i.price * i.qty, 0);
}

export function discount(sum, code) {
  if (code === "TEN") return sum * 0.9;
  return sum;
}
