import { execFileSync } from "node:child_process";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = resolve(dirname(fileURLToPath(import.meta.url)), "..");

function canRun(command, args) {
  try {
    execFileSync(command, args, {
      cwd: rootDir,
      stdio: "ignore"
    });
    return true;
  } catch {
    return false;
  }
}

if (!canRun("git", ["rev-parse", "--is-inside-work-tree"])) {
  console.log("Skipping changeset status because this directory is not a git repository yet.");
  process.exit(0);
}

if (!canRun("git", ["rev-parse", "--verify", "main"])) {
  console.log('Skipping changeset status because the "main" branch does not exist yet.');
  process.exit(0);
}

execFileSync("pnpm", ["exec", "changeset", "status", "--verbose"], {
  cwd: rootDir,
  stdio: "inherit"
});
