#!/usr/bin/env node
import { execSync } from "node:child_process";

// Update this list whenever an "extra pick" (not part of the official
// LeetCode Top Interview 150 list) gets archived, so the LC150 count
// stays accurate.
const NON_LC150_SLUGS = new Set([]);

const LC150_TOTAL = 150;
const RECENT_ACTIVE_DAYS = 5;

function run(cmd) {
  return execSync(cmd, { cwd: new URL("..", import.meta.url), encoding: "utf8" });
}

function getArchiveDatesBySlug() {
  const raw = run(
    `git log --diff-filter=A --name-only --pretty=format:"COMMIT|%ad" --date=short -- 'archive/*/solution.ts'`
  );

  const bySlug = new Map();
  let date = null;
  for (const line of raw.split("\n")) {
    if (line.startsWith("COMMIT|")) {
      date = line.slice("COMMIT|".length);
      continue;
    }
    const match = line.match(/^archive\/([^/]+)\/solution\.ts$/);
    if (!match) continue;
    const slug = match[1];
    // Keep the earliest date seen per slug (renames/moves can re-add a file).
    if (!bySlug.has(slug) || date < bySlug.get(slug)) {
      bySlug.set(slug, date);
    }
  }
  return bySlug;
}

function daysBetween(a, b) {
  const msPerDay = 1000 * 60 * 60 * 24;
  return Math.round((new Date(b) - new Date(a)) / msPerDay);
}

function formatDate(d) {
  return d.toISOString().slice(0, 10);
}

function projectFinish(remaining, problemsPerActiveDay, calendarDaysPerActiveDay, fromDate) {
  const activeDaysNeeded = remaining / problemsPerActiveDay;
  const calendarDaysNeeded = Math.ceil(activeDaysNeeded * calendarDaysPerActiveDay);
  const finish = new Date(fromDate);
  finish.setDate(finish.getDate() + calendarDaysNeeded);
  return { activeDaysNeeded, calendarDaysNeeded, finish };
}

function main() {
  const bySlug = getArchiveDatesBySlug();

  const lc150Dates = [];
  const extraCount = { value: 0 };
  for (const [slug, date] of bySlug) {
    if (NON_LC150_SLUGS.has(slug)) {
      extraCount.value++;
    } else {
      lc150Dates.push(date);
    }
  }

  const lc150Done = lc150Dates.length;
  const remaining = LC150_TOTAL - lc150Done;

  const byDate = new Map();
  for (const date of lc150Dates) {
    byDate.set(date, (byDate.get(date) ?? 0) + 1);
  }
  const sortedDates = [...byDate.keys()].sort();

  const firstDate = sortedDates[0];
  const today = formatDate(new Date());
  const totalActiveDays = sortedDates.length;
  const totalCalendarDays = daysBetween(firstDate, today) + 1;
  const overallPace = lc150Done / totalActiveDays;
  const overallCadence = totalCalendarDays / totalActiveDays;

  const recentDates = sortedDates.slice(-RECENT_ACTIVE_DAYS);
  const recentCount = recentDates.reduce((sum, d) => sum + byDate.get(d), 0);
  const recentPace = recentCount / recentDates.length;
  const recentSpanDays = daysBetween(recentDates[0], today) + 1;
  const recentCadence = recentSpanDays / recentDates.length;

  const overallProjection = projectFinish(remaining, overallPace, overallCadence, today);
  const recentProjection = projectFinish(remaining, recentPace, recentCadence, today);

  console.log(`\nLC150 Pace Report — ${today}\n${"=".repeat(40)}`);
  console.log(`Progress: ${lc150Done}/${LC150_TOTAL} (${remaining} remaining)`);
  if (extraCount.value > 0) {
    console.log(`(+ ${extraCount.value} extra picks archived, not counted toward LC150)`);
  }

  console.log(`\nOverall pace (since ${firstDate}, ${totalActiveDays} active days / ${totalCalendarDays} calendar days):`);
  console.log(`  ${overallPace.toFixed(1)} problems/active day, ~1 active day per ${overallCadence.toFixed(1)} calendar days`);
  console.log(`  Projected finish: ${formatDate(overallProjection.finish)} (~${overallProjection.calendarDaysNeeded} days from today)`);

  console.log(`\nRecent pace (last ${recentDates.length} active days: ${recentDates.join(", ")}):`);
  console.log(`  ${recentPace.toFixed(1)} problems/active day, ~1 active day per ${recentCadence.toFixed(1)} calendar days`);
  console.log(`  Projected finish: ${formatDate(recentProjection.finish)} (~${recentProjection.calendarDaysNeeded} days from today)`);
  console.log("");
}

main();
