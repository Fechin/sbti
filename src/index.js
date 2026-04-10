"use strict";

const questionBank = require("../data/question-bank.json");

const DEFAULT_LANGUAGE = "zh-Hans";
const SUPPORTED_LANGUAGES = questionBank.languages.slice();
const DEFAULT_QUESTION_BANK = questionBank;
const FALLBACK_THRESHOLD = 60;

function getLocalized(value, language = DEFAULT_LANGUAGE) {
  if (value == null) {
    return "";
  }

  if (typeof value === "string") {
    return value;
  }

  return (
    value[language] ??
    value[DEFAULT_LANGUAGE] ??
    value.en ??
    Object.values(value)[0] ??
    ""
  );
}

function normalizeLanguage(language) {
  return SUPPORTED_LANGUAGES.includes(language) ? language : DEFAULT_LANGUAGE;
}

function assertAnswerValue(value, fieldName) {
  if (![1, 2, 3].includes(value)) {
    throw new Error(`${fieldName} must contain only 1, 2, or 3.`);
  }
}

function parseAnswerList(input, expectedLength, fieldName = "answers") {
  if (Array.isArray(input)) {
    if (input.length !== expectedLength) {
      throw new Error(`${fieldName} must contain ${expectedLength} answers.`);
    }

    const normalized = input.map((value) => Number(value));
    normalized.forEach((value) => assertAnswerValue(value, fieldName));
    return normalized;
  }

  if (typeof input !== "string" || input.trim() === "") {
    throw new Error(`${fieldName} must be a non-empty string or array.`);
  }

  const compact = input.includes(",")
    ? input
        .split(",")
        .map((part) => part.trim())
        .filter(Boolean)
    : input
        .replace(/\s+/g, "")
        .split("");

  if (compact.length !== expectedLength) {
    throw new Error(`${fieldName} must contain ${expectedLength} answers.`);
  }

  const normalized = compact.map((value) => Number(value));
  normalized.forEach((value) => assertAnswerValue(value, fieldName));
  return normalized;
}

function flattenPattern(pattern) {
  return pattern.replace(/-/g, "");
}

function splitEvery(text, size) {
  const chunks = [];
  for (let index = 0; index < text.length; index += size) {
    chunks.push(text.slice(index, index + size));
  }
  return chunks;
}

function vectorFromDimensions(dimensions) {
  const raw = questionBank.dimensionOrder.map((key) => dimensions[key]).join("");
  return splitEvery(raw, 3).join("-");
}

function scoreToLevel(score) {
  if (score <= 3) {
    return "L";
  }
  if (score === 4) {
    return "M";
  }
  return "H";
}

function levelToNumber(level) {
  return { L: 1, M: 2, H: 3 }[level];
}

function answersFromPattern(pattern) {
  const flattened = flattenPattern(pattern);
  if (flattened.length !== questionBank.dimensionOrder.length) {
    throw new Error("Pattern must describe 15 dimensions.");
  }

  const answerPairs = [];
  for (const level of flattened) {
    if (level === "L") {
      answerPairs.push(1, 1);
    } else if (level === "M") {
      answerPairs.push(1, 3);
    } else if (level === "H") {
      answerPairs.push(3, 3);
    } else {
      throw new Error(`Unsupported pattern level: ${level}`);
    }
  }
  return answerPairs;
}

function buildLocalizedType(type, language, similarity) {
  return {
    code: type.code,
    name: getLocalized(type.name, language),
    description: getLocalized(type.description, language),
    traits: type.traits.slice(),
    shareableText: getLocalized(type.shareableText, language),
    similarity,
    pattern: type.pattern
  };
}

function buildDimensionExplanations(dimensions, language) {
  return questionBank.dimensionOrder.map((dimension) => {
    const meta = questionBank.dimensionMeta[dimension];
    const level = dimensions[dimension];

    return {
      code: dimension,
      model: getLocalized(meta.modelName, language),
      title: getLocalized(meta.title, language),
      level,
      explanation: getLocalized(meta.levels[level], language)
    };
  });
}

function formatResult(result) {
  const lines = [
    `${result.personality} · ${result.personalityName}`,
    `score: ${result.score}%`,
    `vector: ${result.vector}`,
    `share: ${result.matchedType.shareableText}`,
    "top matches:"
  ];

  for (const match of result.topMatches) {
    lines.push(`- ${match.code} · ${match.name} (${match.similarity}%)`);
  }

  lines.push("dimensions:");
  for (const dimension of result.dimensionExplanations ?? []) {
    lines.push(
      `- ${dimension.code} ${dimension.level} · ${dimension.title}: ${dimension.explanation}`
    );
  }

  return lines.join("\n");
}

class SBTITest {
  constructor(options = {}) {
    this.language = normalizeLanguage(options.language);
    this.dimensionOrder = questionBank.dimensionOrder.slice();
    this.questions = questionBank.questions.slice();
    this.specialQuestions = questionBank.specialQuestions.slice();
    this.types = questionBank.types.slice();
    this.typeIndex = new Map(this.types.map((type) => [type.code, type]));
    this.result = null;
    this.reset();
  }

