# @fechin/sbti

`@fechin/sbti` is a free SBTI personality test package, terminal-friendly `sbti test` CLI, and installable skill for people who want a fast, playful `SBTI personality` result without leaving their local workflow. It is built for the same entertainment-first use case behind searches such as `sbti 人格`, `sbti 人格测试`, `sbti test`, `sbti personality`, and `sbti 中文测试`.

Online version: [https://sbti.now/](https://sbti.now/)

## What This Package Covers

If you are looking for `what is sbti`, `sbti meaning`, or `Silly Big Personality Test` tooling, this package gives you a local version of the experience:

- a fast `SBTI personality test` CLI
- a reusable question bank for `人格测试` and `人格类型测试` flows
- built-in scoring for `sbti 结果`, `sbti 性格`, and `sbti 类型`
- an installable skill for running the same experience inside agent workflows

It is designed for lightweight, shareable, internet-style personality testing rather than clinical assessment. If users are comparing `sbti vs mbti` or `sbti mbti`, the simplest framing is: MBTI is the familiar reference point, while SBTI is the more playful, meme-native, entertainment-first personality test format.

## Highlights

- Supports multilingual `SBTI test` flows in Simplified Chinese, Traditional Chinese, and English.
- Ships with a complete `SBTI personality test` question bank and local scoring engine.
- Returns structured `sbti 结果` data, including personality code, score, vector, and top matches.
- Covers popular `sbti 类型` lookups such as `sbti ctrl`, `sbti malo`, `sbti 伪人`, `sbti 妈妈`, `sbti 多情者`, `sbti gogo`, and `imsb`.
- Works both as an npm package and as a skill repository for the live site and local agents.

## Install

After publishing to npm:

```bash
npm install @fechin/sbti
```

During local development:

```bash
npm install /absolute/path/to/sbti-test
```

## Run The SBTI Test

Interactive mode:

```bash
npx sbti
```

Deterministic smoke test:

```bash
npx sbti --preset CTRL --json
```

English output:

```bash
npx sbti --lang en
```

If your audience is specifically searching for `sbti 人格测试 免费` or `sbti 测试 网站`, the live version at [sbti.now](https://sbti.now/) is the easiest entry point, while the npm package is the best fit for developers, local tools, and agent workflows.

## CLI Flags

- `--lang <zh-Hans|zh-Hant|en>`
- `--answers <30 digits or comma list>`
- `--special <2 digits or comma list>`
- `--preset <type code>`
- `--demo` same as `--preset CTRL`
- `--json`
- `--list-types`
- `--help`

These flags are useful when you want to script a `sbti test result meaning` flow, run a repeatable `sbti personality type` check, or generate a fixed result for demos and QA.

## Library Usage

```js
const { runTest } = require("@fechin/sbti");

async function main() {
  const result = await runTest({
    language: "en",
    answers: "331333313313313133313313313133",
    specialAnswers: "11"
  });

  console.log(result.personality, result.score);
}

main();
```

Typical integration use cases include:

- embedding a `sbti personality test` inside a product or bot
- generating `sbti 结果` JSON for downstream rendering
- building `sbti 类型` pages or `Silly Big Personality Test results` views
- testing how `sbti vs mbti difference` content maps to real user output

## Types And Results

The scoring engine returns structured results for the most searched and most shareable personalities, including examples such as:

- `sbti ctrl`
- `sbti malo`
- `sbti 伪人`
- `sbti 妈妈`
- `sbti 多情者`
- `sbti gogo`
- `imsb`
- `sbti drunk`

That makes the package useful not only for the raw `SBTI personality test`, but also for supporting `sbti 类型大全`, result explanation pages, type lookup pages, and share-card workflows.

## Skill Installation

Tested local-development command with the public `skill` CLI (`1.0.2`):

```bash
SKILL_BASE_URL=https://github.com/Fechin/sbti/tree/main npx skill skills/sbti
```

Repository target requested for future installers:

```bash
npx skill add https://github.com/Fechin/sbti
```

On April 10, 2026, the public npm package `skill@1.0.2` does not support `add <url>`. This repository includes `skills/sbti/` so it works with the currently supported `SKILL_BASE_URL=... npx skill skills/sbti` flow.
