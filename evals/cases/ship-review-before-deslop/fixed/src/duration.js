const UNITS = { h: 3600, m: 60, s: 1 };

// Parses a duration such as "1h30m" into seconds.
export function parseDuration(text) {
  if (!/^(\d+[hms])+$/.test(text)) throw new Error(`bad duration: ${text}`);
  let total = 0;
  for (const [, n, unit] of text.matchAll(/(\d+)([hms])/g)) {
    total += Number(n) * UNITS[unit];
  }
  return total;
}
