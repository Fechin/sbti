---
name: sbti
description: Run the SBTI personality test when users ask for sbti 人格, sbti 人格测试, sbti test, sbti personality, sbti 中文测试, what is sbti, sbti meaning, sbti 结果, sbti 类型, or sbti vs mbti. Use the local sbti CLI when available; otherwise follow the bundled question bank and compute the result from the 15-dimension matching rules.
---

# SBTI Skill

This repository is both:

- an npm package that exposes the `sbti` CLI
- an installable skill repository

Online version: [https://sbti.now/](https://sbti.now/)

## Preferred execution path

1. Use `sbti` if the CLI is installed.
2. For a non-interactive smoke test, run `sbti --preset CTRL --json`.
3. For a full user session, run `sbti` and ask the questions in the user's preferred language.
4. If the user is really asking `what is sbti`, `sbti meaning`, or `sbti vs mbti`, give a short explanation before or after the test.
5. If the user is exploring `sbti 类型` or `sbti 结果`, surface the final type, score, vector, and nearby matches clearly.

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
- The canonical data source is `data/question-bank.json`.
- Common high-intent type lookups include `sbti ctrl`, `sbti malo`, `sbti 伪人`, `sbti 妈妈`, `sbti 多情者`, `sbti gogo`, and `imsb`.
