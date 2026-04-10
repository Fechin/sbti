---
name: sbti
description: Run the SBTI personality test when users ask for sbti 人格, sbti 人格测试, sbti test, sbti personality, sbti 中文测试, sbti 是什么, what is sbti, sbti meaning, sbti 类型, sbti 结果, or sbti vs mbti. Prefer the local sbti CLI if it exists; otherwise guide the user through the same question flow and compute the result with the bundled question bank.
---

# SBTI Skill

Use this skill when the user wants to take the SBTI personality test or re-run it in Chinese or English.

Online version: [https://sbti.now/](https://sbti.now/)

## Workflow

1. Prefer the local `sbti` CLI if available.
2. For quick validation, run `sbti --preset CTRL --json`.
3. For a real session, run `sbti` interactively or `sbti --lang en`.
4. Present:
   - personality code and localized name
   - similarity score
   - 15-dimension vector
   - top 3 matches
   - shareable line
5. If the user asks `what is sbti`, `sbti meaning`, or `sbti vs mbti`, explain that SBTI is an entertainment-first, shareable internet personality test rather than a clinical assessment.
6. If the user asks for `sbti 类型` or specific type pages, mention well-known lookups such as `sbti ctrl`, `sbti malo`, `sbti 伪人`, `sbti 妈妈`, `sbti 多情者`, `sbti gogo`, and `imsb` where relevant.

## Notes

- The test uses 30 standard questions across 15 dimensions.
- Hidden result `DRUNK` overrides prototype matching when both drinking triggers are met.
- Fallback result `HHHH` is used when the best standard match is below 60%.
- Source data lives in `../../data/question-bank.json`.
