---
name: interview-practice-workflow
description: >-
  Workflow rules for LeetCode-style practice in this repo. Do not run tests
  unless the user asks. Maintain revisit.md and occasionally remind the user
  to revisit listed problems. Use when setting up problems, reviewing
  solutions, fixing code, or archiving completed work.
---

# Interview practice workflow

## Rules

- Do **not** run tests (`npm test`, `vitest`, `npm run test:active`, etc.) unless the user **explicitly asks** you to run or verify tests.
- When reviewing code, fixing bugs, or answering questions, rely on **reading the code**, **reasoning**, and **static checks** — not executing the test suite.
- If verification would normally require tests, tell the user they can run tests locally (e.g. `npm run test:active`) instead of running them yourself.
- Only run tests when the user says things like: "run tests", "verify", "make sure tests pass", or similar explicit requests.
- If you do run tests, scope them to the smallest relevant target (e.g. `vitest run active` or `vitest run review/<slug>`) rather than the whole suite, to keep output small.

## Hints vs approach (problem start)

- When **loading or starting** a new problem (setup, revisit pull, user pastes problem text), confirm what is in `active/` and how to run tests — **do not** state the approach, algorithm, pattern name, or solution hints unless the user asks.
- When loading a **revisit pull** specifically, also state its current pass count from `revisit.md` (e.g. "this is on Pass 2") so the user knows what a successful redo would advance it to.
- The user prefers to reason first; offer **hints on request** (e.g. "hint", "stuck", "nudge") — escalate gradually: nudge → pattern family → key invariant → template only if they want more.
- Still OK without being asked: answer clarifying questions about the **problem statement** (constraints, examples, terminology) — not how to solve it.
- **Review / fix / walkthrough** requests are different: those may include full approach when the user asks to review, fix code, or show the solution.

### Approach submission (user states their plan) and code review

- When the user **submits an approach** (before/while coding) or **submits finished code for review**, **do not judge on correctness alone** — also weigh it against other viable approaches for the same problem on **memorability / ROI**, even when what they wrote is already a recognized standard pattern.
- If a problem has **multiple common viable approaches** (e.g. Set-based expand/shrink window vs. map-jump window), briefly name that a simpler-to-remember or higher-ROI alternative exists, even if their version is correct and not "wrong" to use. One line is enough — don't force a switch.
- If their approach is **correct but non-standard or harder to remember** (same time/space), say so **immediately** — before they spend time implementing. Give a **brief** contrast: what they proposed vs the usual template, and **why** the standard one is easier (e.g. fewer edge cases, no trailing flush, one push per unit of work).
- If a **clearly better** approach exists (simpler or fewer bugs, not just stylistic), recommend switching; offer a one-paragraph mental model, not a full code dump unless they ask.
- If their approach **is** the most standard/highest-ROI one already, affirm in one line and let them code — no need to invent alternatives just to have something to say.
- When confirming a correct (or mostly correct) stated approach, include a tight 2-3 line precise restatement of it — the user's own phrasing is often a rambling first draft and they want to see the crisp version to compare against. Skip this when they ask for the "short description"/"brief paragraph" separately (that already serves the same purpose).
- Keep the restatement **speakable, in plain terms** — minimal inline code syntax (a variable name or short expression is fine, but avoid leaning on code-snippet-style notation). The point is a verbal summary the user could say out loud in an interview, not a pseudocode transcript.
- Alongside that restatement, add a short "recognition signal" note — what in the problem statement/constraints indicates this technique/pattern (e.g., "binary search — sorted input + needing better than O(n)"; "heap — repeatedly need the current min/max from a changing pool"). One or two lines, not a full lecture. This is a standing preference, not a one-off.
- When the user correctly states an approach that involves a heap, proactively add the relevant import (`MinPriorityQueue` and/or `MaxPriorityQueue` from `@datastructures-js/priority-queue`) to `active/solution.ts` right away, rather than waiting for them to ask — same for other approach-driven imports if a similar pattern emerges.
- The user's explicit priority is **minimizing the number of distinct patterns/templates to memorize**, not optimizing each solution individually. When presenting canonical solutions or comparing approaches, frame it around "which of the fewest reusable templates covers the most problems" rather than "what's most idiomatic for this one problem." Prefer recommending the approach that generalizes to other problems the user has already solved, even if a more specialized/optimal approach exists for this specific one.
- Do **not** volunteer approach on problem **load** — this rule applies only when the user explicitly shares their plan ("my approach is…", "I would do…", complexity analysis, etc.) or submits code for review.

