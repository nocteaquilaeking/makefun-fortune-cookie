import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// The fortune, written for make.fun's "Fortune Cookie Wisdom for
// Developers" bounty: one line, at most 120 characters. It speaks in
// the fortune cookie's own voice — a calm prophecy, today weighed
// against tomorrow — about the truest thing in a developer's day:
// the quick fix is never temporary. Rushed in under deadline, it
// settles, other code leans on it, and within a season it is
// structural: the load-bearing wall nobody dares to touch, carrying
// the building and the blame alike.
const FORTUNE =
  "The quick fix you rush in today becomes the load-bearing wall of tomorrow.";

// The gate only accepts UTF-8 text of 1 to 120 characters on a single
// line, so refuse to hand in anything else rather than ship a bad entry.
if (FORTUNE.length < 1 || FORTUNE.length > 120 || FORTUNE.includes("\n")) {
  throw new Error(
    `fortune must be one line of 1-120 characters, got ${FORTUNE.length}`,
  );
}

const outputDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
mkdirSync(outputDir, { recursive: true });
const entryPath = join(outputDir, "entry.txt");
writeFileSync(entryPath, FORTUNE, "utf8");

// Verify what actually landed on disk, not just what we meant to write:
// a truncated write, an encoding surprise, or a stray newline would hand
// the gate a bad entry while this program reported success. Read the file
// back and refuse (nonzero exit) unless it is exactly the fortune: one
// line of 1-120 characters, byte for byte what was intended.
const written = readFileSync(entryPath, "utf8");
if (
  written.length < 1 ||
  written.length > 120 ||
  written.includes("\n") ||
  written !== FORTUNE
) {
  console.error(
    `entry.txt failed verification: expected one line of 1-120 characters, read back ${written.length} characters`,
  );
  process.exit(1);
}
