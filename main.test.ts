import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test, type TestContext } from "node:test";
import { fileURLToPath } from "node:url";

const main: string = fileURLToPath(new URL("./main.ts", import.meta.url));

function run(t: TestContext): { dir: string; text: string } {
  const dir = mkdtempSync(join(tmpdir(), "roast-"));
  t.after(() => rmSync(dir, { recursive: true, force: true }));
  execFileSync(process.execPath, [main, dir]);
  return { dir, text: readFileSync(join(dir, "entry.txt"), "utf8") };
}

test("writes the same entry on every run", (t) => {
  const first = run(t);
  const second = run(t);
  assert.equal(second.text, first.text);
});

test("entry is one strict line with no newline", (t) => {
  const { text } = run(t);
  assert.ok(text.length > 0);
  assert.equal(text.includes("\n"), false);
  assert.equal(text.includes("\r"), false);
  assert.ok(text.trim().length > 0);
});

test("entry is at most 200 Unicode characters", (t) => {
  const { text } = run(t);
  assert.ok([...text].length <= 200);
});

test("writes entry.txt inside the given directory", (t) => {
  const { dir, text } = run(t);
  const stat = readFileSync(join(dir, "entry.txt"), "utf8");
  assert.equal(stat, text);
});