### After code review: always show the canonical solution

- **Every** time the user says "review" (or otherwise asks to check finished code) and the verdict is "correct" — including quick follow-up re-reviews after a bug fix, not just the first review of a problem — end the response with the canonical/reference solution as a code block. This is not optional and does not get skipped for brevity.
- Purpose: let the user compare variable naming, structuring, and small stylistic choices against a reference, not just get a correctness verdict. This applies whether or not there's a substantive algorithmic difference to flag.
- Keep it tight: the code block plus a short note on any naming/structure differences worth adopting. Don't repeat a full walkthrough/trace if one was already given earlier in the review.
- Before sending a "review" response, self-check: does this response end with a canonical-solution code block? If the verdict is "correct" and it doesn't, add it before replying.

## ROI gate (new problems)

- When the user asks to **move to a new problem** (paste problem text, "load LC X", "next problem", etc.), **check ROI first** using `interview-technique-roi` framing (common / moderate / niche).
- **Common or moderate** → load into `active/` (stub only) without asking.
- **Niche / rare** → **ask the user before** updating `active/`; briefly state why ROI is low and offer alternatives (skip, bookmark, or load anyway). This applies even when advancing through an LC150 section in sequence — do not silently scaffold a niche problem just because it's next on the list.
- Revisit pulls (from the `revisit.md` queue) skip the ROI gate — user already chose to rework.
- ROI note when loading: one short line only (e.g. "**Moderate** — hashing / grid validation"); no approach hints.

## When setting up or archiving problems

### `problem.md` enrichment (LeetCode link + example images)

- When setting up or pulling a problem into `active/`, run `node scripts/enrich-problem-md.mjs active/problem.md` (or `npm run enrich:problem-md` for a full backfill).
- The script fetches LeetCode GraphQL content and updates `problem.md` to include:
  - `[View on LeetCode](https://leetcode.com/problems/<slug>/)` directly under the `# N. Title` heading
  - `![Example N](https://assets.leetcode.com/...)` — a **remote** link straight to LeetCode's hosted image when a diagram exists. Images are not downloaded locally; the script cleans up any leftover `images/` folder it finds.
- When copying a problem from `archive/` to `active/`, no `images/` folder to copy — the remote link travels with `problem.md` automatically.
- Archive folder name is the LeetCode slug except known overrides (`three-sum` -> `3sum`, etc.). For `active/`, slug is resolved from the problem number in the title.

- Follow the repo pattern: `active/` for the current problem; `archive/<problem-slug>/` when done.

### `review/` (paused in-progress)

- Mirror of `active/` for problems you are **switching between** without archiving.
- Layout: `review/<problem-slug>/` with `problem.md`, `solution.ts`, `solution.test.ts`.
- Use `review/` for WIP you intend to return to soon; use `archive/` only when a problem is **done** and added to the `revisit.md` queue.
- **Switch focus:** swap contents between `active/` and `review/<slug>/` (or copy problem folder into `active/` and move the old `active/` problem into `review/<slug>/`).
- Run tests: `npm run test:active` or `npm run test:review` (or `vitest run review/<slug>` for one bench problem).
- Do not put solution code in `review/` during initial load unless the user already wrote it there; stubs only on first setup.

