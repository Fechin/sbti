"use strict";

const fs = require("node:fs");
const path = require("node:path");
const readline = require("node:readline/promises");
const { stdin, stdout } = require("node:process");
const {
  DEFAULT_QUESTION_BANK,
  SBTITest,
  SUPPORTED_LANGUAGES,
  answersFromPattern,
  formatResult,
  getLocalized,
  parseAnswerList
} = require("./index");

function readVersion() {
  const packagePath = path.join(__dirname, "..", "package.json");
  return JSON.parse(fs.readFileSync(packagePath, "utf8")).version;
}

function usage() {
  return [
    "Usage: sbti [options]",
    "",
    "Options:",
    "  --lang <code>        Language: zh-Hans, zh-Hant, en",
    "  --answers <list>     30 answers as digits or comma-separated values",
    "  --special <list>     2 special answers as digits or comma-separated values",
    "  --preset <code>      Generate answers from a type pattern, e.g. CTRL",
    "  --demo               Alias for --preset CTRL",
    "  --json               Print JSON result",
    "  --list-types         Show type codes",
    "  --version            Show version",
    "  --help               Show help"
  ].join("\n");
}

function parseArguments(rawArgs) {
  const args = {
    json: false,
    demo: false,
    help: false,
    listTypes: false,
    version: false
  };

  for (let index = 0; index < rawArgs.length; index += 1) {
    const token = rawArgs[index];

    if (token === "--json") {
      args.json = true;
    } else if (token === "--demo") {
      args.demo = true;
    } else if (token === "--help" || token === "-h") {
      args.help = true;
    } else if (token === "--list-types") {
      args.listTypes = true;
    } else if (token === "--version" || token === "-v") {
      args.version = true;
    } else if (token === "--lang" || token === "--language") {
      args.lang = rawArgs[index + 1];
      index += 1;
    } else if (token === "--answers") {
      args.answers = rawArgs[index + 1];
      index += 1;
    } else if (token === "--special") {
      args.special = rawArgs[index + 1];
      index += 1;
    } else if (token === "--preset") {
      args.preset = rawArgs[index + 1];
      index += 1;
    } else {
      throw new Error(`Unknown argument: ${token}`);
    }
  }

  return args;
}

function requireOptionValue(rawArgs, index, token) {
  const value = rawArgs[index + 1];
  if (value == null || value.startsWith("--")) {
    throw new Error(`Missing value for ${token}`);
  }
  return value;
}

function resolvePreset(presetName) {
  const code = String(presetName || "").trim().toUpperCase();
  const type = DEFAULT_QUESTION_BANK.types.find(
    (item) => item.code.toUpperCase() === code
  );

  if (!type) {
    throw new Error(`Unknown preset type: ${presetName}`);
  }

  if (type.code === "DRUNK") {
    return {
      answers: answersFromPattern("MMM-MMM-HMH-MMM-MMM"),
      specialAnswers: [2, 3]
    };
  }

  if (type.code === "HHHH") {
    return {
      answers: "111122323321213332321221123333",
      specialAnswers: [1, 1]
    };
  }

  return {
    answers: answersFromPattern(type.pattern),
    specialAnswers: [1, 1]
  };
}

function validateLanguage(language) {
  if (!language) {
    return undefined;
  }

  if (!SUPPORTED_LANGUAGES.includes(language)) {
    throw new Error(
      `Unsupported language "${language}". Use one of: ${SUPPORTED_LANGUAGES.join(", ")}`
    );
  }

  return language;
}

async function askLanguage(rl) {
  const prompt = [
    "Choose language / 选择语言 / 選擇語言",
    "1. 简体中文 (zh-Hans)",
    "2. 繁體中文 (zh-Hant)",
    "3. English (en)",
    "> "
  ].join("\n");

  while (true) {
    const answer = (await rl.question(prompt)).trim();
    if (answer === "1") {
      return "zh-Hans";
    }
    if (answer === "2") {
      return "zh-Hant";
    }
    if (answer === "3") {
      return "en";
    }
    console.log("Please enter 1, 2, or 3.");
  }
}

async function askQuestion(rl, question, language, index, total) {
  const lines = [
    `[${index}/${total}] ${getLocalized(question.text, language)}`
  ];

  question.options.forEach((option) => {
    lines.push(`  ${option.value}. ${getLocalized(option.text, language)}`);
  });
  lines.push("> ");

  while (true) {
    const answer = (await rl.question(lines.join("\n"))).trim();
    if (["1", "2", "3"].includes(answer)) {
      return Number(answer);
    }
    console.log("Please enter 1, 2, or 3.");
  }
}

async function runInteractiveSession(language) {
  const rl = readline.createInterface({ input: stdin, output: stdout });

  try {
    const selectedLanguage = language || (await askLanguage(rl));
    const test = new SBTITest({ language: selectedLanguage });

    const questions = test.getQuestions();
    for (let index = 0; index < questions.length; index += 1) {
      const value = await askQuestion(
        rl,
        questions[index],
        selectedLanguage,
        index + 1,
        questions.length
      );
      test.submitAnswer(questions[index].id, value);
      console.log("");
    }

    const specialQuestions = test.getSpecialQuestions();
    for (const question of specialQuestions) {
      const value = await askQuestion(
        rl,
        question,
        selectedLanguage,
        questions.length + specialQuestions.indexOf(question) + 1,
        questions.length + specialQuestions.length
      );
      test.submitSpecialAnswer(question.id, value);
      console.log("");
    }

    return test.getResultReport();
  } finally {
    rl.close();
  }
}

async function runCli(rawArgs = process.argv.slice(2)) {
  const normalizedArgs = [];
  for (let index = 0; index < rawArgs.length; index += 1) {
    const token = rawArgs[index];
    normalizedArgs.push(token);

    if (token === "--lang" || token === "--language") {
      normalizedArgs.push(requireOptionValue(rawArgs, index, token));
      index += 1;
    } else if (token === "--answers") {
      normalizedArgs.push(requireOptionValue(rawArgs, index, token));
      index += 1;
    } else if (token === "--special") {
      normalizedArgs.push(requireOptionValue(rawArgs, index, token));
      index += 1;
    } else if (token === "--preset") {
      normalizedArgs.push(requireOptionValue(rawArgs, index, token));
      index += 1;
    }
  }

  const args = parseArguments(normalizedArgs);

  if (args.help) {
    console.log(usage());
    return null;
  }

  if (args.version) {
    console.log(readVersion());
    return null;
  }

  if (args.listTypes) {
    DEFAULT_QUESTION_BANK.types.forEach((type) => {
      console.log(`${type.code}\t${getLocalized(type.name, "en")}`);
    });
    return null;
  }

  const language = validateLanguage(args.lang);
  const test = new SBTITest({ language });

  let result;
  if (args.demo || args.preset || args.answers) {
    const preset = args.demo ? resolvePreset("CTRL") : args.preset ? resolvePreset(args.preset) : null;
    const answers = args.answers
      ? parseAnswerList(args.answers, test.getQuestions().length, "answers")
      : preset.answers;
    const specialAnswers = args.special
      ? parseAnswerList(
          args.special,
          test.getSpecialQuestions().length,
          "specialAnswers"
        )
      : preset
        ? preset.specialAnswers
        : [1, 1];
    result = test.answerAll(answers, specialAnswers);
    result = test.getResultReport();
  } else {
    result = await runInteractiveSession(language);
  }

  if (args.json) {
    console.log(JSON.stringify(result, null, 2));
  } else {
    console.log(formatResult(result));
  }

  return result;
}

module.exports = { runCli };
