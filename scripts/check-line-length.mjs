// Fail when a Markdown line in skills/ is longer than MAX characters.
// Frontmatter, fenced code, tables, headings, and lines with one unbreakable
// token, such as a long URL, are not checked.
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

const MAX = 80;

function markdownFiles(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) return markdownFiles(path);
    return entry.name.endsWith(".md") ? [path] : [];
  });
}

function longLines(text) {
  const lines = text.split("\n");
  const found = [];
  let frontmatter = lines[0] === "---";
  let fence = null;
  lines.forEach((line, index) => {
    if (index === 0 && frontmatter) return;
    if (frontmatter) {
      if (line === "---") frontmatter = false;
      return;
    }
    const marker = line.trimStart().match(/^(`{3,}|~{3,})/);
    if (marker) {
      if (fence === null) fence = marker[1];
      else if (marker[1].startsWith(fence)) fence = null;
      return;
    }
    if (fence !== null || line.length <= MAX) return;
    const body = line.trim();
    if (body.startsWith("|") || body.startsWith("#")) return;
    if (!/\s/.test(body.replace(/^([-*+>]|\d+[.)])\s+/, ""))) return;
    found.push({ line: index + 1, length: line.length });
  });
  return found;
}

let failures = 0;
for (const file of markdownFiles("skills").sort()) {
  for (const { line, length } of longLines(readFileSync(file, "utf8"))) {
    console.error(`${file}:${line}: ${length} characters, max ${MAX}`);
    failures += 1;
  }
}
if (failures > 0) {
  console.error(`${failures} lines are longer than ${MAX} characters.`);
  process.exit(1);
}
