# @fechin/sbti

`@fechin/sbti` is a runnable SBTI personality test package and skill repository.

## Install

After publishing to npm:

```bash
npm install @fechin/sbti
```

During local development:

```bash
npm install /absolute/path/to/sbti-test
```

## Run

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

## CLI flags

- `--lang <zh-Hans|zh-Hant|en>`
- `--answers <30 digits or comma list>`
- `--special <2 digits or comma list>`
- `--preset <type code>`
- `--demo` same as `--preset CTRL`
- `--json`
- `--list-types`
- `--help`

## Library usage

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

## Skill installation

Tested local-development command with the public `skill` CLI (`1.0.2`):

```bash
SKILL_BASE_URL=https://github.com/Fechin/sbti/tree/main npx skill skills/sbti
```

Repository target requested for future installers:

```bash
npx skill add https://github.com/Fechin/sbti
```

On April 10, 2026, the public npm package `skill@1.0.2` does not support `add <url>`. This repository includes `skills/sbti/` so it works with the currently supported `SKILL_BASE_URL=... npx skill skills/sbti` flow.
