import { competitors } from "./competitors.js";
import type { GitHubStats } from "./types.js";

export async function fetchGitHubStats(repo: string): Promise<GitHubStats | null> {
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
      console.error(`Failed to fetch ${repo}: ${response.status}`);
      return null;
    }

    const data = await response.json();

    return {
      stars: data.stargazers_count,
      forks: data.forks_count,
      issues: data.open_issues_count,
      lastCommit: data.pushed_at,
    };
  } catch (error) {
    console.error(`Error fetching ${repo}:`, error);
    return null;
  }
}

export async function fetchAllGitHubStats() {
  const results: Record<string, GitHubStats | null> = {};

  for (const competitor of competitors) {
    if (competitor.github) {
      console.log(`Fetching stats for ${competitor.name}...`);
      results[competitor.name] = await fetchGitHubStats(competitor.github);
      await new Promise((r) => setTimeout(r, 1000));
    }
  }

  return results;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const stats = await fetchAllGitHubStats();
  console.log("\n=== GitHub Stats ===\n");
  for (const [name, data] of Object.entries(stats)) {
    if (data) {
      console.log(`${name}:`);
      console.log(`  Stars: ${data.stars}`);
      console.log(`  Forks: ${data.forks}`);
      console.log(`  Open Issues: ${data.issues}`);
      console.log(`  Last Commit: ${data.lastCommit}`);
      console.log();
    }
  }
}
