import { appendFileSync, existsSync } from "node:fs";
import { join } from "node:path";

export function recordCliRun(arg, status) {
  const gitDir = join(process.cwd(), ".git");
  if (!existsSync(gitDir)) return;
  appendFileSync(
    join(gitDir, "cli-runs.jsonl"),
    JSON.stringify({ arg: arg ?? "", status }) + "\n",
  );
}
