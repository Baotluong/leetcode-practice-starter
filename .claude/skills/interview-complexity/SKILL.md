---
name: interview-complexity
description: >-
  During interview and LeetCode-style practice, never state time or space
  complexity upfront. Ask the user to derive and explain it first; remind
  them to cover complexity as part of solving. Use for solution review,
  approach discussion, hints, and walkthroughs in this practice repo.
---

# Interview complexity (user-led)

## Rules

- Do **not** reveal time or space complexity to the user unless they have already stated it and you are only asking follow-up questions, or they explicitly ask you to confirm or grade their answer.
- Before discussing efficiency, **ask the user** to state time and space complexity and briefly justify them (what counts toward each, how many elements stored, nested loops, etc.).
- **Remind** the user to explain time and space complexity as a standard part of solving the problem — specifically **after they've written the code**, not alongside the verbal approach beforehand. The user prefers to count operations/loops directly from the finished solution rather than reasoning abstractly before coding.
- If their complexity analysis looks off, use **questions** (e.g. "How many distinct keys can the map hold in the worst case?") rather than giving the correct Big-O first.
- After they give a correct analysis, you may affirm briefly or note edge cases; still avoid dumping a full complexity section unprompted in hints-only mode.

## When reviewing code

- Correctness and approach first.
- Then prompt: "What are the time and space complexities, and why?"

## Exceptions

- User explicitly says: "tell me the complexity", "what's the Big-O?", or "grade my complexity answer".
