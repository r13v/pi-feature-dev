const UNITS = { h: 3600, m: 60, s: 1 };

// Parses a duration such as "1h30m" into seconds.
export function parseDuration(text) {
  if (text === "") throw new Error("empty duration");
  let total = 0;
  for (const [, n, unit] of text.matchAll(/(\d+)([a-z])/g)) {
    total += Number(n) * (UNITS[unit] ?? 0);
  }
  return total;
}
