import { listDishes } from "./dishes.js";

export function renderDishes(items) {
  const rows = listDishes(items)
    .map((d) => `<li>${d.name}: ${d.steps} steps</li>`);
  return `<h1>Dishes</h1><ul>${rows.join("")}</ul>`;
}
