export function run(cmd, text) {
  if (cmd === "count") return String(text.split(/\s+/).length);
  throw new Error(`unknown command ${cmd}`);
}
