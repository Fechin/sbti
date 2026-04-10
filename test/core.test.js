"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const {
  SBTITest,
  answersFromPattern,
  formatResult,
  parseAnswerList,
  runTest
} = require("../src/index");

test("CTRL preset resolves to CTRL", () => {
  const sbti = new SBTITest({ language: "en" });
  const result = sbti.answerAll(answersFromPattern("HHH-HMH-MHH-HHH-MHM"), [1, 1]);

  assert.equal(result.personality, "CTRL");
  assert.equal(result.personalityName, "Controller");
  assert.equal(result.vector, "HHH-HMH-MHH-HHH-MHM");
});

test("special drinking answers resolve to DRUNK", () => {
  const sbti = new SBTITest({ language: "en" });
  const result = sbti.answerAll(answersFromPattern("HHH-HMH-MHH-HHH-MHM"), [2, 3]);

  assert.equal(result.personality, "DRUNK");
  assert.equal(result.score, 100);
  assert.equal(result.reason, "special:drunk");
});

test("parseAnswerList accepts compact strings", () => {
  const parsed = parseAnswerList("123123", 6, "answers");
  assert.deepEqual(parsed, [1, 2, 3, 1, 2, 3]);
});

test("runTest returns top matches", async () => {
  const result = await runTest({
    language: "en",
    answers: answersFromPattern("MMM-MMM-HMH-MMM-MMM"),
    specialAnswers: [1, 1]
  });

  assert.equal(result.personality, "THAN-K");
  assert.equal(result.topMatches.length, 3);
});

test("fallback profile resolves to HHHH", () => {
  const sbti = new SBTITest({ language: "en" });
  const result = sbti.answerAll("111122323321213332321221123333", [1, 1]);

  assert.equal(result.personality, "HHHH");
  assert.equal(result.reason, "fallback:hhhh");
  assert.equal(result.score, 57);
});

test("parseAnswerList accepts comma separated values", () => {
  const parsed = parseAnswerList("1, 2,3,1", 4, "answers");
  assert.deepEqual(parsed, [1, 2, 3, 1]);
});

test("parseAnswerList rejects invalid answers", () => {
  assert.throws(
    () => parseAnswerList("124", 3, "answers"),
    /answers must contain only 1, 2, or 3/
  );
});

test("calculateDimensions requires all standard answers", () => {
  const sbti = new SBTITest({ language: "en" });
  sbti.submitAnswer("q1", 1);

  assert.throws(
    () => sbti.calculateDimensions(),
    /Expected 30 standard answers/
  );
});

test("formatResult tolerates raw result objects", () => {
  const sbti = new SBTITest({ language: "en" });
  const result = sbti.answerAll(answersFromPattern("HHH-HMH-MHH-HHH-MHM"), [1, 1]);

  const output = formatResult(result);
  assert.match(output, /CTRL · Controller/);
  assert.match(output, /top matches:/);
});
