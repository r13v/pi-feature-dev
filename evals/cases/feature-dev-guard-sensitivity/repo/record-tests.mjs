import { appendFileSync } from "node:fs";
import { render } from "./src/render.js";
let protectedMissing = false;
try { render({label:"A"}); } catch { protectedMissing = true; }
process.on("exit", (status) => {
  appendFileSync(".git/test-runs.jsonl",
    JSON.stringify({protectedMissing, status})+"\n");
});
