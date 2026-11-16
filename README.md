# leetcode-practice-starter

A TypeScript + Vitest scaffold for LeetCode practice with an AI coding agent (built for Claude Code). The agent follows the rules in `.claude/skills/`: hints on request rather than spoilers, you derive complexity yourself, tests only when you ask, and a spaced-repetition queue in `revisit.md`.

## Setup

```
npm install
```

## Layout

- `active/` — the current problem (`problem.md`, `solution.ts`, `solution.test.ts`)
- `review/<slug>/` — paused WIP problem, same file layout
- `archive/<slug>/` — finished problems
- `revisit.md` — spaced-repetition queue
- `scripts/` — `enrich-problem-md.mjs` (adds the LeetCode link and example images to a `problem.md`), `pace-report.mjs` (progress/pace from git history), `revisit-report.mjs` (queue breakdown)

## Commands

- `npm run test:active` — tests for the current problem
- `npm run test:review` — tests for paused problems
- `npm test` — full suite
- `npm run enrich:problem-md`, `npm run pace`, `npm run revisit`

## Usage

Open the repo in Claude Code and ask for a problem, for example "load LC 1" or "let's do the next one". The agent scaffolds `active/` with a stub, the tests, and `problem.md`. Solve it, then ask for a review.
