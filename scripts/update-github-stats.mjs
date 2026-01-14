#!/usr/bin/env node

/**
 * Auto-refresh GitHub stats (stars, forks) for all skills
 *
 * Usage:
 *   node scripts/update-github-stats.mjs
 *   GITHUB_TOKEN=xxx node scripts/update-github-stats.mjs
 */

import { readdir, readFile, writeFile } from "fs/promises";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const SKILLS_DIR = join(__dirname, "../data/skills");

async function fetchGitHubStats(repo) {
  try {
    const response = await fetch(`https://api.github.com/repos/${repo}`, {
      headers: {
        Accept: "application/vnd.github.v3+json",
        ...(process.env.GITHUB_TOKEN && {
          Authorization: `token ${process.env.GITHUB_TOKEN}`,
        }),
      },
    });

    if (!response.ok) {
      console.error(`  ⚠️  Failed to fetch ${repo}: ${response.status}`);
      return null;
    }

    const data = await response.json();
    return {
      stars: data.stargazers_count,
      forks: data.forks_count,
    };
  } catch (error) {
    console.error(`  ⚠️  Error fetching ${repo}:`, error.message);
    return null;
  }
}

function extractRepoFromUrl(url) {
  if (!url) return null;
  const match = url.match(/github\.com\/([^\/]+\/[^\/]+)/);
  return match ? match[1].replace(/\.git$/, "") : null;
}

async function updateSkillStats() {
  console.log("🔄 Updating GitHub stats for skills...\n");

  const files = await readdir(SKILLS_DIR);
  const jsonFiles = files.filter((f) => f.endsWith(".json"));

  let updated = 0;
  let skipped = 0;
  let failed = 0;

  for (const file of jsonFiles) {
    const filePath = join(SKILLS_DIR, file);
    const content = await readFile(filePath, "utf-8");
    const skill = JSON.parse(content);

    const repoUrl = skill.links?.repo;
    const repo = extractRepoFromUrl(repoUrl);

    if (!repo) {
      console.log(`⏭️  ${skill.name}: No GitHub repo found, skipping`);
      skipped++;
      continue;
    }

    console.log(`📊 ${skill.name} (${repo})`);

    const stats = await fetchGitHubStats(repo);

    if (stats) {
      const oldStars = skill.stats?.stars || 0;
      const oldForks = skill.stats?.forks || 0;

      // Only update if values changed
      if (oldStars !== stats.stars || oldForks !== stats.forks) {
        skill.stats = {
          ...skill.stats,
          stars: stats.stars,
          forks: stats.forks,
        };

        await writeFile(filePath, JSON.stringify(skill, null, 2) + "\n");

        console.log(
          `  ✅ Updated: ⭐ ${oldStars} → ${stats.stars}, 🍴 ${oldForks} → ${stats.forks}`
        );
        updated++;
      } else {
        console.log(`  ℹ️  No changes (⭐ ${stats.stars}, 🍴 ${stats.forks})`);
        skipped++;
      }
    } else {
      failed++;
    }

    // Rate limit: wait 1 second between requests
    await new Promise((r) => setTimeout(r, 1000));
  }

  console.log("\n" + "=".repeat(50));
  console.log(`✅ Updated: ${updated}`);
  console.log(`⏭️  Skipped: ${skipped}`);
  console.log(`❌ Failed: ${failed}`);
  console.log("=".repeat(50));

  return { updated, skipped, failed };
}

// Run if called directly
updateSkillStats().catch(console.error);
