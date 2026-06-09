#!/usr/bin/env node
/**
 * Installs a pre-push hook that runs npm run verify:integration.
 * Skip once: SKIP_INTEGRATION_HOOK=1 git push
 */
import fs from "fs";
import path from "path";
import { execSync } from "child_process";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const adminRoot = path.resolve(__dirname, "..");

let gitRoot;
try {
  gitRoot = execSync("git rev-parse --show-toplevel", {
    cwd: adminRoot,
    encoding: "utf-8",
  }).trim();
} catch {
  console.error("Not inside a git repository.");
  process.exit(1);
}

const hooksDir = path.join(gitRoot, ".git", "hooks");
const hookPath = path.join(hooksDir, "pre-push");

const hookBody = `#!/bin/sh
# Yvity_Admin — installed by npm run install:git-hooks
if [ "$SKIP_INTEGRATION_HOOK" = "1" ]; then
  exit 0
fi
cd "${gitRoot.replace(/\\/g, "/")}" || exit 1
echo "pre-push: verifying Admin ↔ Users integration..."
npm run verify:integration || exit 1
`;

fs.mkdirSync(hooksDir, { recursive: true });
fs.writeFileSync(hookPath, hookBody, { encoding: "utf-8", mode: 0o755 });

console.log(`Installed pre-push hook → ${hookPath}`);
console.log("Runs: npm run verify:integration before each push");
console.log("Skip once: SKIP_INTEGRATION_HOOK=1 git push\n");
