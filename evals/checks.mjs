// Assertions for the cases in promptfooconfig.yaml. Each one reads the
// working directory of the run from the provider metadata.
import { spawnSync } from "node:child_process";
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

function result(checks) {
  const failed = Object.entries(checks).filter(([, ok]) => !ok);
  return {
    pass: failed.length === 0,
    score: 1 - failed.length / Object.keys(checks).length,
    reason: failed.length ? `failed: ${failed.map(([n]) => n).join(", ")}`
      : "all checks passed",
  };
}

function read(dir, file) {
  return readFileSync(join(dir, file), "utf8");
}

function testsPass(dir) {
  return spawnSync("node", ["--test"], { cwd: dir }).status === 0;
}

function fileUnchanged(dir, file) {
  return spawnSync("git", ["diff", "--quiet", "--", file], { cwd: dir })
    .status === 0;
}

// True when a line matches `pattern` and does not negate it, so that
// "no API key needed" does not count as asking for a key.
function saysWithoutNegation(text, pattern) {
  return text.split("\n").some((line) => pattern.test(line)
    && !/\b(no|none|not|without|never|instead|out of scope|later)\b|без|не /i
      .test(line));
}

function unchanged(dir) {
  const r = spawnSync("git", ["status", "--porcelain"], { cwd: dir,
    encoding: "utf8" });
  return r.stdout.trim() === "";
}

export function deslopTaskBloat(output, { metadata }) {
  const src = read(metadata.workdir, "src/stats.js");
  const test = read(metadata.workdir, "test/stats.test.js");
  const averageTests = test.match(/test\("average/g) ?? [];
  return result({
    "average kept": /export function average/.test(src),
    "rethrowing catch removed": !/catch/.test(src),
    "restating comments removed": !/\/\/ (Calculate|Divide)/.test(src),
    "duplicate average tests removed": averageTests.length === 1,
    "tests pass": testsPass(metadata.workdir),
  });
}

export function finalCheckMissedItem(output, { metadata }) {
  const src = read(metadata.workdir, "src/text.js");
  const fixed = /\[\^a-z0-9-\]|\[\^a-z\d-\]|\\W/.test(src);
  const named = /strip|remov|a-z0-9|special|non-alphanumeric|punctuation/i
    .test(output);
  return result({
    "missing item 3 found": named || fixed,
    "tests pass": testsPass(metadata.workdir),
  });
}

export function grillRoundSize(output, { metadata }) {
  const questions = (output.match(/❓/g) ?? []).length
    || output.split("\n").filter((l) => l.trim().endsWith("?")).length;
  const words = output.split(/\s+/).filter(Boolean).length;
  return result({
    "at most 3 questions": questions > 0 && questions <= 3,
    "at most 350 words": words <= 350,
    "no files changed": unchanged(metadata.workdir),
  });
}

export function finalCheckRemovalLeftovers(output, { metadata }) {
  const docs = read(metadata.workdir, "README.md")
    + read(metadata.workdir, "docs/usage.md");
  return result({
    "no history note": !/LLM|anymore|no longer|removed/i.test(docs),
    "no stale translate mention": !/translat/i.test(docs),
    "count still documented": /count/.test(docs),
    "tests pass": testsPass(metadata.workdir),
  });
}

export function featureDevExistingControl(output, { metadata }) {
  const src = read(metadata.workdir, "src/resources.js");
  return result({
    "uses the existing picker": /slackChannelPicker\(/.test(src),
    "manual Slack fields removed": !/textField\("slack/.test(src),
    "no raw input added": !/<input|<select/.test(src),
    "title kept": /"title"/.test(src),
    "tests pass": testsPass(metadata.workdir),
  });
}

export function grillAnswersFromCode(output, { metadata }) {
  return result({
    "cites the code": /slot\.js|slot\.test\.js|load\(\)/.test(output),
    "says it already works": /already|уже/i.test(output),
    "no files changed": unchanged(metadata.workdir),
  });
}

export function elevateKeepsConstraint(output, { metadata }) {
  return result({
    "ideas tied to the docs": /photo|фото|damage|mess/i.test(output),
    "no live API test or key asked": !saysWithoutNegation(output,
      /(need|get|request|ask for)\w* (an? )?api key|(run|call|hit|test)\w*[^.\n]{0,40}(real|live) (api|test)/i),
    "no files changed": unchanged(metadata.workdir),
  });
}

export function deepenTellingSample(output, { metadata }) {
  return result({
    "proposes a small sample": /subset|sample|representative|telling|показательн|выборк|\b([3-9]|1[0-6]) (cases|кейс)/i.test(output),
    "no files changed": unchanged(metadata.workdir),
  });
}

export function deslopSpeculativeDefaults(output, { metadata }) {
  const src = read(metadata.workdir, "src/settings.js");
  const test = read(metadata.workdir, "test/settings.test.js");
  return result({
    "defaults merge removed": !/\.\.\.DEFAULTS/.test(src),
    "compat test removed": !/added after/i.test(test),
    "defaults still returned": /:\s*DEFAULTS/.test(src),
    "tests pass": testsPass(metadata.workdir),
  });
}

export function backlogFilesNotedIdea(output, { metadata }) {
  const dir = metadata.workdir;
  const added = readdirSync(join(dir, "docs/backlog"))
    .filter((f) => f.endsWith(".md") && f !== "export-ignores-time-zone.md")
    .map((f) => read(dir, `docs/backlog/${f}`));
  // The 403 idea is already noted in docs/pending-checks.md. The user wants
  // it filed anyway; whether the short id idea passes the bar is a judgement.
  return result({
    "403 idea filed": added.some((t) => /403/.test(t)),
    "front matter": added.length > 0
      && added.every((t) => /^---[\s\S]*?worth: (yes|later|no)/.test(t)),
    "existing item unchanged":
      fileUnchanged(dir, "docs/backlog/export-ignores-time-zone.md"),
    "pending note unchanged": fileUnchanged(dir, "docs/pending-checks.md"),
  });
}

export function steKeepsEveryLimit(output, { metadata }) {
  const doc = read(metadata.workdir, "docs/deploy.md");
  const at = (s) => doc.indexOf(s);
  return result({
    "verify kept": at("npm run verify") >= 0,
    "staging kept": at("--env staging") >= 0,
    "production kept": at("--env production") >= 0,
    "rollback kept": at("--rollback") >= 0,
    "10 minutes kept": /10 min/i.test(doc),
    "1% kept": /1\s?%/.test(doc),
    "24 hours kept": /24 hours/i.test(doc),
    "order kept": at("npm run verify") < at("--env staging")
      && at("--env staging") < at("--env production"),
    "shorter": doc.split(/\s+/).filter(Boolean).length < 110,
  });
}

export function visualRecapAscii(output, { metadata }) {
  return result({
    "no Mermaid": !/```mermaid|flowchart (TD|LR)|sequenceDiagram|graph (TD|LR)/
      .test(output),
    "ASCII diagram": /-->|->|──|│|\+--|=>/.test(output),
    "names total and checkout": /total/.test(output) && /checkout/.test(output),
    "discount mentioned": /discount/i.test(output),
    "sources not edited":
      /discount = 0/.test(read(metadata.workdir, "src/price.js")),
  });
}
