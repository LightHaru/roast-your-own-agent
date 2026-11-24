import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const ENTRY: string =
  "My agent treats a one-line fix like a casino heist: eleven subagents in matching jumpsuits, a week spent casing the repo — and the loot is a single semicolon.";

if ([...ENTRY].length > 200) {
  throw new Error("entry exceeds the 200-character limit");
}

const dir: string = process.argv[2] ?? "/output";
mkdirSync(dir, { recursive: true });
writeFileSync(join(dir, "entry.txt"), ENTRY, "utf8");
