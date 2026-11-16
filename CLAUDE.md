# leetcode-practice-starter

FAANG/LeetCode algorithm practice repo. TypeScript + Vitest.

## Layout

- `active/` — current problem (`problem.md`, `solution.ts`, `solution.test.ts`)
- `review/<slug>/` — paused WIP problem, same file layout, switched in/out of `active/`
- `archive/<slug>/` — finished problems, each with `problem.md`, `solution.ts`, `solution.test.ts`
- `revisit.md` — fixed 4-pass spaced-repetition queue for problems worth a second look
- `scripts/enrich-problem-md.mjs` — fetches LeetCode link + remote example-image links into a `problem.md`
- `scripts/pace-report.mjs` — computes LC150 progress, overall/recent pace, and projected finish date from git history

## Commands

- `npm run test:active` — run tests for the current problem
- `npm run test:review` — run tests for paused WIP problems
- `npm test` — full suite
- `npm run enrich:problem-md` — backfill LeetCode links/images across all problems
- `npm run pace` — LC150 progress/pace report (relies on commit dates — see workflow skill for the commit-cadence caveat)
- `npm run revisit` — breakdown of the `revisit.md` queue: overdue, due today, and upcoming, grouped by pass

## Workflow

All behavioral rules (hints vs. spoilers, no unsolicited complexity analysis, ROI framing, revisit-tier upkeep, when to run tests) live in `.claude/skills/` — see `interview-practice-workflow`, `interview-technique-roi`, `interview-complexity`. This file is just the structural map; don't duplicate the rules here.
