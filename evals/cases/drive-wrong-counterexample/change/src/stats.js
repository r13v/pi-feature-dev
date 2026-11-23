// Returns the median of a non-empty list of numbers.
export function median(values) {
  if (values.length === 0) throw new Error("empty list");
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
}
