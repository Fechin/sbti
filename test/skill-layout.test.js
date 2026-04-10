"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const repoRoot = path.join(__dirname, "..");
const skillRoot = path.join(repoRoot, "skills", "sbti");

test("skill manifest lists all shipped files", () => {
  const manifestPath = path.join(skillRoot, "index.json");
  const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));

  assert.deepEqual(manifest.files.sort(), ["SKILL.md", "agents/openai.yaml"]);
  for (const file of manifest.files) {
    const target = path.join(skillRoot, file);
    assert.equal(fs.existsSync(target), true, `${file} should exist`);
  }
});

test("skill metadata exposes expected trigger name", () => {
  const skillMd = fs.readFileSync(path.join(skillRoot, "SKILL.md"), "utf8");
  const openAiYaml = fs.readFileSync(
    path.join(skillRoot, "agents", "openai.yaml"),
    "utf8"
  );

  assert.match(skillMd, /name:\s*sbti/);
  assert.match(skillMd, /description:\s*Run the SBTI personality test/);
  assert.match(openAiYaml, /display_name:\s*"SBTI"/);
});
