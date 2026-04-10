"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const path = require("node:path");
const { execFileSync } = require("node:child_process");

const repoRoot = path.join(__dirname, "..");
const skillRoot = path.join(repoRoot, "skills", "sbti");

function findPython() {
  for (const command of ["python3", "python"]) {
    try {
      execFileSync("which", [command], {
        encoding: "utf8",
        stdio: ["ignore", "pipe", "ignore"]
      });
      return command;
    } catch {}
  }
  return null;
}

const pythonCommand = findPython();

test("bundled skill script resolves CTRL in preset mode", { skip: !pythonCommand }, () => {
  const raw = execFileSync(
    pythonCommand,
    [
      path.join(skillRoot, "scripts", "run_sbti.py"),
      "--preset",
      "CTRL",
      "--lang",
      "en",
      "--json"
    ],
    {
      cwd: skillRoot,
      encoding: "utf8"
    }
  );
  const payload = JSON.parse(raw);

  assert.equal(payload.personality, "CTRL");
  assert.equal(payload.score, 100);
  assert.equal(payload.reason, "prototype");
});

test("bundled skill script resolves DRUNK special override", { skip: !pythonCommand }, () => {
  const raw = execFileSync(
    pythonCommand,
    [
      path.join(skillRoot, "scripts", "run_sbti.py"),
      "--preset",
      "DRUNK",
      "--lang",
      "en",
      "--json"
    ],
    {
      cwd: skillRoot,
      encoding: "utf8"
    }
  );
  const payload = JSON.parse(raw);

  assert.equal(payload.personality, "DRUNK");
  assert.equal(payload.score, 100);
  assert.equal(payload.reason, "special:drunk");
});
