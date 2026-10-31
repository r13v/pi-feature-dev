export function listDishes(items) {
  return items.filter((d) => d.steps.length > 0)
    .map((d) => ({ name: d.name, steps: d.steps.length }));
}
