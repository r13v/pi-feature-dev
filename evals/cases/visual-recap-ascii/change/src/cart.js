import { total } from "./price.js";

export function checkout(cart, user) {
  return { user: user.id, amount: total(cart.items, user.discount ?? 0) };
}
