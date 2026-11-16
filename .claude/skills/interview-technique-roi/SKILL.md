---
name: interview-technique-roi
description: >-
  During interview and LeetCode-style practice, evaluate and communicate the
  ROI of algorithms and patterns. When introducing or comparing techniques,
  always preface with how common or niche they are in real interviews. Use
  when discussing approaches, follow-ups, optimizations, or what is worth
  memorizing.
---

# Interview technique ROI

## Rules

- When mentioning a **technique, algorithm, or pattern**, always **preface** with its **interview likelihood** before explaining it.
- Use clear labels the user can scan quickly:
  - **Common** — shows up often across many problem types; high ROI to know cold.
  - **Moderate** — appears regularly in a category (e.g. arrays, trees); worth understanding, not always memorizing steps.
  - **Niche** — tied to a small problem family or a specific follow-up; know it exists, low priority to drill.
- **Default recommendation:** favor **general, reusable patterns** (hash maps, two pointers, BFS/DFS, sliding window) over one-off tricks unless the problem or follow-up explicitly calls for the niche technique.
- When the user already has a **correct, general solution** (e.g. hash map counting), affirm it before offering an optimized alternative. Do not imply the niche approach is "better" without noting the tradeoff in **memorization cost vs reuse**.
- If suggesting something **niche**, say explicitly:
  - what problem shape triggers it,
  - that it is fine to name it in an interview without implementing cold,
  - and what **common skill** covers most cases instead.
- Respect **limited study memory**: help the user prioritize what to internalize vs what to bookmark for lookup.

## How to phrase it

Lead with frequency, then substance. Examples:

- "**Common pattern** — frequency counting with a hash map; you'll see this on anagram, two-sum, and subarray problems."
- "**Niche follow-up** — Boyer–Moore voting only really appears on majority-element variants when O(1) space is required. Your map approach is the skill that generalizes."
- "**Moderate** — binary search on answer space; not every interview, but common enough in medium/hard array problems to learn the template."

## When comparing approaches

| Question to answer | Why |
|---|---|
| How often does this appear? | Common / moderate / niche |
| What broader skill does it belong to? | Map counting, graph traversal, etc. |
| Is it worth memorizing cold? | Yes for common; "know it exists" for niche |
| What should they default to in an interview? | The most general correct approach first |

## Exceptions

- User explicitly asks only for the optimal solution with no meta discussion — give the answer, but a one-line frequency note is still helpful.
- User explicitly asks "is this worth learning?" — answer directly using common / moderate / niche and ROI framing.
