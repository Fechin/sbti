---
name: sbti
description: Run the SBTI personality test when users ask for an SBTI assessment, internet personality type, or a playful personality quiz. Use the local sbti CLI when available; otherwise follow the bundled question bank and compute the result from the 15-dimension matching rules.
---

# SBTI Skill

This repository is both:

- an npm package that exposes the `sbti` CLI
- an installable skill repository

## Preferred execution path

1. Use `sbti` if the CLI is installed.
2. For a non-interactive smoke test, run `sbti --preset CTRL --json`.
3. For a full user session, run `sbti` and ask the questions in the user's preferred language.

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
