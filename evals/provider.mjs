// promptfoo provider that runs one skill case in a clean CLI session.
// Each call gets a fresh git repo from the case fixture and the skills from
// `config.skills`: `working` for the working tree, or any git ref.
import { execFileSync, spawnSync } from "node:child_process";
import { cpSync, existsSync, mkdirSync, mkdtempSync, symlinkSync }
  from "node:fs";
import { homedir, tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = dirname(dirname(fileURLToPath(import.meta.url)));
// Outside the home directory, so that neither CLI finds a CLAUDE.md or an
// AGENTS.md of the user in a parent directory.
const RUNS = join(tmpdir(), "skill-evals");

function sh(cwd, cmd, args, input) {
  return execFileSync(cmd, args, { cwd, input, encoding: "utf8" });
}

function copySkills(ref, dest) {
  mkdirSync(dest, { recursive: true });
  if (ref === "working") {
    cpSync(join(ROOT, "skills"), dest, { recursive: true });
    return;
  }
  const tar = execFileSync("git", ["archive", ref, "skills"], { cwd: ROOT });
  execFileSync("tar", ["-x", "--strip-components=1", "-C", dest], {
    input: tar,
  });
}

export function makeWorkdir(caseName, skillsRef) {
  const caseDir = join(ROOT, "evals", "cases", caseName);
  mkdirSync(RUNS, { recursive: true });
  const dir = mkdtempSync(join(RUNS, `${caseName}-`));
  cpSync(join(caseDir, "repo"), dir, { recursive: true });
  sh(dir, "git", ["init", "-q"]);
  sh(dir, "git", ["add", "-A"]);
  sh(dir, "git", ["-c", "user.name=eval", "-c", "user.email=eval@local",
    "commit", "-qm", "base"]);
  // Files in `change/` are the uncommitted changes of the task.
  if (existsSync(join(caseDir, "change"))) {
    cpSync(join(caseDir, "change"), dir, { recursive: true });
  }
  // Skills are project skills, so the global install is not used. They are
  // excluded from git so that a check sees only the changes of the agent.
  copySkills(skillsRef, join(dir, ".claude", "skills"));
  copySkills(skillsRef, join(dir, ".agents", "skills"));
  sh(dir, "sh", ["-c", "printf '.claude/\\n.agents/\\n' >> .git/info/exclude"]);
  return dir;
}

function runClaude(dir, prompt, config) {
  const args = ["-p", prompt, "--output-format", "json",
    "--setting-sources", "project", "--strict-mcp-config",
    "--permission-mode", "bypassPermissions"];
  if (config.model) args.push("--model", config.model);
  if (config.effort) args.push("--effort", config.effort);
  const r = spawnSync("claude", args, { cwd: dir, encoding: "utf8",
    timeout: 20 * 60_000 });
  if (r.status !== 0) return { error: r.stderr || r.stdout || "claude failed" };
  const json = JSON.parse(r.stdout);
  return { output: json.result, cost: json.total_cost_usd };
}

function runCodex(dir, prompt, config) {
  // An own CODEX_HOME with only the login: --ignore-user-config still reads
  // the global AGENTS.md.
  const home = join(dir, ".git", "codex-home");
  mkdirSync(home);
  symlinkSync(join(process.env.CODEX_HOME ?? join(homedir(), ".codex"),
    "auth.json"), join(home, "auth.json"));
  const last = join(dir, ".git", "codex-last.txt");
  const args = ["exec", "--ephemeral",
    "--sandbox", "workspace-write", "--output-last-message", last, prompt];
  if (config.model) args.splice(1, 0, "--model", config.model);
  const r = spawnSync("codex", args, { cwd: dir, encoding: "utf8",
    env: { ...process.env, CODEX_HOME: home }, timeout: 20 * 60_000 });
  if (r.status !== 0) return { error: r.stderr || "codex failed" };
  return { output: sh(dir, "cat", [last]) };
}

export default class SkillAgent {
  constructor(options) {
    this.config = { agent: "claude", skills: "working",
      ...options.config };
    this.label = options.label;
  }

  id() {
    return `${this.config.agent}@${this.config.skills}`;
  }

  async callApi(prompt, context) {
    const dir = makeWorkdir(context.vars.case, this.config.skills);
    const run = this.config.agent === "codex" ? runCodex : runClaude;
    const result = run(dir, prompt, this.config);
    return { ...result, metadata: { workdir: dir } };
  }
}
