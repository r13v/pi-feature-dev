export function run(cmd, text) {
  if (cmd === "count") return String(text.split(/\s+/).length);
  if (cmd === "translate") return callLlm(process.env.LLM_API_KEY, text);
  throw new Error(`unknown command ${cmd}`);
}

function callLlm(key, text) {
  return `[${key ? "ok" : "no key"}] ${text}`;
}
