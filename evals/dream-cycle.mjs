// Exercise real state produced by an earlier review, rather than the
// hand-built pending candidate in the independent next-window fixture.
// Usage: node evals/dream-cycle.mjs <skill-ref> /tmp/dream-cycle.json
import { cpSync, existsSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { makeProbeWorkdir, makeWorkdir, runSession } from "./provider.mjs";
import { dreamCandidateFirst, dreamCandidateNext,
  dreamCandidateReplay } from "./checks.mjs";
import { noteExposure, probeChecks } from "./probes.mjs";

const ref = process.argv[2];
const outputFile = process.argv[3];
if (!ref || !outputFile) {
  throw new Error("Usage: dream-cycle.mjs <skill-ref> <output.json>");
}
const config = { agent: "codex", model: "gpt-6.1-sol", effort: "medium" };
const stages = [];

function review(name, window, check, previous) {
  const workdir = makeWorkdir(name, ref);
  if (previous) {
    // Replace all seeded state; a missing real candidate must stay missing.
    for (const path of ["memory", ".git/dream-candidates"]) {
      rmSync(join(workdir, path), { recursive: true, force: true });
      if (existsSync(join(previous, path))) {
        cpSync(join(previous, path), join(workdir, path), { recursive: true,
          preserveTimestamps: true });
      }
    }
    if (existsSync(join(previous, ".git/dream-last"))) {
      cpSync(join(previous, ".git/dream-last"), join(workdir, ".git/dream-last"),
        { preserveTimestamps: true });
    }
  }
  const request = `Use dream. Memory is in memory/, transcripts in sessions/. `
    + `Review ${window} only. Apply memory edits and review state changes `
    + `at your discretion. Do not offer reminders or ask questions.`;
  const run = runSession(workdir, request, config);
  if (run.error) throw new Error(run.error);
  const grade = check(run.output, { metadata: { workdir } });
  stages.push({ name, workdir, output: run.output, grade });
  console.log(`${name}: ${grade.pass ? "pass" : grade.reason}`);
  return workdir;
}

const first = review("dream-candidate-first", "2026-10-01",
  dreamCandidateFirst);
const replay = review("dream-candidate-replay", "2026-10-09",
  dreamCandidateReplay, first);
const next = review("dream-candidate-next", "2026-10-09",
  dreamCandidateNext, replay);
const task = makeProbeWorkdir("progress-label", join(next, "memory"));
const request = readFileSync(new URL("./probes/progress-label/request.txt",
  import.meta.url), "utf8");
const run = runSession(task, request, config);
const probe = { name: "progress-label", after: { ...run, workdir: task } };
const checks = probeChecks(probe, "after");
const grade = { pass: Object.values(checks).every(Boolean), checks };
stages.push({ name: "fresh consumer", workdir: task, ...run, grade,
  exposure: noteExposure(task) });
console.log(`fresh consumer: ${grade.pass ? "pass" : "fail"}`);
writeFileSync(outputFile, JSON.stringify({ ref, config, stages,
  pass: stages.every((stage) => stage.grade.pass) }, null, 2) + "\n");
if (!stages.every((stage) => stage.grade.pass)) process.exitCode = 1;
