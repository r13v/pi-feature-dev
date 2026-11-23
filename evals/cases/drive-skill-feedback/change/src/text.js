export const trim = (s) => s.trim();

export function slugify(s) {
  return s.toLowerCase().replace(/ +/g, "-").replace(/[^a-z0-9-]/g, "");
}
