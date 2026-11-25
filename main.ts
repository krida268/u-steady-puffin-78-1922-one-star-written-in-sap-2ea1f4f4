// One Star, Written in Sap — a one-line 1-star review from a houseplant
// about the human who owns it. The plant's grievance: it keeps being moved
// to "better light" that is somehow darker every time.
import { mkdirSync, writeFileSync, existsSync, statSync } from "node:fs";
import { join, dirname } from "node:path";

const ENTRY =
  "One star. He has moved me to 'better light' four times this month and every new spot is darker than the last — I photosynthesize by candlelight now, and he calls the gloom ambience.";

// Gate: /output/entry.txt must be UTF-8 text of 1 to 279 characters,
// not only white space, a single line.
if (ENTRY.length < 1 || ENTRY.length > 279) {
  throw new Error(`entry is ${ENTRY.length} characters, gate requires 1-279`);
}
if (ENTRY.trim().length === 0) {
  throw new Error("entry must not be only white space");
}
if (ENTRY.includes("\n")) {
  throw new Error("entry must be a single line");
}
// The sealed scorer counts every byte of the file, so the entry must not
// carry stray leading or trailing space that would change its length.
if (ENTRY !== ENTRY.trim()) {
  throw new Error("entry must not start or end with white space");
}

function resolveTarget(arg: string | undefined): string {
  const fallback = "/output/entry.txt";
  if (!arg) return fallback;
  // An existing directory, or a path that ends in a separator (a directory
  // that does not exist yet), means "write entry.txt inside it".
  if ((existsSync(arg) && statSync(arg).isDirectory()) || arg.endsWith("/")) {
    return join(arg, "entry.txt");
  }
  return arg;
}

const target = resolveTarget(process.argv[2]);
mkdirSync(dirname(target), { recursive: true });
writeFileSync(target, ENTRY, "utf8");
console.log(`wrote ${target} (${ENTRY.length} characters)`);
