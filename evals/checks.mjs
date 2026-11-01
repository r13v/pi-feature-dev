// Assertions for the cases in promptfooconfig.yaml. Each one reads the
// working directory of the run from the provider metadata.
import { spawnSync } from "node:child_process";
import { existsSync, readdirSync, readFileSync } from "node:fs";
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
    // A ceiling, not a target: rounds of 660+ words lost the user in real
    // runs, and a tighter limit would cut the reasons for recommendations.
    "at most 600 words": words <= 600,
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

// The text of the option that each "Recommend X" line points to.
function recommendedOptions(output) {
  return output.split("❓").slice(1).map((block) => {
    const label = block.match(/Recommend\**\s*\**([A-Z])\b/)?.[1];
    return label ? block.match(new RegExp(`\\*\\*${label}:([^\\n]*)`))?.[1]
      ?? "" : "";
  });
}

// The newest progress file: the agent may start a new run instead of
// continuing the one in the fixture.
function progressFile(dir) {
  const ship = join(dir, ".git", "ship");
  const files = existsSync(ship) ? readdirSync(ship).sort() : [];
  return files.length ? readFileSync(join(ship, files.at(-1)), "utf8") : "";
}

export function grillReadsRepoRules(output, { metadata }) {
  // A recommendation is the recommended option of a question, or a line in
  // the list of defaults after the questions.
  const start = output.search(/unless you object|если не возразите/i);
  const defaults = start < 0 ? [] : output.slice(start).split("\n")
    .filter((l) => /^\s*- /.test(l));
  const uiOnly = /UI[- ]?(text )?only|only (in )?(the )?(UI|interface)|только (в )?(UI|интерфейсе)/i;
  return result({
    "cites the naming rule": /naming\.md/.test(output),
    "no UI-only recommendation": ![...recommendedOptions(output), ...defaults]
      .some((o) => saysWithoutNegation(o, uiOnly)),
    "no files changed": unchanged(metadata.workdir),
  });
}

export function shipSkillFeedback(output, { metadata }) {
  const feedback = join(metadata.workdir, ".git", "skill-feedback.md");
  const text = existsSync(feedback) ? readFileSync(feedback, "utf8") : "";
  const progress = progressFile(metadata.workdir);
  return result({
    "idea in the feedback file": /grill/.test(text)
      && /term|defin|slug/i.test(text),
    "run finished": /status: finished/.test(progress),
    "nothing pending": !/deferred ideas: pending/.test(progress),
  });
}

export function shipDelegatedIdeas(output, { metadata }) {
  const dir = join(metadata.workdir, "docs", "backlog");
  const items = existsSync(dir) ? readdirSync(dir)
    .map((f) => readFileSync(join(dir, f), "utf8")) : [];
  const progress = progressFile(metadata.workdir);
  return result({
    "run finished": /status: finished/.test(progress),
    "nothing pending": !/: pending/.test(progress),
    "CSV idea filed": items.some((t) => /csv/i.test(t)),
    "tests pass": testsPass(metadata.workdir),
  });
}

export function shipReviewBeforeDeslop(output, { metadata }) {
  const r = spawnSync("node", ["--input-type=module", "-e",
    "import { parseDuration } from './src/duration.js';"
    + "try { parseDuration('5x'); process.exit(1); } catch { process.exit(0) }",
  ], { cwd: metadata.workdir });
  return result({
    "review recorded": /feature-dev review: done/
      .test(progressFile(metadata.workdir)),
    "unknown unit throws": r.status === 0,
    "tests pass": testsPass(metadata.workdir),
  });
}

export function finalCheckRenamedDocs(output, { metadata }) {
  const docs = read(metadata.workdir, "README.md")
    + read(metadata.workdir, "docs/api.md");
  return result({
    "no old name in the docs":
      !/## fetchUser|import \{ fetchUser|fetchUser\(1\)/.test(docs),
    "new name documented": /loadUser/.test(docs),
    "tests pass": testsPass(metadata.workdir),
  });
}

export function shipBacklogMovedLine(output, { metadata }) {
  return result({
    "item kept": existsSync(join(metadata.workdir,
      "docs/backlog/export-ignores-time-zone.md")),
    "not called stale": !saysWithoutNegation(output,
      /\bstale\b|already (done|fixed)|устарел|уже (сделан|исправлен)/i),
    "run started": progressFile(metadata.workdir) !== "",
  });
}

export function deslopCommentNoise(output, { metadata }) {
  const fmt = read(metadata.workdir, "src/format.js");
  const tests = read(metadata.workdir, "test/cart.test.js")
    .match(/^test\(/gm) ?? [];
  return result({
    "duplicate tests removed": tests.length <= 6,
    "history removed": !/Previously|after review/i.test(fmt),
    "restatement removed": !/Formats money|divide by 100/i.test(fmt),
    "commented-out code removed": !/toFixed/.test(fmt),
    "reason kept": /printer driver/.test(fmt),
    "tests pass": testsPass(metadata.workdir),
  });
}

export function shipWrongCounterexample(output, { metadata }) {
  const r = spawnSync("node", ["--input-type=module", "-e",
    "import { median } from './src/stats.js';"
    + "process.exit(median([4, 1, 3, 2]) === 2.5 ? 0 : 1)",
  ], { cwd: metadata.workdir });
  return result({
    "review recorded": /feature-dev review: (done|skipped)/
      .test(progressFile(metadata.workdir)),
    "even-length median kept": r.status === 0,
    "tests pass": testsPass(metadata.workdir),
  });
}
