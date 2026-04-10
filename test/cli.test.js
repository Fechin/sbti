"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const path = require("node:path");
const { spawnSync } = require("node:child_process");
const { answersFromPattern } = require("../src/index");

const cliPath = path.join(__dirname, "..", "bin", "sbti.js");

function runCli(args, options = {}) {
  return spawnSync(process.execPath, [cliPath, ...args], {
    encoding: "utf8",
    ...options
  });
}

test("CLI prints help", () => {
  const result = runCli(["--help"]);
  assert.equal(result.status, 0);
  assert.match(result.stdout, /Usage: sbti/);
});

test("CLI supports english preset output", () => {
  const result = runCli(["--preset", "CTRL", "--lang", "en", "--json"]);
  assert.equal(result.status, 0);

  const payload = JSON.parse(result.stdout);
  assert.equal(payload.personality, "CTRL");
  assert.equal(payload.personalityName, "Controller");
});

test("CLI supports DRUNK preset override", () => {
  const result = runCli(["--preset", "DRUNK", "--lang", "en", "--json"]);
  assert.equal(result.status, 0);

  const payload = JSON.parse(result.stdout);
  assert.equal(payload.personality, "DRUNK");
  assert.equal(payload.reason, "special:drunk");
});

test("CLI supports HHHH preset override", () => {
  const result = runCli(["--preset", "HHHH", "--lang", "en", "--json"]);
  assert.equal(result.status, 0);

  const payload = JSON.parse(result.stdout);
  assert.equal(payload.personality, "HHHH");
  assert.equal(payload.reason, "fallback:hhhh");
});

test("CLI accepts explicit answers and special answers", () => {
  const answers = answersFromPattern("MMM-MMM-HMH-MMM-MMM").join("");
  const result = runCli([
    "--answers",
    answers,
    "--special",
    "23",
    "--lang",
    "en",
    "--json"
  ]);
  assert.equal(result.status, 0);

  const payload = JSON.parse(result.stdout);
  assert.equal(payload.personality, "DRUNK");
});

test("CLI reports invalid language", () => {
  const result = runCli(["--preset", "CTRL", "--lang", "jp"], {
    env: process.env
  });
  assert.equal(result.status, 1);
  assert.match(result.stderr, /Unsupported language "jp"/);
});

test("CLI reports missing option value", () => {
  const result = runCli(["--answers"], {
    env: process.env
  });
  assert.equal(result.status, 1);
  assert.match(result.stderr, /Missing value for --answers/);
});

test("CLI supports demo alias", () => {
  const result = runCli(["--demo", "--lang", "en", "--json"]);
  assert.equal(result.status, 0);

  const payload = JSON.parse(result.stdout);
  assert.equal(payload.personality, "CTRL");
  assert.equal(payload.personalityName, "Controller");
});
