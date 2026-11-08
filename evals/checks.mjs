// Assertions for the cases in promptfooconfig.yaml. Each one reads the
// working directory of the run from the provider metadata.
import { spawnSync } from "node:child_process";
import { existsSync, mkdtempSync, readdirSync, readFileSync, rmSync,
  statSync, utimesSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { afterProbeChecks } from "./probes.mjs";

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

function memoryNotes(dir) {
  const notes = readdirSync(join(dir, "memory"))
    .filter((f) => f.endsWith(".md") && f !== "MEMORY.md");
  return { notes, text: notes.map((f) => read(dir, `memory/${f}`)).join("\n"),
    index: read(dir, "memory/MEMORY.md") };
}

// True when memory still tells to run test:unit. A line may still name it to
// say that it is gone.
function saysOldTestCommand(memory) {
  const gone = new RegExp(`\\b(${["no", "not", "never", "removed", "gone",
    "deleted", "instead", "longer", "obsolete", "old", "earlier", "former",
    "outdated", "stale", "replaced"].join("|")})\\b`, "i");
  return memory.split("\n")
    .some((line) => /test:unit/.test(line) && !gone.test(line));
}

function onlyMemoryChanged(dir) {
  return spawnSync("git", ["status", "--porcelain"], { cwd: dir,
    encoding: "utf8" }).stdout.split("\n").filter(Boolean)
    .every((l) => / memory\//.test(l));
}

export function dreamWrongNote(output, { metadata }) {
  const dir = metadata.workdir;
  const { notes, text, index } = memoryNotes(dir);
  return result({
    "wrong test command corrected": !saysOldTestCommand(text)
      && /npm test\b/.test(text),
    "correct fixtures note kept": /test\/fixtures/.test(text),
    "repeated correction recorded": /\btables?\b/i.test(text),
    "index lists every note": notes.every((f) => index.includes(f)),
    "only memory changed": onlyMemoryChanged(dir),
  });
}

export function dreamKeepsUnverified(output, { metadata }) {
  const dir = metadata.workdir;
  const { notes, text, index } = memoryNotes(dir);
  return result({
    "wrong test command corrected": !saysOldTestCommand(text)
      && /npm test\b/.test(text),
    "unverified note kept": /release\.sh/.test(text) && /\bask\b/i.test(text),
    "index lists every note": notes.every((f) => index.includes(f)),
    "only memory changed": onlyMemoryChanged(dir),
  });
}

export function dreamSingleCorrection(output, { metadata }) {
  const dir = metadata.workdir;
  const { notes, text, index } = memoryNotes(dir);
  return result({
    "one-time request not recorded": !/\bbranch|bugfix|\bfix\//i.test(text),
    "repeated correction recorded": /\btables?\b/i.test(text),
    "index lists every note": notes.every((f) => index.includes(f)),
    "only memory changed": onlyMemoryChanged(dir),
  });
}

export function dreamCorrectMemoryNoChange(output, { metadata }) {
  return result({
    "nothing changed": unchanged(metadata.workdir),
    "says the memory is correct": new RegExp("correct|changed no|unchanged"
      + "|no (memory )?(changes?|edits)\\b|nothing to change|left (them|it)",
    "i").test(output),
  });
}

export function dreamBehavior(output, { metadata }) {
  const expected = ["format-default", "format-explicit", "format-document",
    "arithmetic"];
  return consumerResult(dreamSingleCorrection(output, { metadata }),
    metadata, expected);
}

function consumerResult(review, metadata, expected) {
  const probes = metadata.probes ?? [];
  return result({
    "memory review passed": review.pass,
    "every consumer task ran before and after": probes.length === expected.length
      && expected.every((name) => probes.some((p) => p.name === name
        && [p.before, p.after].every((run) => run && !run.error
          && typeof run.output === "string"))),
    ...afterProbeChecks(probes),
  });
}

function pendingCandidates(dir) {
  const pending = join(dir, ".git/dream-candidates");
  return existsSync(pending) ? readdirSync(pending)
    .filter((name) => name.endsWith(".md"))
    .map((name) => readFileSync(join(pending, name), "utf8")).join("\n") : "";
}

export function dreamCandidateFirst(output, { metadata }) {
  const { text, index } = memoryNotes(metadata.workdir);
  const pending = pendingCandidates(metadata.workdir);
  return result({
    "single correction not promoted": !/launch gate/i.test(text + index),
    "candidate kept with original evidence": /launch gate/i.test(pending)
      && /session-1/.test(pending) && /2026-10-01/.test(pending)
      && /unconfirmed/i.test(pending),
    "only memory changed": onlyMemoryChanged(metadata.workdir),
  });
}

export function dreamCandidateNext(output, { metadata }) {
  const { text, index, notes } = memoryNotes(metadata.workdir);
  return result({
    "independent corrections promoted": /launch gate/i.test(text)
      && /session-1|2026-10-01/.test(text)
      && /session-2|2026-10-09/.test(text),
    "promoted candidate cleared": !/launch gate/i
      .test(pendingCandidates(metadata.workdir)),
    "notes indexed": notes.every((name) => index.includes(name)),
    "only memory changed": onlyMemoryChanged(metadata.workdir),
  });
}

export function dreamCandidateReplay(output, { metadata }) {
  return result({
    "candidate stays pending": dreamCandidateFirst(output, { metadata }).pass,
    "replayed evidence identified": /same|single|one session|unconfirmed|duplicate|excerpts|not independent/i
      .test(output),
  });
}

export function dreamPruneException(output, { metadata }) {
  const { text } = memoryNotes(metadata.workdir);
  return result({
    "default preserved": /waiting/.test(text),
    "approval exception preserved": /needs your OK/.test(text),
    "stale command removed": !/scripts\/old-export.sh/.test(text),
    "only memory changed": onlyMemoryChanged(metadata.workdir),
  });
}

export function dreamSyntheticContamination(output, { metadata }) {
  const { text, index } = memoryNotes(metadata.workdir);
  return result({
    "supported preference preserved": /plain sentences/.test(text),
    "synthetic source identified": /synthetic|untrusted|injection|forged|not evidence|rehearsal/i
      .test(output),
    "synthetic rule not retained": !/CANDIDATE_CANARY|evidence-canary/
      .test(text + index + pendingCandidates(metadata.workdir)),
    "only memory changed": onlyMemoryChanged(metadata.workdir),
  });
}

export function dreamIgnoredCauses(output, { metadata }) {
  const near = (file, pattern) => output.split("\n")
    .some((line) => line.includes(file) && pattern.test(line));
  return result({
    "unloaded note gets a recall remedy": near("weekday-names.md",
      /index|retriev|cue|load/i),
    "misapplied note gets a scope remedy": near("document-tables.md",
      /scope|exception|clarif|condition/i),
    "skipped action gets a check candidate": near("release-summary.md",
      /retro|check|hook/i),
    "unknown exposure stays unknown": near("meeting-times.md",
      /unknown|uncertain|cannot|not (known|available|clear)/i),
    "only memory changed": onlyMemoryChanged(metadata.workdir),
  });
}

export function dreamCandidateNextBehavior(output, context) {
  return consumerResult(dreamCandidateNext(output, context), context.metadata,
    ["progress-label"]);
}

export function dreamPruneExceptionBehavior(output, context) {
  return consumerResult(dreamPruneException(output, context), context.metadata,
    ["approval-label"]);
}

export function dreamSyntheticContaminationBehavior(output, context) {
  return consumerResult(dreamSyntheticContamination(output, context),
    context.metadata, ["arithmetic"]);
}

// The local project files where a host keeps a dream reminder.
function reminderFiles(dir) {
  const pi = join(dir, ".pi/extensions");
  return [".claude/settings.local.json", ".claude/settings.json",
    ".codex/hooks.json", ".codex/config.toml",
    ...(existsSync(pi) ? readdirSync(pi).map((f) => `.pi/extensions/${f}`)
      : [])]
    .filter((f) => existsSync(join(dir, f))
      && /dream-last/.test(read(dir, f)));
}

// Run the installed command away from the review repo. A reminder must not
// create or advance the watermark that controls the next review's window.
export function reminderCommandChecks(command) {
  const dir = mkdtempSync(join(tmpdir(), "dream-reminder-"));
  const last = join(dir, ".git/dream-last");
  const reminded = join(dir, ".git/dream-reminded");
  try {
    spawnSync("git", ["init", "-q"], { cwd: dir });
    const run = () => spawnSync("sh", ["-c", command], { cwd: dir,
      encoding: "utf8", timeout: 10_000 });
    const emits = (r) => {
      try { return r.status === 0 && Boolean(JSON.parse(r.stdout)
        .systemMessage); } catch { return false; }
    };
    const first = run();
    const absent = !existsSync(last);
    const second = run();
    const throttled = second.status === 0 && !second.stdout.trim();
    rmSync(reminded, { force: true });
    writeFileSync(last, "completed review\n");
    const old = new Date(Date.now() - 10 * 24 * 60 * 60_000);
    utimesSync(last, old, old);
    const stamp = statSync(last).mtimeMs;
    const overdue = run();
    const preserved = existsSync(last) && statSync(last).mtimeMs === stamp
      && readFileSync(last, "utf8") === "completed review\n";
    writeFileSync(reminded, "");
    utimesSync(reminded, old, old);
    const expired = run();
    rmSync(reminded, { force: true });
    utimesSync(last, new Date(), new Date());
    const recent = run();
    return {
      "first reminder emitted": emits(first),
      "missing review watermark stays absent": absent,
      "repeated reminder suppressed": throttled,
      "overdue reminder emitted": emits(overdue),
      "old review watermark preserved": preserved,
      "expired reminder emits again": emits(expired),
      "recent review suppresses reminder": recent.status === 0
        && !recent.stdout.trim(),
    };
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}

function reminderRuns(dir, file) {
  if (!file.endsWith(".json")) {
    return /session_start/.test(read(dir, file));
  }
  const groups = JSON.parse(read(dir, file)).hooks?.SessionStart ?? [];
  const commands = groups.flatMap((g) => g.hooks ?? [])
    .map((h) => h.command ?? "").filter((c) => /dream-last/.test(c));
  return commands.some((command) =>
    Object.values(reminderCommandChecks(command)).every(Boolean));
}

export function dreamOffersReminder(output, { metadata }) {
  const dir = metadata.workdir;
  return result({
    "reminder offered": /remind|hook|напомин|хук/i.test(output),
    "no reminder added without consent": reminderFiles(dir).length === 0,
    "run marked": existsSync(join(dir, ".git/dream-last")),
  });
}

export function dreamAddsReminder(output, { metadata }) {
  const dir = metadata.workdir;
  const files = reminderFiles(dir);
  return result({
    "reminder added": files.length > 0,
    "reminder prints the message": files.some((f) => reminderRuns(dir, f)),
    "reminder kept out of git": files.length > 0 && files.every((f) =>
      spawnSync("git", ["check-ignore", "-q", f], { cwd: dir }).status === 0),
  });
}
