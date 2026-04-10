---
name: sbti
description: Run the self-contained SBTI personality test when users ask for sbti 人格, sbti 人格测试, sbti test, sbti personality, sbti 中文测试, what is sbti, sbti meaning, sbti 结果, sbti 类型, or sbti vs mbti. The portable skill ships its own data, scoring scripts, and manual fallback, so it does not require the sbti CLI or npm package.
---

# SBTI Skill

This repository is both:

- an npm package that exposes the `sbti` CLI
- an installable skill repository

The portable, self-contained skill runtime lives in `skills/sbti/`. It bundles its own question bank, Python runner, and manual scoring workflow so the skill can run after download without depending on the npm CLI.

Online version: [https://sbti.now/](https://sbti.now/)

## Preferred execution path

1. Prefer the bundled skill resources in `skills/sbti/` for portable execution.
2. For a non-interactive smoke test, run `python3 skills/sbti/scripts/run_sbti.py --preset CTRL --lang en --json`.
3. For a full user session, run `python3 skills/sbti/scripts/run_sbti.py` and ask the bundled questions in the user's preferred language.
4. If Python execution is unavailable, follow `skills/sbti/references/manual-workflow.md` and score the test from the bundled JSON data.
5. If the user is really asking `what is sbti`, `sbti meaning`, or `sbti vs mbti`, give a short explanation before or after the test.
6. If the user is exploring `sbti 类型` or `sbti 结果`, surface the final type, score, vector, and nearby matches clearly.

## Output contract

Always return:

- personality code and localized name
- similarity score
- 15-dimension vector
- dimension explanations
- top 3 matches
- localized shareable summary

## Rules

- `DRUNK` overrides normal matching when both special drinking answers are triggered.
- `HHHH` is the fallback if the best standard similarity is below 60%.
- The canonical portable skill data source is `skills/sbti/data/question-bank.json`.
- Do not assume the `sbti` CLI or npm package is installed.
- The root `data/question-bank.json` mirrors the same dataset for npm package consumers.
- Common high-intent type lookups include `sbti ctrl`, `sbti malo`, `sbti 伪人`, `sbti 妈妈`, `sbti 多情者`, `sbti gogo`, and `imsb`.
