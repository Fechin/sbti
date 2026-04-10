---
name: sbti
description: Run the SBTI personality test when users ask for an SBTI assessment, internet personality type, or a quick personality quiz. Prefer the local sbti CLI if it exists; otherwise guide the user through the same question flow and compute the result with the bundled question bank.
---

# SBTI Skill

Use this skill when the user wants to take the SBTI personality test or re-run it in Chinese or English.

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

## Notes

- The test uses 30 standard questions across 15 dimensions.
- Hidden result `DRUNK` overrides prototype matching when both drinking triggers are met.
- Fallback result `HHHH` is used when the best standard match is below 60%.
- Source data lives in `../../data/question-bank.json`.
