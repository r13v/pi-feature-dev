export function trim(s) {
  return s.trim();
}

export function slugify(s) {
  return s.toLowerCase().replace(/ +/g, "-");
}