- **`active/solution.ts` must be a stub only** — export the function with `// Your solution here` (or empty body). **Never** paste or implement the solution during setup, even if the user includes starter code, a reference solution, or a full answer in the problem message.
- Problem setup includes: `problem.md`, stub `solution.ts`, `solution.test.ts` — not a working implementation.
- Do not run tests after scaffolding a new problem unless asked.

## Revisit list (`revisit.md`)

- Keep **`revisit.md`** at the repo root as the user's **problems to revisit** list (problem #, name, archive path, why).
- When the user asks to add a problem to revisit, update `revisit.md` — do not rely on memory alone.
- **Occasionally remind** the user to revisit the list — not every message, but at natural breakpoints:
  - After archiving a problem (especially if it was hard or easily confused with another)
  - After completing 2–3 new problems in a session
  - When starting a new practice session after a gap
- Reminder format: brief — count of items, 1-line why, point to `revisit.md`. Offer to pull one into `active/` for a redo.
- Do not nag repeatedly in the same short thread; once per session breakpoint is enough.

### Revisit schedule (`revisit.md`) — fixed 4-pass spaced repetition, no tiers

`revisit.md` is a single flat queue (not tiered) with columns `# | Problem | Archive | Pass | Last solved | Next eligible | Notes`. Pass count and gates:

| Pass | Meaning | Gate before next pass |
|------|---------|------------------------|
| 1 | First solve (initial archive) | None — eligible next session |
| 2 | Second solve | ~3 days after the pass-2 date |
| 3 | Third solve | ~5-7 days after the pass-3 date |
| 4 | Fourth solve | **Done** — remove from `revisit.md` entirely |

- **First-time solves default to Pass 1** in the queue, not straight to a tier-less archive — a problem only skips `revisit.md` entirely if the user explicitly says to just archive it (e.g. "archive this" / "no need to revisit").
- On a **successful** redo, increment the pass count, update `Last solved` to today, and recompute `Next eligible` per the gate table above (or remove the row entirely if it just became pass 4).
- On a **struggling** redo (bug, needed a hint) — **do not reset the pass count**. Leave `Pass` as-is, update `Last solved` to today, and set `Next eligible` to "now" (try again soon) rather than the normal multi-day gate. The next real gate only starts counting once a pass actually succeeds.
- **Do not** offer or load a problem for redo before its `Next eligible` date, unless the user explicitly asks for it anyway.
- When pulling the next rework, any eligible item (overdue or due today) is fair game — don't default to strict most-overdue-first ordering. The user prefers a mix across passes/topics rather than always draining the oldest-overdue items first; offer a reasonable pick or ask, rather than mechanically sorting by `Next eligible` date.
- After a correct review during a revisit redo, **do not automatically pull the next problem** — ask first (e.g. "want another pull, or take more time with this one?"). Only skip asking when the user has given a standing instruction to keep chaining pulls without confirmation for the rest of the session.
- During revisit redos, don't just rubber-stamp a stated time/space complexity — actually engage with it (confirm precisely, correct if wrong, or dig into *why* when it's non-obvious, per [[interview-complexity]]). A bare "yep, that's right" is not enough on its own.

## Pace report (`npm run pace`)

- `scripts/pace-report.mjs` derives active-day counts and cadence from **git commit dates** (`git log --diff-filter=A` on `archive/*/solution.ts`), not from when the work actually happened. If a session isn't committed, it doesn't count as an active day, and multiple uncommitted sessions later squashed into one commit will undercount.
- Occasionally remind the user to commit at the end of a practice session (not every message — at natural breakpoints, similar cadence to the revisit-list reminder) so the pace numbers stay meaningful. One line is enough, e.g. "worth a commit before wrapping up, so today counts toward the pace report."
- If a new "extra pick" (non-LC150 problem) gets archived, add its slug to `NON_LC150_SLUGS` in `scripts/pace-report.mjs` so the LC150 count stays accurate.

## Exceptions

- User explicitly requests a test run or verification via tests.
- User asks to debug a failing test and provides output — analyze the output; still do not auto-run tests unless they ask you to.
