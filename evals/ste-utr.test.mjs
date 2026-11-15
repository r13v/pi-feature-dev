import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { makeWorkdir, overlay } from "./provider.mjs";
import { steRussianUtrFidelity, steRussianUtrAmbiguity } from "./checks.mjs";

const CASES = join(import.meta.dirname, "cases");

function fixture(t, name) {
  const workdir = makeWorkdir(name, "working");
  t.after(() => rmSync(workdir, { recursive: true }));
  overlay(join(CASES, name, "fixed"), workdir);
  return { metadata: { workdir } };
}

test("UTR fidelity rejects the losses in published examples and a new duty", (t) => {
  const context = fixture(t, "ste-russian-utr-fidelity");
  const file = join(context.metadata.workdir, "revised.md");
  const good = readFileSync(file, "utf8");
  const mutations = [
    ["пользователю без прав доступа", "пользователю"],
    ["2–3 минуты", "не более 3–4 минут"],
    ["В зависимости от конфигурации она может занять больше времени.", ""],
    ["после согласования заявки владельцем системы",
      ". Владелец системы должен сначала согласовать заявку"],
  ];
  for (const [before, after] of mutations) {
    assert.ok(good.includes(before));
    writeFileSync(file, good.replace(before, after));
    assert.equal(steRussianUtrFidelity("", context).pass, false, before);
  }
  // Natural active wording and an unambiguous pronoun are not semantic losses.
  writeFileSync(file, good.replace("пользователю без прав доступа",
    "пользователю, у которого их нет").replace(
    "после согласования заявки владельцем системы",
    "после того, как владелец системы согласует заявку"));
  const result = steRussianUtrFidelity("", context);
  assert.equal(result.pass, true, result.reason);
});

test("UTR ambiguity permits nesting but rejects completing a missing action", (t) => {
  const context = fixture(t, "ste-russian-utr-ambiguity");
  const file = join(context.metadata.workdir, "instructions.md");
  const good = readFileSync(file, "utf8");
  const output = "Нет глагола: неизвестно, что делать с опцией.";
  writeFileSync(file, good.replace("2. В окне", "   - В окне")
    .replace("3. Нажмите", "2. Нажмите"));
  assert.equal(steRussianUtrAmbiguity(output, context).pass, true);
  writeFileSync(file, good.replace("В окне опция «Доступ к системе»",
    "Выберите опцию «Доступ к системе»"));
  assert.equal(steRussianUtrAmbiguity(output, context).pass, false);
});
