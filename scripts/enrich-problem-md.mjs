/**
 * Enrich problem.md with LeetCode link and remote example image links.
 * Usage: node scripts/enrich-problem-md.mjs [--all] [path/to/problem.md ...]
 */
import {
  readFileSync,
  readdirSync,
  rmSync,
  statSync,
  writeFileSync,
} from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");

const SLUG_OVERRIDES = {
  "three-sum": "3sum",
  "two-sum-ii": "two-sum-ii-input-array-is-sorted",
  "find-first-occurrence-in-string":
    "find-the-index-of-the-first-occurrence-in-a-string",
};

const GRAPHQL = "https://leetcode.com/graphql";
const QUERY = `query getQuestion($titleSlug: String!) {
  question(titleSlug: $titleSlug) { titleSlug content }
}`;

async function fetchQuestion(slug) {
  const res = await fetch(GRAPHQL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query: QUERY, variables: { titleSlug: slug } }),
  });
  const json = await res.json();
  return json.data?.question ?? null;
}

function parseProblemNumber(md) {
  const match = md.replace(/^﻿/, "").match(/^# (\d+)\./m);
  return match ? Number.parseInt(match[1], 10) : null;
}

async function resolveSlug(problemMdPath, md) {
  const folder = dirname(problemMdPath).split(/[/\\]/).pop();
  if (folder !== "active") {
    return SLUG_OVERRIDES[folder] ?? folder;
  }
  const num = parseProblemNumber(md);
  if (!num) return folder;
  const res = await fetch("https://leetcode.com/api/problems/all/");
  const json = await res.json();
  const pair = json.stat_status_pairs.find(
    (p) => p.stat.frontend_question_id === num,
  );
  return pair?.stat.question__title_slug ?? folder;
}

function parseExampleImages(html) {
  const images = new Map();
  const parts = html.split(
    /<strong[^>]*class="example"[^>]*>Example\s*(\d+):<\/strong>/gi,
  );
  for (let i = 1; i < parts.length; i += 2) {
    const num = Number.parseInt(parts[i], 10);
    const block = parts[i + 1] ?? "";
    const match = block.match(/<img[^>]+src="([^"]+)"/i);
    if (match) images.set(num, match[1]);
  }
  return images;
}

function removeLocalImagesDir(problemDir) {
  rmSync(join(problemDir, "images"), { recursive: true, force: true });
}

function exampleImageLine(n, url) {
  return `![Example ${n}](${url})`;
}

function hasLeetCodeLink(md) {
  return /leetcode\.com\/problems\//i.test(md);
}

function enrichMarkdown(md, slug, remoteImages) {
  const url = `https://leetcode.com/problems/${slug}/`;
  const lines = md.split(/\r?\n/);
  const out = [];
  let linkInserted = hasLeetCodeLink(md);

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].replace(/^\uFEFF/, "");

    // Drop any existing example image line (local or remote) so it can be
    // replaced with a fresh remote link below.
    if (/^!\[Example \d+\]\(.*\)$/.test(line)) {
      continue;
    }

    if (!linkInserted && /^# \d+\./.test(line)) {
      out.push(line);
      out.push("");
      out.push(`[View on LeetCode](${url})`);
      linkInserted = true;
      continue;
    }

    const exMatch = line.match(/^\*\*Example (\d+):\*\*$/);
    if (exMatch) {
      const n = Number.parseInt(exMatch[1], 10);
      const remoteUrl = remoteImages.get(n);
      out.push(line);
      if (remoteUrl) {
        out.push("");
        out.push(exampleImageLine(n, remoteUrl));
      }
      continue;
    }

    out.push(line);
  }

  let result = out.join("\n");
  if (!result.endsWith("\n")) result += "\n";
  return result;
}

async function enrichFile(problemMdPath) {
  const abs = resolve(problemMdPath);
  const problemDir = dirname(abs);
  let md = readFileSync(abs, "utf8").replace(/^\uFEFF/, "");
  const slug = await resolveSlug(abs, md);
  const question = await fetchQuestion(slug);

  if (!question) {
    console.warn(`skip (no GraphQL match): ${abs} (slug: ${slug})`);
    return false;
  }

  const remoteImages = parseExampleImages(question.content ?? "");
  removeLocalImagesDir(problemDir);

  const enriched = enrichMarkdown(md, question.titleSlug, remoteImages);

  if (enriched === md) {
    console.log(`unchanged: ${abs}`);
    return false;
  }

  writeFileSync(abs, enriched, "utf8");
  const imgNote = remoteImages.size
    ? `, ${remoteImages.size} remote image link(s)`
    : "";
  console.log(`updated: ${abs}${imgNote}`);
  return true;
}

function collectAllProblemMd() {
  const paths = [];
  for (const dir of ["active", "review", "archive"]) {
    const base = join(ROOT, dir);
    if (dir === "active") {
      paths.push(join(base, "problem.md"));
      continue;
    }
    let names;
    try {
      names = readdirSync(base);
    } catch {
      continue;
    }
    for (const name of names) {
      const p = join(base, name, "problem.md");
      try {
        if (statSync(p).isFile()) paths.push(p);
      } catch {}
    }
  }
  return paths;
}

async function main() {
  const args = process.argv.slice(2);
  const paths =
    args.includes("--all") || args.length === 0
      ? collectAllProblemMd()
      : args.filter((a) => a !== "--all").map((p) => resolve(p));

  let updated = 0;
  for (const p of paths) {
    if (await enrichFile(p)) updated++;
    await new Promise((r) => setTimeout(r, 150));
  }
  console.log(`\nDone. ${updated} file(s) updated.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});