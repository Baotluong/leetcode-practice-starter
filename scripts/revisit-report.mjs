#!/usr/bin/env node
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const ROOT = join(__dirname, "..");

function parseQueue() {
  const md = readFileSync(join(ROOT, "revisit.md"), "utf8");
  const lines = md.split("\n");

  const start = lines.findIndex((l) => l.startsWith("## Revisit queue"));
  if (start === -1) return [];

  const rows = [];
  for (let i = start; i < lines.length; i++) {
    const line = lines[i];
    if (i > start && line.startsWith("## ")) break;
    if (!line.startsWith("| ") || line.startsWith("|---")) continue;
    const cells = line
      .split("|")
      .slice(1, -1)
      .map((c) => c.trim());
    if (cells[0] === "#" || !/^\d+$/.test(cells[0])) continue;

    const [num, problem, archive, pass, lastSolved, nextEligibleRaw] = cells;
    const isNow = nextEligibleRaw === "now";
    const nextEligible = isNow
      ? null
      : nextEligibleRaw.replace(/\s*\(overdue\)\s*$/, "");

    rows.push({
      num,
      problem,
      archive,
      pass: Number.parseInt(pass, 10),
      lastSolved,
      nextEligible,
      isNow,
    });
  }
  return rows;
}

function daysUntil(dateStr, today) {
  const msPerDay = 1000 * 60 * 60 * 24;
  return Math.round((new Date(dateStr) - today) / msPerDay);
}

function main() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayStr = today.toISOString().slice(0, 10);

  const rows = parseQueue();
  if (rows.length === 0) {
    console.log("Revisit queue is empty.");
    return;
  }

  const overdue = [];
  const dueToday = [];
  const upcoming = [];

  for (const row of rows) {
    if (row.isNow) {
      overdue.push({ ...row, delta: null });
      continue;
    }
    const delta = daysUntil(row.nextEligible, today);
    if (delta < 0) overdue.push({ ...row, delta });
    else if (delta === 0) dueToday.push({ ...row, delta });
    else upcoming.push({ ...row, delta });
  }

  overdue.sort((a, b) => (a.delta ?? -Infinity) - (b.delta ?? -Infinity));
  upcoming.sort((a, b) => a.delta - b.delta);

  const fmt = (r) => {
    const tag = r.isNow
      ? "now"
      : r.delta < 0
        ? `${-r.delta}d overdue`
        : r.delta === 0
          ? "due today"
          : `in ${r.delta}d`;
    return `  [Pass ${r.pass}] ${r.num} ${r.problem} — ${tag}`;
  };

  console.log(`\nRevisit Breakdown — ${todayStr}\n${"=".repeat(40)}`);

  if (upcoming.length) {
    console.log(`\nUpcoming (${upcoming.length}):`);
    upcoming.forEach((r) => console.log(fmt(r)));
  }
  if (dueToday.length) {
    console.log(`\nDue today (${dueToday.length}):`);
    dueToday.forEach((r) => console.log(fmt(r)));
  }
  if (overdue.length) {
    console.log(`\nOverdue / eligible now (${overdue.length}):`);
    overdue.forEach((r) => console.log(fmt(r)));
  }

  const byPass = {};
  for (const r of rows) byPass[r.pass] = (byPass[r.pass] ?? 0) + 1;
  console.log(`\nTotal in queue: ${rows.length}`);
  console.log(
    `By pass: ${Object.entries(byPass)
      .sort()
      .map(([p, c]) => `Pass ${p}: ${c}`)
      .join(", ")}`,
  );
  console.log("");
}

main();