  reset() {
    this.answers = new Map();
    this.specialAnswers = new Map();
    this.result = null;
  }

  getQuestions() {
    return this.questions.slice();
  }

  getSpecialQuestions() {
    return this.specialQuestions.slice();
  }

  submitAnswer(questionId, value) {
    assertAnswerValue(value, "answers");
    const question = this.questions.find((item) => item.id === questionId);
    if (!question) {
      throw new Error(`Unknown question id: ${questionId}`);
    }
    this.answers.set(questionId, value);
    this.result = null;
  }

  submitSpecialAnswer(questionId, value) {
    assertAnswerValue(value, "specialAnswers");
    const question = this.specialQuestions.find((item) => item.id === questionId);
    if (!question) {
      throw new Error(`Unknown special question id: ${questionId}`);
    }
    this.specialAnswers.set(questionId, value);
    this.result = null;
  }

  answerAll(answers, specialAnswers = [1, 1]) {
    const parsedAnswers = parseAnswerList(
      answers,
      this.questions.length,
      "answers"
    );
    const parsedSpecial = parseAnswerList(
      specialAnswers,
      this.specialQuestions.length,
      "specialAnswers"
    );

    this.reset();

    this.questions.forEach((question, index) => {
      this.answers.set(question.id, parsedAnswers[index]);
    });

    this.specialQuestions.forEach((question, index) => {
      this.specialAnswers.set(question.id, parsedSpecial[index]);
    });

    return this.calculateResult();
  }

  calculateDimensions() {
    if (this.answers.size !== this.questions.length) {
      throw new Error(
        `Expected ${this.questions.length} standard answers before scoring.`
      );
    }

    const totals = {};
    for (const question of this.questions) {
      totals[question.dimension] = (totals[question.dimension] ?? 0) + this.answers.get(question.id);
    }

    const dimensions = {};
    for (const dimension of this.dimensionOrder) {
      dimensions[dimension] = scoreToLevel(totals[dimension]);
    }

    return dimensions;
  }

  getStandardMatches(dimensions) {
    const flattenedVector = flattenPattern(vectorFromDimensions(dimensions));
    const standardTypes = this.types.filter(
      (type) => type.code !== "DRUNK" && type.code !== "HHHH"
    );

    return standardTypes
      .map((type) => {
        const target = flattenPattern(type.pattern);
        let distance = 0;
        for (let index = 0; index < flattenedVector.length; index += 1) {
          distance += Math.abs(
            levelToNumber(flattenedVector[index]) - levelToNumber(target[index])
          );
        }
        const similarity = Math.max(
          0,
          Math.round((1 - distance / (this.dimensionOrder.length * 2)) * 100)
        );

        return { type, similarity, distance };
      })
      .sort((left, right) => {
        if (right.similarity !== left.similarity) {
          return right.similarity - left.similarity;
        }
        return left.distance - right.distance;
      });
  }

  calculateResult() {
    const dimensions = this.calculateDimensions();
    const vector = vectorFromDimensions(dimensions);
    const matches = this.getStandardMatches(dimensions);
    const best = matches[0];
    const drinks = this.specialAnswers.get("sq1") ?? 1;
    const liquor = this.specialAnswers.get("sq2") ?? 1;

    let matched = best.type;
    let score = best.similarity;
    let reason = "prototype";

    if (drinks >= 2 && liquor === 3) {
      matched = this.typeIndex.get("DRUNK");
      score = 100;
      reason = "special:drunk";
    } else if (best.similarity < FALLBACK_THRESHOLD) {
      matched = this.typeIndex.get("HHHH");
      reason = "fallback:hhhh";
    }

    const result = {
      language: this.language,
      personality: matched.code,
      personalityName: getLocalized(matched.name, this.language),
      score,
      vector,
      dimensions,
      matchedType: buildLocalizedType(matched, this.language, score),
      topMatches: matches
        .slice(0, 3)
        .map((match) => buildLocalizedType(match.type, this.language, match.similarity)),
      answers: this.questions.map((question) => this.answers.get(question.id)),
      specialAnswers: this.specialQuestions.map((question) =>
        this.specialAnswers.get(question.id) ?? 1
      ),
      reason,
      timestamp: new Date().toISOString()
    };

    this.result = result;
    return result;
  }

  getResultReport() {
    const result = this.result ?? this.calculateResult();
    return {
      ...result,
      dimensionExplanations: buildDimensionExplanations(
        result.dimensions,
        this.language
      )
    };
  }
}

async function runTest(options = {}) {
  const test = new SBTITest(options);
  if (options.answers == null) {
    throw new Error("runTest requires answers for non-interactive execution.");
  }

  return test.answerAll(
    options.answers,
    options.specialAnswers ?? [1, 1]
  );
}

module.exports = {
  DEFAULT_LANGUAGE,
  DEFAULT_QUESTION_BANK,
  SBTITest,
  SUPPORTED_LANGUAGES,
  answersFromPattern,
  formatResult,
  getLocalized,
  parseAnswerList,
  runTest
};
